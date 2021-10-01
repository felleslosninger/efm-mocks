package no.digdir.dpimockc2;

import lombok.Data;
import no.digdir.dpi.client.domain.sbd.Avsender;
import no.digdir.dpi.client.domain.sbd.Virksomhetmottaker;

@Data
public class ReceiptInput {

    private Virksomhetmottaker mottaker;
    private Avsender avsender;
}
