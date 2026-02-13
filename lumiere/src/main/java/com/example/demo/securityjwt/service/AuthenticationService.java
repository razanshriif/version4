package com.example.demo.securityjwt.service;

import com.example.demo.securityjwt.controller.dto.AuthenticationRequest;
import com.example.demo.securityjwt.controller.dto.AuthenticationResponse;
import com.example.demo.securityjwt.controller.dto.RegisterRequest;
import com.example.demo.securityjwt.repo.UserRepository;
import com.example.demo.securityjwt.user.Role;
import com.example.demo.securityjwt.user.User;
import com.example.demo.securityjwt.utils.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;




@Service
public record AuthenticationService(UserRepository userRepository,
                                    PasswordEncoder passwordEncoder,
                                    AuthenticationManager authenticationManager,
                                    JwtService jwtService) {  // ← ADDED: Inject JwtService
	
	 
	
    public AuthenticationResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email already exists: " + request.email());
        }
        final var user = new User();
        user.setEmail(request.email());
        user.setFirstname(request.firstname());
        user.setLastname(request.lastname());
        user.setPasswd(passwordEncoder.encode(request.password()));
        user.setRole(request.role());
        
        userRepository.save(user);
        final var token = jwtService.generateToken(user);  // ← FIXED: Use instance method
        return new AuthenticationResponse(token);
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.email(),
                        request.password()
                )
        );
        final var user = userRepository.findFirstByEmailOrderByIdAsc(request.email()).orElseThrow();
        final var token = jwtService.generateToken(user);  // ← FIXED: Use instance method
        return new AuthenticationResponse(token);

    }
}