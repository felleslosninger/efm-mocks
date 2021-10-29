package no.digdir.dpimockc2;

import com.nimbusds.jose.Payload;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import no.difi.meldingsutveksling.domain.sbdh.*;
import no.difi.meldingsutveksling.dpi.client.domain.Message;
import no.difi.meldingsutveksling.dpi.client.domain.MessageStatus;
import no.difi.meldingsutveksling.dpi.client.domain.ReceiptStatus;
import no.difi.meldingsutveksling.dpi.client.domain.messagetypes.AvsenderHolder;
import no.difi.meldingsutveksling.dpi.client.domain.sbd.Avsender;
import no.difi.meldingsutveksling.dpi.client.internal.CreateStandardBusinessDocumentJWT;
import no.difi.meldingsutveksling.dpi.client.internal.UnpackJWT;
import no.difi.meldingsutveksling.dpi.client.internal.UnpackStandardBusinessDocument;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartRequest;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.Principal;
import java.time.Clock;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@PreAuthorize("hasAuthority('SCOPE_digitalpostinnbygger:send')")
@RequestMapping("/api/c2")
@RestController
@RequiredArgsConstructor
public class Corner2Controller {

    private final OutgoingMessageRepository outgoingMessageInfoRepository;
    private final IncomingMessageRepository incomingMessageRepository;
    private final UnpackJWT unpackJWT;
    private final UnpackStandardBusinessDocument unpackStandardBusinessDocument;
    private final CreateReceiptJWT createReceipt;
    private final PrincipalService principalService;
    private final CreateLeveringskvittering createLeveringskvittering;
    private final CreateStandardBusinessDocumentJWT createStandardBusinessDocumentJWT;
    private final Clock clock;

    @PostMapping(path = "/messages/out", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public void sendMessage(@AuthenticationPrincipal Principal principal,
                            MultipartRequest multipartRequest,
                            @RequestParam(value = "kanal", required = false) String kanal) throws IOException {
        MultipartFile sbdFile = Optional.ofNullable(multipartRequest.getFile("forretningsmelding"))
                .orElseThrow(() -> new IllegalArgumentException("MultipartFile named forretningsmelding is missing!"));

        StandardBusinessDocument sbd = getStandardBusinessDocument(sbdFile);

        String messageId = StandardBusinessDocumentUtils.getMessageId(sbd)
                .orElseThrow(() -> new IllegalArgumentException("Missing messageId"));
        String receiver = StandardBusinessDocumentUtils.getFirstReceiver(sbd)
                .flatMap(this::getValue)
                .orElseThrow(() -> new IllegalArgumentException("Missing receiver"));
        String sender = StandardBusinessDocumentUtils.getFirstSender(sbd)
                .flatMap(this::getValue)
                .orElseThrow(() -> new IllegalArgumentException("Missing sender"));
        String conversationId = StandardBusinessDocumentUtils.getScope(sbd, ScopeType.CONVERSATION_ID)
                .flatMap(p -> Optional.ofNullable(p.getInstanceIdentifier()))
                .orElseThrow(() -> new IllegalArgumentException("Missing conversationId"));

        String avsenderindikator = sbd.getBusinessMessage(AvsenderHolder.class)
                .flatMap(p -> Optional.ofNullable(p.getAvsender()))
                .map(Avsender::getAvsenderidentifikator)
                .orElse(null);

        log.info("Received message, id={}, conversationId={}, receiver={}, sender={}",
                messageId, conversationId, receiver, sender);

        PartnerIdentification databehandler = principalService.getDatabehandler(principal);

        outgoingMessageInfoRepository.save(new OutgoingMessage()
                .setPartnerIdentification(databehandler)
                .addStatus(new MessageStatus()
                        .setStatus(ReceiptStatus.OPPRETTET)
                        .setTimestamp(OffsetDateTime.now(clock))
                )
                .addStatus(new MessageStatus()
                        .setStatus(ReceiptStatus.SENDT)
                        .setTimestamp(OffsetDateTime.now(clock))
                )
                .setDashboardInfo(
                        new DashboardInfo()
                                .setMessageId(messageId)
                                .setReceiverOrgNum(receiver)
                                .setSenderOrgNum(sender)
                                .setConversationId(conversationId)
                                .setAvsenderidentifikator(avsenderindikator)
                                .setKanal(kanal)));

        StandardBusinessDocument receiptSBD = createReceipt.createReceiptStandardBusinessDocument(sbd, createLeveringskvittering);

        String receiptMessageId = StandardBusinessDocumentUtils.getMessageId(receiptSBD)
                .orElseThrow(() -> new IllegalArgumentException("Missing messageId"));

        incomingMessageRepository.save(new IncomingMessage()
                .setPartnerIdentification(databehandler)
                .setDashboardInfo(
                        new DashboardInfo()
                                .setMessageId(receiptMessageId)
                                .setReceiverOrgNum(sender)
                                .setSenderOrgNum(receiver)
                                .setConversationId(conversationId)
                                .setAvsenderidentifikator(avsenderindikator)
                                .setKanal(kanal))
                .setMessage(
                        new Message()
                                .setForretningsmelding(createReceiptJWT(receiptSBD))
                )
        );
    }

    String createReceiptJWT(StandardBusinessDocument receiptSBD) {
        return createStandardBusinessDocumentJWT.createStandardBusinessDocumentJWT(
                receiptSBD, null, null);
    }

    private Optional<String> getValue(Partner partner) {
        return Optional.ofNullable(partner)
                .flatMap(p -> Optional.ofNullable(p.getIdentifier()))
                .map(PartnerIdentification::getValue);
    }

    private StandardBusinessDocument getStandardBusinessDocument(MultipartFile sbdFile) throws IOException {
        String jwt = new String(sbdFile.getBytes(), StandardCharsets.UTF_8);
        Payload payload = unpackJWT.getPayload(jwt);
        return unpackStandardBusinessDocument.unpackStandardBusinessDocument(payload);
    }

    @GetMapping("/messages/out/{messageId}/statuses")
    public List<MessageStatus> getMessageStatuses(@AuthenticationPrincipal Principal principal,
                                                  @PathVariable("messageId") String messageId) {
        PartnerIdentification databehandler = principalService.getDatabehandler(principal);
        log.info("GET /messages/out/{}/statuses", messageId);
        List<MessageStatus> messageStatusList = outgoingMessageInfoRepository.getMessageStatusList(databehandler, messageId);
        if (messageStatusList.isEmpty()) {
            throw new NoContentException();
        }
        return messageStatusList;
    }

    @GetMapping("/messages/in")
    public List<Message> getMessages(@AuthenticationPrincipal Principal principal,
                                     @RequestParam(value = "avsenderidentifikator", required = false) String avsenderidentifikator,
                                     @RequestParam(value = "kanal", required = false) String kanal) {
        PartnerIdentification databehandler = principalService.getDatabehandler(principal);
        List<Message> messages = incomingMessageRepository.findAll(databehandler)
                .filter(p -> avsenderidentifikator == null || p.getDashboardInfo().getAvsenderidentifikator().equals(avsenderidentifikator))
                .filter(p -> kanal == null || p.getDashboardInfo().getKanal().equalsIgnoreCase(kanal))
                .limit(1000)
                .map(IncomingMessage::getMessage)
                .collect(Collectors.toList());
        log.info("GET /messages/in, found {} for {}", messages.size(), databehandler);
        return messages;
    }

    @PostMapping("/messages/in/{messageId}/read")
    public void markAsRead(@AuthenticationPrincipal Principal principal, @PathVariable("messageId") String messageId) {
        PartnerIdentification databehandler = principalService.getDatabehandler(principal);
        log.info("POST /messages/in/{}/read for {}", messageId, databehandler);
        incomingMessageRepository.deleteById(databehandler, messageId);
    }
}
