package util;

import java.util.UUID;

public class DefaultMessageIdGenerator implements MessageIdGenerator {

    private final String hostname;

    public DefaultMessageIdGenerator(String hostname) {
        this.hostname = hostname;
    }

    @Override
    public String generate() {
        return String.format("%s@%s", UUID.randomUUID().toString(), hostname);
    }
}

