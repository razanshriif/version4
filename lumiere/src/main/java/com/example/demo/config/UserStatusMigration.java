package com.example.demo.config;

import com.example.demo.securityjwt.repo.UserRepository;
import com.example.demo.securityjwt.user.Role;
import com.example.demo.securityjwt.user.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Runs once at startup to migrate existing users.
 * Any user without a status (NULL from before the feature was added) is set to
 * ACTIVE
 * so they are not locked out by the new isEnabled() check.
 */
@Component
public class UserStatusMigration implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(UserStatusMigration.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserStatusMigration(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        var usersWithNullStatus = userRepository.findAll().stream()
                .filter(u -> u.getStatus() == null)
                .toList();

        if (!usersWithNullStatus.isEmpty()) {
            usersWithNullStatus.forEach(u -> u.setStatus("ACTIVE"));
            userRepository.saveAll(usersWithNullStatus);
            log.info("✅ Migrated {} existing user(s) to ACTIVE status", usersWithNullStatus.size());
        } else {
            log.info("✅ No user status migration needed");
        }

        // Create the requested admin user if it doesn't exist
        String adminEmail = "razanshriif@gmail.com";
        if (!userRepository.existsByEmail(adminEmail)) {
            User admin = new User();
            admin.setFirstname("Razan");
            admin.setLastname("Shriif");
            admin.setEmail(adminEmail);
            admin.setPasswd(passwordEncoder.encode("123456"));
            admin.setRole(Role.ADMIN);
            admin.setStatus("ACTIVE");
            userRepository.save(admin);
            log.info("✅ Created admin user: {}", adminEmail);
        }
    }
}
