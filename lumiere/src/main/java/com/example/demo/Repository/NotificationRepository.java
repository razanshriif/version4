package com.example.demo.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.Entity.Notification;
import com.example.demo.securityjwt.user.User;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByOwnerOrderByTimestampDesc(User owner);

    List<Notification> findByOwnerAndIsReadFalse(User owner);

    Optional<Notification> findByIdAndOwner(Long id, User owner);

    // Méthode pour trouver des notifications par type et owner
    List<Notification> findByTypeAndOwner(String type, User owner);
}