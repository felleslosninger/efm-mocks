package no.digdir.dpimockc2;

import lombok.Getter;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

/**
 * This class holds a list of messages sent from C1 in memory so that we can expose an API that
 * delivers all incoming messages to the mock.
 */
@Component
@Getter
public class OutgoingMessageRepository {

    private final List<OutgoingMessage> messages = Collections.synchronizedList(new ArrayList<>());

    public void save(OutgoingMessage message) {
        messages.add(message);
    }

    public void deleteAll() {
        messages.clear();
    }

    public Collection<OutgoingMessage> findAll() {
        return messages;
    }
}
