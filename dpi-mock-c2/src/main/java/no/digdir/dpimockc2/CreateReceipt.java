package no.digdir.dpimockc2;

import lombok.RequiredArgsConstructor;
import no.difi.meldingsutveksling.domain.sbdh.*;
import no.digdir.dpi.client.domain.messagetypes.MessageType;
import no.digdir.dpi.client.internal.CreateInstanceIdentifier;
import no.digdir.dpi.client.internal.CreateMaskinportenToken;
import no.digdir.dpi.client.internal.CreateStandardBusinessDocumentJWT;
import org.springframework.stereotype.Component;

import java.time.Clock;
import java.time.OffsetDateTime;

@Component
@RequiredArgsConstructor
public class CreateReceipt {

    private final CreateMaskinportenToken createMaskinportenToken;
    private final CreateStandardBusinessDocumentJWT createStandardBusinessDocumentJWT;
    private final CreateInstanceIdentifier createInstanceIdentifier;
    private final CreateLeveringskvittering createLeveringskvittering;
    private final Clock clock;

    String createReceipt(StandardBusinessDocument sbd) {
        String maskinportenToken = createMaskinportenToken.createMaskinportenTokenForReceiving();
        return createStandardBusinessDocumentJWT.createStandardBusinessDocumentJWT(
                createReceiptStandardBusinessDocument(sbd), null, maskinportenToken);
    }

    private StandardBusinessDocument createReceiptStandardBusinessDocument(StandardBusinessDocument sbd) {
        MessageType receiptType = MessageType.LEVERINGSKVITTERING;

        return new StandardBusinessDocument()
                .setStandardBusinessDocumentHeader(new StandardBusinessDocumentHeader()
                        .setHeaderVersion("1.0")
                        .setBusinessScope(sbd.getStandardBusinessDocumentHeader().getBusinessScope())
                        .setDocumentIdentification(new DocumentIdentification()
                                .setInstanceIdentifier(createInstanceIdentifier.createInstanceIdentifier())
                                .setStandard(receiptType.getStandard())
                                .setType(receiptType.getType())
                                .setTypeVersion("1.0")
                                .setCreationDateAndTime(OffsetDateTime.now(clock)))
                        .addSender(sbd.getStandardBusinessDocumentHeader().getFirstReceiver()
                                .orElseThrow(() -> new IllegalArgumentException("Missing receiver")))
                        .addReceiver(sbd.getStandardBusinessDocumentHeader().getFirstSender()
                                .orElseThrow(() -> new IllegalArgumentException("Missing sender")))
                        .setBusinessScope(new BusinessScope()
                                .addScope(StandardBusinessDocumentUtils.getScope(sbd, ScopeType.CONVERSATION_ID)
                                        .orElseThrow(() -> new IllegalArgumentException("Missing conversationId")))))
                .setAny(createLeveringskvittering.getLeveringskvittering(sbd));
    }
}
