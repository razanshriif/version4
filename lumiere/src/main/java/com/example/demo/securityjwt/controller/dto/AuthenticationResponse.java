package com.example.demo.securityjwt.controller.dto;

public class AuthenticationResponse {
    private String token;
    private String status;
    private String message;

    public AuthenticationResponse(String token) {
        this.token = token;
        this.status = "ACTIVE";
    }

    public AuthenticationResponse(String token, String status, String message) {
        this.token = token;
        this.status = status;
        this.message = message;
    }

    public String getToken() {
        return token;
    }

    public String getStatus() {
        return status;
    }

    public String getMessage() {
        return message;
    }
}
