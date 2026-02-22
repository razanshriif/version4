package com.example.demo.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.Entity.Notification;
import com.example.demo.Repository.NotificationRepository;
import com.example.demo.securityjwt.user.User;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    public List<Notification> getAllNotifications(User owner) {
        return notificationRepository.findByOwnerOrderByTimestampDesc(owner);
    }

    public Optional<Notification> getNotificationById(Long id, User owner) {
        return notificationRepository.findByIdAndOwner(id, owner);
    }

    public Notification createNotification(Notification notification, User owner) {
        notification.setOwner(owner);
        return notificationRepository.save(notification);
    }

    public Notification updateNotification(Long id, Notification updatedNotification, User owner) {
        Optional<Notification> optionalNotification = notificationRepository.findByIdAndOwner(id, owner);
        if (optionalNotification.isPresent()) {
            Notification existingNotification = optionalNotification.get();
            existingNotification.setMessage(updatedNotification.getMessage());
            existingNotification.setType(updatedNotification.getType());
            existingNotification.setRead(updatedNotification.isRead());
            return notificationRepository.save(existingNotification);
        }
        return null;
    }

    public boolean deleteNotification(Long id, User owner) {
        Optional<Notification> opt = notificationRepository.findByIdAndOwner(id, owner);
        if (opt.isPresent()) {
            notificationRepository.delete(opt.get());
            return true;
        }
        return false;
    }
}