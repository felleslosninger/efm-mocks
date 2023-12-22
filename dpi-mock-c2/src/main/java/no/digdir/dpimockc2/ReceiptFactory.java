package no.digdir.dpimockc2;

import no.difi.meldingsutveksling.dpi.client.domain.messagetypes.DpiMessageType;
import no.difi.meldingsutveksling.dpi.client.domain.messagetypes.Kvittering;

public interface ReceiptFactory {

    DpiMessageType getMessageType();

    Kvittering getReceipt(ReceiptInput input);
}
