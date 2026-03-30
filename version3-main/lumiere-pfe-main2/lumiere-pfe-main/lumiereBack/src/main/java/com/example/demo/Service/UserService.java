package com.example.demo.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.Repository.UserRepository;
import com.example.demo.Entity.User;
import com.example.demo.Entity.Role;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Integer id) {
        return userRepository.findById(id);
    }

    public User saveUser(User user) {
        user.setPasswd(bCryptPasswordEncoder.encode(user.getPasswd())); // Encrypt password before saving
        return userRepository.save(user);
    }

    public void deleteUser(Integer id) {
        userRepository.deleteById(id);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findFirstByEmailOrderByIdAsc(email);
    }

    // Get only CLIENT users (for COMMERCIAL role access)
    public List<User> getClientUsers() {
        return userRepository.findByRole(Role.CLIENT);
    }
}
