package com.example.demo.securityjwt ; 

import com.example.demo.securityjwt.user.User;


import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/api/v1/demo")
public record DemoController() {


    @GetMapping
    public String sayHello(Authentication authentication) {
        return "%s".formatted(getName(authentication));
    }

    private String getName(Authentication authentication) {
        return Optional.of(authentication)
                .filter(User.class::isInstance)
                .map(User.class::cast)
                .map(User::getEmail)
                .orElseGet(authentication::getName);
    }

}
