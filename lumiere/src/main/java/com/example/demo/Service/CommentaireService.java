package com.example.demo.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.Entity.Commentaire;
import com.example.demo.Repository.CommentaireRepository;
import com.example.demo.securityjwt.user.User;

@Service
public class CommentaireService {

    @Autowired
    private CommentaireRepository commentaireRepository;

    public List<Commentaire> findAll(User owner) {
        return commentaireRepository.findByOwnerOrderByIdDesc(owner);
    }

    public Optional<Commentaire> findById(Long id, User owner) {
        return commentaireRepository.findByIdAndOwner(id, owner);
    }

    public Commentaire save(Commentaire commentaire, User owner) {
        commentaire.setOwner(owner);
        return commentaireRepository.save(commentaire);
    }

    public void deleteById(Long id, User owner) {
        Optional<Commentaire> opt = commentaireRepository.findByIdAndOwner(id, owner);
        if (opt.isPresent()) {
            commentaireRepository.delete(opt.get());
        }
    }

    public Commentaire updateCommentaire(Long id, Commentaire commentaireDetails, User owner) {
        Optional<Commentaire> optionalCommentaire = commentaireRepository.findByIdAndOwner(id, owner);
        if (optionalCommentaire.isPresent()) {
            Commentaire commentaire = optionalCommentaire.get();
            commentaire.setContenue(commentaireDetails.getContenue());
            commentaire.setOrdre(commentaireDetails.getOrdre());
            return commentaireRepository.save(commentaire);
        } else {
            throw new RuntimeException("Commentaire not found with id " + id + " for this owner");
        }
    }
}