package no.digdir.dpimockc2;

import lombok.RequiredArgsConstructor;
import no.difi.meldingsutveksling.UUIDGenerator;
import no.difi.meldingsutveksling.domain.PartnerIdentifier;
import no.difi.meldingsutveksling.domain.sbdh.*;
import no.difi.meldingsutveksling.dpi.client.domain.messagetypes.AvsenderHolder;
import no.difi.meldingsutveksling.dpi.client.domain.messagetypes.DpiMessageType;
import no.difi.meldingsutveksling.dpi.client.domain.sbd.Avsender;
import no.difi.meldingsutveksling.dpi.client.domain.sbd.Identifikator;
import no.difi.meldingsutveksling.dpi.client.domain.sbd.Virksomhetmottaker;
import org.springframework.stereotype.Component;

import java.time.Clock;
import java.time.OffsetDateTime;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class CreateReceiptJWT {

    private final Clock clock;
    private final UUIDGenerator uuidGenerator;

    StandardBusinessDocument createReceiptStandardBusinessDocument(StandardBusinessDocument sbd, ReceiptFactory receiptFactory) {
        DpiMessageType receiptType = receiptFactory.getMessageType();
        PartnerIdentifier receiver = Optional.ofNullable(sbd.getReceiverIdentifier())
                .orElseThrow(() -> new IllegalArgumentException("Missing receiver!"));
        PartnerIdentifier sender = Optional.ofNullable(sbd.getSenderIdentifier())
                .orElseThrow(() -> new IllegalArgumentException("Missing sender!"));
        return new StandardBusinessDocument()
                .setStandardBusinessDocumentHeader(new StandardBusinessDocumentHeader()
                        .setHeaderVersion("1.0")
                        .setBusinessScope(sbd.getStandardBusinessDocumentHeader().getBusinessScope())
                        .setDocumentIdentification(new DocumentIdentification()
                                .setInstanceIdentifier(uuidGenerator.generate())
                                .setStandard(receiptType.getStandard())
                                .setType(receiptType.getType())
                                .setTypeVersion("1.0")
                                .setCreationDateAndTime(OffsetDateTime.now(clock)))
                        .setSenderIdentifier(receiver)
                        .setReceiverIdentifier(sender)
                        .setBusinessScope(new BusinessScope()
                                .addScope(sbd.getScope(ScopeType.CONVERSATION_ID)
                                        .orElseThrow(() -> new IllegalArgumentException("Missing conversationId")))))
                .setAny(receiptFactory.getReceipt(new ReceiptInput()
                        .setMottaker(new Virksomhetmottaker()
                                .setVirksomhetsidentifikator(getAvsender(sbd).getVirksomhetsidentifikator()))
                        .setAvsender(new Avsender()
                                .setVirksomhetsidentifikator(new Identifikator()
                                        .setAuthority(receiver.getIdentifier())
                                )
                        )
                ));
    }

    private Avsender getAvsender(StandardBusinessDocument sbd) {
        return sbd.getBusinessMessage(AvsenderHolder.class)
                .flatMap(p -> Optional.ofNullable(p.getAvsender()))
                .orElseThrow(() -> new IllegalArgumentException("Missing Avsender!"));
    }
}
