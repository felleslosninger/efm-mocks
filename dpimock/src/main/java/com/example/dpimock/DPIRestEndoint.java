package com.example.dpimock;

import model.Message;
import model.MessagesSingleton;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
public class DPIRestEndoint {

    @GetMapping("/api/messages")
    @ResponseBody
    public List<Message> getMesssages() {
        return MessagesSingleton.getInstance().messages;
    }

    @GetMapping("/api/messages/log")
    @ResponseBody
    public List<Message> getMesssageLog() {
        return MessagesSingleton.getInstance().messageLog;
    }

    @DeleteMapping("/api/messages")
    @ResponseBody
    public void deleteMesssages() {
        MessagesSingleton.getInstance().deleteMessages();
    }

    @DeleteMapping("/api/messages/log")
    @ResponseBody
    public void clearLog() {
        MessagesSingleton.getInstance().clearLog();
    }

}