package com.example.demo.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.example.demo.Entity.Commentaire;
import com.example.demo.Service.CommentaireService;
import com.example.demo.securityjwt.user.User;
import com.example.demo.securityjwt.repo.UserRepository;

@RestController
@RequestMapping("/commentaires")
@CrossOrigin(origins = "*")
public class CommentaireController {

    @Autowired
    private CommentaireService commentaireService;

    @Autowired
    private UserRepository userRepository;

    private User getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findFirstByEmailOrderByIdAsc(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
    }

    @GetMapping
    public List<Commentaire> getAllCommentaires() {
        return commentaireService.findAll(getAuthenticatedUser());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Commentaire> getCommentaireById(@PathVariable Long id) {
        return commentaireService.findById(id, getAuthenticatedUser())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Commentaire createCommentaire(@RequestBody Commentaire commentaire) {
        return commentaireService.save(commentaire, getAuthenticatedUser());
    }

    @PutMapping("/{id}")
    public Commentaire updateCommentaire(@PathVariable Long id, @RequestBody Commentaire commentaireDetails) {
        return commentaireService.updateCommentaire(id, commentaireDetails, getAuthenticatedUser());
    }

    @DeleteMapping("/{id}")
    public void deleteCommentaire(@PathVariable Long id) {
        commentaireService.deleteById(id, getAuthenticatedUser());
    }
}