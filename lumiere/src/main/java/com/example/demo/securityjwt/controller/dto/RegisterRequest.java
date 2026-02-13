package com.example.demo.securityjwt.controller.dto;

import com.example.demo.securityjwt.user.Role;

public record RegisterRequest(Integer id,String firstname, String lastname, String email, String password,Role role) {
}
