package util;

import no.difi.oxalis.api.model.Direction;
import no.difi.oxalis.api.timestamp.Timestamp;
import no.difi.oxalis.api.timestamp.TimestampProvider;
import no.difi.vefa.peppol.common.model.Receipt;

import java.util.Date;

public class SystemTimestampProvider implements TimestampProvider {
    public SystemTimestampProvider() {
    }

    public Timestamp generate(byte[] content, Direction direction) {
        return new Timestamp(new Date(), (Receipt)null);
    }
}
