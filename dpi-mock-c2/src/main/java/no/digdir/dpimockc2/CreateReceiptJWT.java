package no.digdir.dpimockc2;

import lombok.RequiredArgsConstructor;
import no.difi.meldingsutveksling.domain.sbdh.*;
import no.digdir.dpi.client.domain.messagetypes.AvsenderHolder;
import no.digdir.dpi.client.domain.messagetypes.MessageType;
import no.digdir.dpi.client.domain.sbd.Avsender;
import no.digdir.dpi.client.domain.sbd.Identifikator;
import no.digdir.dpi.client.domain.sbd.Virksomhetmottaker;
import no.digdir.dpi.client.internal.CreateInstanceIdentifier;
import org.springframework.stereotype.Component;

import java.time.Clock;
import java.time.OffsetDateTime;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class CreateReceiptJWT {

    private final CreateInstanceIdentifier createInstanceIdentifier;
    private final Clock clock;

    StandardBusinessDocument createReceiptStandardBusinessDocument(StandardBusinessDocument sbd, ReceiptFactory receiptFactory) {
        MessageType receiptType = receiptFactory.getMessageType();

        PartnerIdentification receiver = StandardBusinessDocumentUtils.getFirstReceiverIdentifier(sbd)
                .orElseThrow(() -> new IllegalArgumentException("Missing receiver!"));

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
                .setAny(receiptFactory.getReceipt(new ReceiptInput()
                        .setMottaker(new Virksomhetmottaker()
                                .setVirksomhetsidentifikator(getAvsender(sbd).getVirksomhetsidentifikator()))
                        .setAvsender(new Avsender()
                                .setVirksomhetsidentifikator(new Identifikator()
                                        .setAuthority(receiver.getAuthority())
                                        .setValue(receiver.getValue())
                                )
                        )));
    }

    private Avsender getAvsender(StandardBusinessDocument sbd) {
        return sbd.getBusinessMessage(AvsenderHolder.class)
                .flatMap(p -> Optional.ofNullable(p.getAvsender()))
                .orElseThrow(() -> new IllegalArgumentException("Missing Avsender!"));
    }
}
