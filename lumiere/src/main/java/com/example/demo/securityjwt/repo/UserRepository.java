package com.example.demo.securityjwt.repo;

import com.example.demo.securityjwt.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findFirstByEmailOrderByIdAsc(String email);

    boolean existsByEmail(String email);
}
