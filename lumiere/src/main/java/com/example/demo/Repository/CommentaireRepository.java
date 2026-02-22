package com.example.demo.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.Entity.Commentaire;
import com.example.demo.securityjwt.user.User;

public interface CommentaireRepository extends JpaRepository<Commentaire, Long> {
    List<Commentaire> findByOwnerOrderByIdDesc(User owner);

    Optional<Commentaire> findByIdAndOwner(Long id, User owner);
}
