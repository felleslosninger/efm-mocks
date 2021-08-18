package no.digdir.dpimockc2;

import com.nimbusds.jose.Payload;
import lombok.RequiredArgsConstructor;
import no.difi.meldingsutveksling.domain.sbdh.*;
import no.digdir.dpi.client.domain.Message;
import no.digdir.dpi.client.internal.UnpackJWT;
import no.digdir.dpi.client.internal.UnpackStandardBusinessDocument;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartRequest;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RequestMapping("/api/c2")
@RestController
@RequiredArgsConstructor
public class Corner2Controller {

    private final OutgoingMessageRepository outgoingMessageInfoRepository;
    private final IncomingMessageRepository incomingMessageRepository;
    private final UnpackJWT unpackJWT;
    private final UnpackStandardBusinessDocument unpackStandardBusinessDocument;
    private final CreateReceipt createReceipt;

    @PostMapping(path = "/send", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public void sendMessage(MultipartRequest multipartRequest) throws IOException {

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

        outgoingMessageInfoRepository.save(new OutgoingMessage()
                .setDashboardInfo(
                        new DashboardInfo()
                                .setMessageId(messageId)
                                .setReceiverOrgNum(receiver)
                                .setSenderOrgNum(sender)
                                .setConversationId(conversationId)));

        incomingMessageRepository.save(new IncomingMessage()
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
    public List<Message> getMessages() {
        return incomingMessageRepository.findAll()
                .stream()
                .limit(1000)
                .map(IncomingMessage::getMessage)
                .collect(Collectors.toList());
    }

    @PostMapping("/setmessageread/{id}")
    public void markAsRead(@PathVariable("id") String id) {
        incomingMessageRepository.deleteById(id);
    }
}
