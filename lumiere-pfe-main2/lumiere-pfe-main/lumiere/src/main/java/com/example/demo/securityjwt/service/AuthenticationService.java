package com.example.demo.securityjwt.service;

import com.example.demo.securityjwt.controller.dto.AuthenticationRequest;
import com.example.demo.securityjwt.controller.dto.AuthenticationResponse;
import com.example.demo.securityjwt.controller.dto.RegisterRequest;
import com.example.demo.Repository.UserRepository;
import com.example.demo.Entity.Role;
import com.example.demo.Entity.User;
import com.example.demo.securityjwt.utils.JwtService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {

    private static final Logger logger = LoggerFactory.getLogger(AuthenticationService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final com.example.demo.Service.EmailService emailService;
    private final com.example.demo.Service.NotificationService notificationService;

    public AuthenticationService(UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            com.example.demo.Service.EmailService emailService,
            com.example.demo.Service.NotificationService notificationService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.emailService = emailService;
        this.notificationService = notificationService;
    }

    public AuthenticationResponse register(RegisterRequest request) {
        final var user = new User();
        user.setEmail(request.email());
        user.setFirstname(request.firstname());
        user.setLastname(request.lastname());
        user.setPasswd(passwordEncoder.encode(request.password()));
        user.setRole(request.role());
        user.setStatus(com.example.demo.Entity.Status.PENDING);

        userRepository.save(user);

        // Send registration email (non-blocking - failure won't prevent registration)
        try {
            emailService.sendRegistrationEmail(user.getEmail(), user.getFirstname() + " " + user.getLastname());
            logger.info("Registration email sent successfully to {}", user.getEmail());
        } catch (Exception e) {
            logger.error("Failed to send registration email to {}: {}", user.getEmail(), e.getMessage());
        }

        // Notify admins about new registration
        try {
            emailService.sendNewRegistrationNotificationToAdmins(
                    user.getFirstname() + " " + user.getLastname(),
                    user.getEmail());
            logger.info("Admin notification sent for new registration: {}", user.getEmail());
        } catch (Exception e) {
            logger.error("Failed to send admin notification: {}", e.getMessage());
        }

        // Create in-app notification
        try {
            com.example.demo.Entity.Notification notification = new com.example.demo.Entity.Notification();
            notification.setType("Inscription");
            notification.setMessage("Nouvelle inscription : " + user.getFirstname() + " " + user.getLastname());
            notification.setRead(false);
            notificationService.createNotification(notification);
            logger.info("In-app notification created for: {}", user.getEmail());
        } catch (Exception e) {
            logger.error("Failed to create in-app notification: {}", e.getMessage());
        }

        final var token = JwtService.generateToken(user);
        return new AuthenticationResponse(token);
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.email(),
                        request.password()));
        final var user = userRepository.findFirstByEmailOrderByIdAsc(request.email()).orElseThrow();

        if (user.getStatus() != com.example.demo.Entity.Status.ACTIVE) {
            throw new RuntimeException("Account is not active. Current status: " + user.getStatus());
        }

        final var token = JwtService.generateToken(user);
        return new AuthenticationResponse(token);
    }
}
