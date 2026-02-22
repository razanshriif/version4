package com.example.demo.Controller;

import com.example.demo.Entity.Notification;
import com.example.demo.Repository.NotificationRepository;
import com.example.demo.securityjwt.repo.UserRepository;
import com.example.demo.securityjwt.user.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    // 📦 GET ALL USERS (Admin only)
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    // ✅ APPROVE / REJECT USER
    @PutMapping("/users/{id}/status")
    public ResponseEntity<?> updateUserStatus(
            @PathVariable Integer id,
            @RequestParam String status) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Only allow valid status values
        if (!status.equals("ACTIVE") && !status.equals("REJECTED") && !status.equals("PENDING")) {
            return ResponseEntity.badRequest().body("Invalid status: " + status);
        }

        String previousStatus = user.getStatus();
        user.setStatus(status);
        userRepository.save(user);

        // When activating, create a notification for the user
        if ("ACTIVE".equals(status) && !"ACTIVE".equals(previousStatus)) {
            Notification notification = new Notification();
            notification.setOwner(user);
            notification.setType("ACCOUNT_ACTIVATED");
            notification.setMessage("🎉 Votre compte a été activé ! Bienvenue sur Lumière.");
            notification.setRead(false);
            notificationRepository.save(notification);
        }

        return ResponseEntity.ok().body("User status updated to: " + status);
    }

    // 🔍 CHECK STATUS (public endpoint — for mobile pending page polling)
    @GetMapping("/status")
    public ResponseEntity<?> checkStatus(@RequestParam String email) {
        return userRepository.findFirstByEmailOrderByIdAsc(email)
                .map(user -> ResponseEntity.ok().body(
                        java.util.Map.of("status", user.getStatus(), "email", user.getEmail())))
                .orElse(ResponseEntity.notFound().build());
    }
}
