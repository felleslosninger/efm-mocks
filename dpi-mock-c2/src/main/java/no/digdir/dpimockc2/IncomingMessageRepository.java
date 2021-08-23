package no.digdir.dpimockc2;

import lombok.Value;
import no.difi.meldingsutveksling.domain.sbdh.PartnerIdentification;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

/**
 * This class holds a list of messages received from C3 in memory. Typically, these are receipts.
 */
@Component
public class IncomingMessageRepository {

    private final Map<Key, IncomingMessage> messages = Collections.synchronizedMap(new LinkedHashMap<>());

    public void save(IncomingMessage message) {
        messages.put(new Key(message.getDashboardInfo().getMessageId(), message.getPartnerIdentification()), message);
    }

    public void deleteById(PartnerIdentification partnerIdentification, String id) {
        messages.remove(new Key(id, partnerIdentification));
    }

    public Collection<IncomingMessage> findAll() {
        return messages.values();
    }

    public List<IncomingMessage> findAll(PartnerIdentification partnerIdentification) {
        return messages.values()
                .stream()
                .filter(p -> p.getPartnerIdentification().equals(partnerIdentification))
                .collect(Collectors.toList());
    }

    public void deleteAll() {
        messages.clear();
    }

    @Value
    private static class Key {
        String messageId;
        PartnerIdentification partnerIdentification;
    }
}
