package no.digdir.dpimockc2;

import com.nimbusds.jose.Payload;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import no.difi.meldingsutveksling.domain.sbdh.*;
import no.digdir.dpi.client.domain.Message;
import no.digdir.dpi.client.internal.UnpackJWT;
import no.digdir.dpi.client.internal.UnpackStandardBusinessDocument;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartRequest;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.Principal;
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
    private final CreateReceipt createReceipt;
    private final PrincipalService principalService;

    @PostMapping(path = "/send", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public void sendMessage(@AuthenticationPrincipal Principal principal, MultipartRequest multipartRequest) throws IOException {
        MultipartFile sbdFile = Optional.ofNullable(multipartRequest.getFile("sbd"))
                .orElseThrow(() -> new IllegalArgumentException("MultipartFile named sbd is missing!"));

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

        log.info("Received message, id={}, conversationId={}, receiver={}, sender={}",
                messageId, conversationId, receiver, sender);

        outgoingMessageInfoRepository.save(new OutgoingMessage()
                .setDashboardInfo(
                        new DashboardInfo()
                                .setMessageId(messageId)
                                .setReceiverOrgNum(receiver)
                                .setSenderOrgNum(sender)
                                .setConversationId(conversationId)));

        incomingMessageRepository.save(new IncomingMessage()
                .setPartnerIdentification(principalService.getDatabehandler(principal))
                .setDashboardInfo(
                        new DashboardInfo()
                                .setMessageId(messageId)
                                .setReceiverOrgNum(sender)
                                .setSenderOrgNum(receiver)
                                .setConversationId(conversationId))
                .setMessage(
                        new Message()
                                .setForettningsmelding(createReceipt.createReceipt(sbd))
                )
        );
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

    @GetMapping("/messages")
    public List<Message> getMessages(@AuthenticationPrincipal Principal principal) {
        PartnerIdentification databehandler = principalService.getDatabehandler(principal);
        List<Message> messages = incomingMessageRepository.findAll(databehandler)
                .stream()
                .limit(1000)
                .map(IncomingMessage::getMessage)
                .collect(Collectors.toList());
        log.info("GET /messages, found {} for {}", messages.size(), databehandler);
        return messages;
    }

    @PostMapping("/setmessageread/{id}")
    public void markAsRead(@AuthenticationPrincipal Principal principal, @PathVariable("id") String id) {
        PartnerIdentification databehandler = principalService.getDatabehandler(principal);
        log.info("POST /setmessageread/{} for {}", id, databehandler);
        incomingMessageRepository.deleteById(databehandler, id);
    }
}
