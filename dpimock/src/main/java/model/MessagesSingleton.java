package model;

import lombok.Getter;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * This class holds a list of incoming messages in memory so that we can expose an API that
 * delivers all incoming messages to the mock.
 */
@Component
@Getter
public class MessagesSingleton {

    private final Map<String, Message> messages = new ConcurrentHashMap<>();
    private final List<Message> messageLog = Collections.synchronizedList(new ArrayList<>());

    public void addMessage(Message message) {
        messages.put(message.getMessageId(), message);
        messageLog.add(message);
    }

    public void deleteMessages() {
        messages.clear();
    }

    public void clearLog() {
        messageLog.clear();
    }

    public synchronized Optional<Message> pop() {
        Optional<Map.Entry<String, Message>> first = messages.entrySet().stream().findFirst();
        first.ifPresent(p -> messages.remove(p.getKey()));
        return first.map(Map.Entry::getValue);
    }
}
