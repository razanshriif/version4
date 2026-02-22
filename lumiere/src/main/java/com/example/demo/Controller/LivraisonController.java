package com.example.demo.Controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.example.demo.Entity.Ordre;
import com.example.demo.Entity.Statut;
import com.example.demo.Service.OrdreService;
import com.example.demo.securityjwt.user.User;
import com.example.demo.securityjwt.repo.UserRepository;

@RestController
@RequestMapping("/api/livraisons")
public class LivraisonController {

    @Autowired
    private OrdreService ordreService;

    @Autowired
    private UserRepository userRepository;

    private User getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findFirstByEmailOrderByIdAsc(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
    }

    @GetMapping
    public List<Ordre> getLivraisons() {
        // In this app, Livraisons are basically Ordres
        return ordreService.findAll(getAuthenticatedUser());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ordre> getLivraisonById(@PathVariable Long id) {
        return ordreService.findById(id, getAuthenticatedUser())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/en-cours")
    public List<Ordre> getLivraisonsEnCours() {
        User user = getAuthenticatedUser();
        return ordreService.findAll(user).stream()
                .filter(o -> o.getStatut() == Statut.EN_COURS_DE_LIVRAISON)
                .toList();
    }
}
