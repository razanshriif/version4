package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.CrossOrigin;

@SpringBootApplication
@CrossOrigin(origins = { "http://localhost:8100", "http://localhost:8101", "http://192.168.1.190:8100" }) // ← AJOUTER
                                                                                                          // CETTE LIGNE

public class LumiereApplication {
    public static void main(String[] args) {
        SpringApplication.run(LumiereApplication.class, args);
    }
}
