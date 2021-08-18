package no.digdir.dpimockc2;

import lombok.RequiredArgsConstructor;
import no.difi.meldingsutveksling.domain.sbdh.PartnerIdentification;
import no.difi.meldingsutveksling.domain.sbdh.StandardBusinessDocument;
import no.difi.meldingsutveksling.domain.sbdh.StandardBusinessDocumentUtils;
import no.digdir.dpi.client.domain.messagetypes.AvsenderHolder;
import no.digdir.dpi.client.domain.messagetypes.Leveringskvittering;
import no.digdir.dpi.client.domain.sbd.Avsender;
import no.digdir.dpi.client.domain.sbd.Identifikator;
import no.digdir.dpi.client.domain.sbd.Virksomhetmottaker;
import no.digdir.dpi.client.internal.CreateMaskinportenToken;
import org.springframework.stereotype.Component;

import java.time.Clock;
import java.time.OffsetDateTime;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class CreateLeveringskvittering {

    private final CreateMaskinportenToken createMaskinportenToken;
    private final Clock clock;

    public Leveringskvittering getLeveringskvittering(StandardBusinessDocument sbd) {
        PartnerIdentification receiver = StandardBusinessDocumentUtils.getFirstReceiverIdentifier(sbd)
                .orElseThrow(() -> new IllegalArgumentException("Missing receiver!"));

        Leveringskvittering kvittering = new Leveringskvittering();
        kvittering.setMottaker(new Virksomhetmottaker()
                .setVirksomhetsidentifikator(getAvsender(sbd).getVirksomhetsidentifikator()));
        kvittering.setAvsender(new Avsender()
                .setVirksomhetsidentifikator(new Identifikator()
                        .setAuthority(receiver.getAuthority())
                        .setValue(receiver.getValue())
                ));
        kvittering.setMaskinportentoken(createMaskinportenToken.createMaskinportenToken());
        kvittering.setTidspunkt(OffsetDateTime.now(clock));
        return kvittering;
    }

    private Avsender getAvsender(StandardBusinessDocument sbd) {
        return sbd.getBusinessMessage(AvsenderHolder.class)
                .flatMap(p -> Optional.ofNullable(p.getAvsender()))
                .orElseThrow(() -> new IllegalArgumentException("Missing Avsender!"));

    }
}
