package no.digdir.dpimockc2;

import lombok.Getter;
import no.difi.meldingsutveksling.domain.sbdh.PartnerIdentification;
import no.digdir.dpi.client.domain.MessageStatus;
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

    public List<MessageStatus> getMessageStatusList(PartnerIdentification partnerIdentification, String messageId) {
        return Optional.ofNullable(messages.get(messageId))
                .filter(p -> p.getPartnerIdentification().equals(partnerIdentification))
                .map(OutgoingMessage::getStatusList)
                .orElseGet(Collections::emptyList);
    }

    public void deleteAll() {
        messages.clear();
    }

    public Collection<OutgoingMessage> findAll() {
        return messages.values();
    }
}
