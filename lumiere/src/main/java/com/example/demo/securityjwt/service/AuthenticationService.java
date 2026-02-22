package com.example.demo.securityjwt.service;

import com.example.demo.securityjwt.controller.dto.AuthenticationRequest;
import com.example.demo.securityjwt.controller.dto.AuthenticationResponse;
import com.example.demo.securityjwt.controller.dto.RegisterRequest;
import com.example.demo.securityjwt.repo.UserRepository;
import com.example.demo.securityjwt.user.Role;
import com.example.demo.securityjwt.user.User;
import com.example.demo.securityjwt.utils.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public record AuthenticationService(UserRepository userRepository,
        PasswordEncoder passwordEncoder,
        AuthenticationManager authenticationManager,
        JwtService jwtService) { // ← ADDED: Inject JwtService

    public AuthenticationResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email already exists: " + request.email());
        }
        final var user = new User();
        user.setEmail(request.email());
        user.setFirstname(request.firstname());
        user.setLastname(request.lastname());
        user.setPasswd(passwordEncoder.encode(request.password()));
        user.setRole(request.role() != null ? request.role() : Role.USER);
        user.setStatus("PENDING"); // Account requires admin approval

        userRepository.save(user);
        // Don't issue a JWT — account must be approved first
        return new AuthenticationResponse(null, "PENDING",
                "Votre compte est en attente d'approbation par un administrateur.");
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        // First check status before attempting authentication
        var user = userRepository.findFirstByEmailOrderByIdAsc(request.email())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        if ("PENDING".equals(user.getStatus())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "ACCOUNT_PENDING");
        }
        if ("REJECTED".equals(user.getStatus())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "ACCOUNT_REJECTED");
        }

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.email(),
                        request.password()));
        final var token = jwtService.generateToken(user);
        return new AuthenticationResponse(token);
    }
}