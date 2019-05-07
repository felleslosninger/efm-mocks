package com.example.dpimock;

import model.MessagesSingleton;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DpimockApplication {

	public static void main(String[] args) {
		MessagesSingleton ms = MessagesSingleton.getInstance();
		SpringApplication.run(DpimockApplication.class, args);
	}

}
