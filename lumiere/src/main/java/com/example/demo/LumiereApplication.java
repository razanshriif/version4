package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.CrossOrigin;

@SpringBootApplication
@CrossOrigin(origins = "*") // Allow all origins for development (Android app, web, etc.)

public class LumiereApplication {
    public static void main(String[] args) {
        SpringApplication.run(LumiereApplication.class, args);
    }
}
