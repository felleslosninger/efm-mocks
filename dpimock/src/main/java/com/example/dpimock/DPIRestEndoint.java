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

    @GetMapping("/messages")
    @ResponseBody
    public List<Message> getMesssages() {
        return MessagesSingleton.getInstance().messages;
    }

    @DeleteMapping("/messages")
    @ResponseBody
    public void deleteMesssages() {
        MessagesSingleton.getInstance().deleteMessages();
    }

}
