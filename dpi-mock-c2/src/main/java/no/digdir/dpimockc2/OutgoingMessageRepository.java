package no.digdir.dpimockc2;

import lombok.Getter;
import no.difi.meldingsutveksling.domain.sbdh.PartnerIdentification;
import org.springframework.stereotype.Component;

import java.util.*;

/**
 * This class holds a list of messages sent from C1 in memory so that we can expose an API that
 * delivers all incoming messages to the mock.
 */
@Component
@Getter
public class OutgoingMessageRepository {

    private final Map<String, OutgoingMessage> messages = Collections.synchronizedMap(new LinkedHashMap<>());

    public void save(OutgoingMessage message) {
        messages.put(message.getDashboardInfo().getMessageId(), message);
    }

    public OutgoingMessage get(PartnerIdentification partnerIdentification, String messageId) {
        return Optional.ofNullable(messages.get(messageId))
                .filter(p -> p.getPartnerIdentification().equals(partnerIdentification))
                .orElseThrow(() -> new IllegalArgumentException(String.format("Couldn't find messageId = %s", messageId)));
    }

    public void deleteAll() {
        messages.clear();
    }

    public Collection<OutgoingMessage> findAll() {
        return messages.values();
    }
}
