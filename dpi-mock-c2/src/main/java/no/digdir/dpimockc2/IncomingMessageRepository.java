package no.digdir.dpimockc2;

import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * This class holds a list of messages received from C3 in memory. Typically, these are receipts.
 */
@Component
public class IncomingMessageRepository {

    private final Map<String, IncomingMessage> messages = Collections.synchronizedMap(new LinkedHashMap<>());

    public void save(IncomingMessage message) {
        messages.put(message.getDashboardInfo().getMessageId(), message);
    }

    public void deleteById(String id) {
        messages.remove(id);
    }

    public Collection<IncomingMessage> findAll() {
        return messages.values();
    }

    public void deleteAll() {
        messages.clear();
    }
}
