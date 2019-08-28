package model;

import lombok.Getter;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Queue;
import java.util.concurrent.ConcurrentLinkedQueue;

/**
 * This class holds a list of incoming messages in memory so that we can expose an API that
 * delivers all incoming messages to the mock.
 */
@Component
@Getter
public class MessagesSingleton {

    private final Queue<Message> messages = new ConcurrentLinkedQueue<>();
    private final List<Message> messageLog = Collections.synchronizedList(new ArrayList<>());

    public void addMessage(Message message) {
        messages.add(message);
        messageLog.add(message);
    }

    public void deleteMessages() {
        messages.clear();
    }

    public void clearLog() {
        messageLog.clear();
    }

    public Message poll() {
        return messages.poll();
    }
}
