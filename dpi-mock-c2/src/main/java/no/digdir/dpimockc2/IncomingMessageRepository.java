package no.digdir.dpimockc2;

import no.difi.meldingsutveksling.domain.sbdh.PartnerIdentification;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Stream;

/**
 * This class holds a list of messages received from C3 in memory. Typically, these are receipts.
 */
@Component
public class IncomingMessageRepository {

    private final Map<String, IncomingMessage> messages = Collections.synchronizedMap(new LinkedHashMap<>());

    public void save(IncomingMessage message) {
        messages.put(message.getDashboardInfo().getMessageId(), message);
    }

    public void deleteById(PartnerIdentification partnerIdentification, String messageId) {
        IncomingMessage incomingMessage = Optional.ofNullable(messages.get(messageId))
                .filter(p -> p.getPartnerIdentification().equals(partnerIdentification))
                .orElseThrow(() -> new NotFoundException(String.format("Couldn't find messageId = %s", messageId)));
        messages.remove(incomingMessage.getDashboardInfo().getMessageId());
    }

    public Collection<IncomingMessage> findAll() {
        return messages.values();
    }

    public Stream<IncomingMessage> findAll(PartnerIdentification partnerIdentification) {
        return messages.values()
                .stream()
                .filter(p -> p.getPartnerIdentification().equals(partnerIdentification));
    }

    public void deleteAll() {
        messages.clear();
    }
}
