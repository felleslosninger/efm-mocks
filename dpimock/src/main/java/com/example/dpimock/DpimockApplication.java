package com.example.dpimock;

import model.MessagesSingleton;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Import;

@SpringBootApplication
@Import(MessagesSingleton.class)
public class DpimockApplication {

    public static void main(String[] args) {
        SpringApplication.run(DpimockApplication.class, args);
    }
}
