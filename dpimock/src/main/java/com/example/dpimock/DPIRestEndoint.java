package com.example.dpimock;

import lombok.RequiredArgsConstructor;
import model.Message;
import model.MessagesSingleton;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Collection;
import java.util.List;

@Controller
@RequiredArgsConstructor
public class DPIRestEndoint {

    private final MessagesSingleton messagesSingleton;

    @GetMapping("/api/messages")
    @ResponseBody
    public Collection<Message> getMesssages() {
        return messagesSingleton.getMessages();
    }

    @GetMapping("/api/messages/log")
    @ResponseBody
    public List<Message> getMesssageLog() {
        return messagesSingleton.getMessageLog();
    }

    @DeleteMapping("/api/messages")
    @ResponseBody
    public void deleteMesssages() {
        messagesSingleton.deleteMessages();
    }

    @DeleteMapping("/api/messages/log")
    @ResponseBody
    public void clearLog() {
        messagesSingleton.clearLog();
    }

}