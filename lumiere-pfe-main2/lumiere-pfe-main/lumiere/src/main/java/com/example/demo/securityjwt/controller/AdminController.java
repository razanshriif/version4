package com.example.demo.securityjwt.controller;

import com.example.demo.Entity.Notification;
import com.example.demo.Repository.NotificationRepository;
import com.example.demo.Service.EmailService;

import com.example.demo.Repository.UserRepository;
import com.example.demo.Entity.Status;
import com.example.demo.Entity.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
public class AdminController {

    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final NotificationRepository notificationRepository;

    public AdminController(UserRepository userRepository, EmailService emailService,
            NotificationRepository notificationRepository) {
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.notificationRepository = notificationRepository;
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers(
            @org.springframework.security.core.annotation.AuthenticationPrincipal User currentUser) {
        logger.info("getAllUsers called by user: {} with role: {}", currentUser.getEmail(), currentUser.getRole());

        // ADMIN sees all users, COMMERCIAL sees only CLIENT users
        if (currentUser.isAdmin()) {
            List<User> allUsers = userRepository.findAll();
            logger.info("ADMIN user - returning all {} users", allUsers.size());
            return ResponseEntity.ok(allUsers);
        } else if (currentUser.isCommercial()) {
            List<User> clientUsers = userRepository.findByRole(com.example.demo.Entity.Role.CLIENT);
            logger.info("COMMERCIAL user - returning {} CLIENT users", clientUsers.size());
            return ResponseEntity.ok(clientUsers);
        } else {
            // CLIENT users should not access this endpoint
            logger.warn("CLIENT user {} attempted to access admin endpoint", currentUser.getEmail());
            return ResponseEntity.status(403).build();
        }
    }

    @GetMapping("/users/count/pending")
    public ResponseEntity<Long> countPendingUsers() {
        return ResponseEntity.ok(userRepository.countByStatus(Status.PENDING));
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<User> updateUserStatus(@PathVariable Integer id, @RequestParam Status status) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setStatus(status);
        userRepository.save(user);

        String fullName = user.getFirstname() + " " + user.getLastname();

        // Send email notification (non-blocking - failure won't prevent status update)
        try {
            if (status == Status.ACTIVE) {
                emailService.sendAccountActivatedEmail(user.getEmail(), fullName);
                logger.info("Account activation email sent to {}", user.getEmail());

                // Create in-app notification
                Notification notification = new Notification();
                notification.setType("ACCOUNT_ACTIVATED");
                notification.setMessage("🎉 Votre compte a été activé ! Bienvenue sur Lumière.");
                notification.setRead(false);
                notificationRepository.save(notification);
            } else if (status == Status.REJECTED) {
                emailService.sendAccountRejectedEmail(user.getEmail(), fullName);
                logger.info("Account rejection email sent to {}", user.getEmail());
            }
        } catch (Exception e) {
            logger.error("Failed to send status update email to {}: {}", user.getEmail(), e.getMessage());
        }

        return ResponseEntity.ok(user);
    }

    @GetMapping("/status")
    public ResponseEntity<?> checkStatus(@RequestParam String email) {
        return userRepository.findFirstByEmailOrderByIdAsc(email)
                .map(user -> ResponseEntity.ok().body(
                        java.util.Map.of("status", user.getStatus(), "email", user.getEmail())))
                .orElse(ResponseEntity.notFound().build());
    }
}
