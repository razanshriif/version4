package com.example.demo.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.example.demo.Entity.Tranck;
import com.example.demo.Service.TranckService;
import com.example.demo.securityjwt.user.User;
import com.example.demo.securityjwt.repo.UserRepository;

@RestController
@RequestMapping("/api/trancks")
@CrossOrigin(origins = "*")
public class TranckController {

    @Autowired
    private TranckService tranckService;

    @Autowired
    private UserRepository userRepository;

    private User getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findFirstByEmailOrderByIdAsc(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
    }

    @GetMapping
    public List<Tranck> getAllTrancks() {
        return tranckService.findAll(getAuthenticatedUser());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tranck> getTranckById(@PathVariable Long id) {
        return tranckService.findById(id, getAuthenticatedUser())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Tranck createTranck(@RequestBody Tranck tranck) {
        return tranckService.save(tranck, getAuthenticatedUser());
    }

    @PutMapping("/{id}")
    public Tranck updateTranck(@PathVariable Long id, @RequestBody Tranck tranckDetails) {
        return tranckService.updateTranck(id, tranckDetails, getAuthenticatedUser());
    }

    @DeleteMapping("/{id}")
    public void deleteTranck(@PathVariable Long id) {
        tranckService.deleteById(id, getAuthenticatedUser());
    }
}