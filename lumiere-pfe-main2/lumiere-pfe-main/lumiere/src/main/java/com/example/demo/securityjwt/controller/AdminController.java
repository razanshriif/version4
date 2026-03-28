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
        // If Admin selects ACTIVE (Approve), we set it to VALIDATED first to trigger OneLink
        Status finalStatus = status;
        if (status == Status.ACTIVE) {
            finalStatus = Status.VALIDATED;
        }
        
        user.setStatus(finalStatus);
        userRepository.save(user);

        String fullName = user.getFirstname() + " " + user.getLastname();

        // Send email notification
        try {
            if (finalStatus == Status.VALIDATED) {
                emailService.sendAccountActivatedEmail(user.getEmail(), fullName);
                logger.info("Account validation email (OneLink) sent to {}", user.getEmail());

                // Create in-app notification
                Notification notification = new Notification();
                notification.setType("ACCOUNT_ACTIVATED");
                notification.setMessage("Votre compte a été activé. Bienvenue sur Lumière.");
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
        return userRepository.findFirstByEmailOrderByIdDesc(email)
                .map(user -> ResponseEntity.ok().body(
                        java.util.Map.of("status", user.getStatus(), "email", user.getEmail())))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/activate")
    public ResponseEntity<String> activateAccount(@RequestParam String email) {
        logger.info("OneLink activation requested for email: {}", email);
        return userRepository.findFirstByEmailOrderByIdAsc(email)
                .map(user -> {
                    if (user.getStatus() == Status.ACTIVE) {
                        return ResponseEntity.ok(generateActivationResponse(
                            "Compte déjà activé", 
                            "Votre compte est déjà prêt. Vous pouvez vous connecter dès maintenant sur votre application mobile.", 
                            true));
                    }
                    if (user.getStatus() != Status.VALIDATED) {
                         return ResponseEntity.status(400).body(generateActivationResponse(
                            "Lien invalide", 
                            "Ce compte n'a pas encore été validé par un administrateur ou le lien a expiré.", 
                            false));
                    }
                    user.setStatus(Status.ACTIVE);
                    userRepository.save(user);
                    logger.info("Account successfully activated via OneLink for: {}", email);
                    return ResponseEntity.ok(generateActivationResponse(
                        "Compte activé avec succès !", 
                        "Merci d'avoir rejoint Lumière Transports. Votre compte est désormais actif et prêt à l'emploi.", 
                        true));
                })
                .orElse(ResponseEntity.status(404).body(generateActivationResponse(
                    "Erreur d'activation", 
                    "Utilisateur non trouvé dans notre système.", 
                    false)));
    }

    private String generateActivationResponse(String title, String message, boolean success) {
        String iconColor = success ? "#F7941D" : "#ef4444";
        String icon = success ? "✓" : "!";
        
        return "<!DOCTYPE html>" +
               "<html lang='fr'>" +
               "<head>" +
               "    <meta charset='UTF-8'>" +
               "    <meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
               "    <link href='https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap' rel='stylesheet'>" +
               "    <style>" +
               "        body { font-family: 'Inter', sans-serif; background-color: #f5f2ed; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; color: #1a1c1f; }" +
               "        .card { background: white; padding: 40px; border-radius: 32px; box-shadow: 0 20px 40px rgba(0,0,0,0.06); text-align: center; max-width: 400px; width: 90%; transform: translateY(-20px); transition: all 0.5s ease; }" +
               "        .logo-img { height: 80px; margin-bottom: 30px; object-fit: contain; }" +
               "        .icon-circle { width: 80px; height: 80px; background-color: " + iconColor + "15; border-radius: 25px; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; color: " + iconColor + "; font-size: 40px; font-weight: 900; }" +
               "        h1 { font-size: 24px; font-weight: 900; margin-bottom: 16px; }" +
               "        p { font-size: 16px; line-height: 1.6; color: #64748b; margin-bottom: 32px; font-weight: 500; }" +
               "        .btn { background-color: #F7941D; color: white; padding: 16px 32px; border-radius: 100px; text-decoration: none; font-weight: 700; font-size: 15px; display: inline-block; box-shadow: 0 8px 20px rgba(247, 148, 29, 0.25); transition: transform 0.2s; }" +
               "        .btn:active { transform: scale(0.95); }" +
               "    </style>" +
               "</head>" +
               "<body>" +
               "    <div class='card'>" +
               "        <img src='/assets/lum-removebg-preview.png' alt='Lumière' class='logo-img' />" +
               "        <div class='icon-circle'>" + icon + "</div>" +
               "        <h1>" + title + "</h1>" +
               "        <p>" + message + "</p>" +
               "        <a href='/login' class='btn'>SE CONNECTER</a>" +
               "    </div>" +
               "</body>" +
               "</html>";
    }
}
