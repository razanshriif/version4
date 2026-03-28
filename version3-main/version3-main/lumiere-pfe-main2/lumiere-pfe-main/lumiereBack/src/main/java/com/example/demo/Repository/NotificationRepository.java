package com.example.demo.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.demo.Entity.Notification;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    // Méthode pour trouver des notifications non lues
    List<Notification> findByIsReadFalse();

    // Méthode pour trouver des notifications par type
    List<Notification> findByType(@Param("type") String type);

}