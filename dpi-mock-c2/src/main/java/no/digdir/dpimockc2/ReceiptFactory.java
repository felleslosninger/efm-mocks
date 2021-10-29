package no.digdir.dpimockc2;

import no.difi.meldingsutveksling.dpi.client.domain.messagetypes.Kvittering;
import no.difi.meldingsutveksling.dpi.client.domain.messagetypes.MessageType;

public interface ReceiptFactory {

    MessageType getMessageType();

    Kvittering getReceipt(ReceiptInput input);
}
