package model;

import java.util.ArrayList;
import java.util.List;

/**
 * This class holds a list of incoming messages in memory so that we can expose an API that
 * delivers all incoming messages to the mock.
 * */
public class MessagesSingleton {

    private static MessagesSingleton messagesSingletonInstance = null;

    public List<Message> messages;

    public List<Message> messageLog;

    private MessagesSingleton()
    {
        messages = new ArrayList<>();
        messageLog = new ArrayList<>();
    }

    public void addMessage(Message message){
        messages.add(message);
        messageLog.add(message);
    }

    public boolean containsMessageId(String messageId){
        return messages.stream().anyMatch(message -> message.getMessageId().equals(messageId));
    }

    public void deleteMessages(){
        messages.clear();
    }

    public void clearLog(){
        messageLog.clear();
    }

    public static MessagesSingleton getInstance()
    {
        if (messagesSingletonInstance == null)
            messagesSingletonInstance = new MessagesSingleton();

        return messagesSingletonInstance;
    }

}
