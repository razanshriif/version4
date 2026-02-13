package com.example.demo.securityjwt.controller;

import com.example.demo.securityjwt.controller.dto.AuthenticationRequest;
import com.example.demo.securityjwt.controller.dto.AuthenticationResponse;
import com.example.demo.securityjwt.controller.dto.RegisterRequest;
import com.example.demo.securityjwt.repo.UserRepository;
import com.example.demo.securityjwt.user.User;
import com.example.demo.securityjwt.service.AuthenticationService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/auth")
public record AuthController(
        AuthenticationService authenticationService,
        UserRepository userRepository,
        PasswordEncoder passwordEncoder
) {

    // 📝 REGISTER (PUBLIC)
    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(
            @RequestBody RegisterRequest request
    ) {
        return ResponseEntity.ok(authenticationService.register(request));
    }

    // 🔐 LOGIN (PUBLIC)
    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody AuthenticationRequest request
    ) {
        return ResponseEntity.ok(authenticationService.authenticate(request));
    }

    // 👤 GET PROFILE (JWT REQUIRED)
   @GetMapping("/profile")
public ResponseEntity<?> getProfile(Principal principal) {
    String email = principal.getName(); 
    User user = userRepository.findFirstByEmailOrderByIdAsc(email)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User " + email + " not found"));
    return ResponseEntity.ok(user);
}

    // ✏️ UPDATE PROFILE (JWT REQUIRED)
    @PutMapping("/update")
    public ResponseEntity<User> updateUser(
            @RequestBody RegisterRequest request
    ) {
        Authentication auth = SecurityContextHolder
                .getContext()
                .getAuthentication();

        String email = auth.getName();

        User user = userRepository.findFirstByEmailOrderByIdAsc(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setFirstname(request.firstname());
        user.setLastname(request.lastname());

        // 🚨 DO NOT change email blindly in real apps
        // user.setEmail(request.email());

        if (request.password() != null && !request.password().isBlank()) {
            user.setPasswd(passwordEncoder.encode(request.password()));
        }

        return ResponseEntity.ok(userRepository.save(user));
    }

    // 📦 GET ALL USERS (JWT REQUIRED — ideally ADMIN only)
    @GetMapping("/profileALL")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }
}
