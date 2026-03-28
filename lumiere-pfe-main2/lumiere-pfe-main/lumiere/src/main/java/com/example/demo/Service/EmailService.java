package com.example.demo.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail(String to, String subject, String text) {
        try {
            // Log to local file for debugging (OneLink recovery)
            try (java.io.FileWriter fw = new java.io.FileWriter("mail_log.txt", true);
                 java.io.PrintWriter pw = new java.io.PrintWriter(fw)) {
                pw.println("=================================================");
                pw.println("Date: " + new java.util.Date());
                pw.println("To: " + to);
                pw.println("Subject: " + subject);
                pw.println("Content:\n" + text);
                pw.println("=================================================");
                pw.println();
            } catch (java.io.IOException ioe) {
                System.err.println("Failed to log email to file: " + ioe.getMessage());
            }

            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            // Note: Gmail may ignore this if it doesn't match the authenticated user
            message.setFrom("tnlumiere@gmail.com");
            mailSender.send(message);
            System.out.println("Email sent successfully to: " + to);
        } catch (Exception e) {
            System.err.println("Error sending email to " + to + ": " + e.getMessage());
            // We don't throw exception here to avoid breaking the UI flow if SMTP fails
            // since we have the mail_log.txt now.
        }
    }

    public void sendRegistrationEmail(String to, String name) {
        String subject = "Confirmation d'inscription";
        String text = "Bonjour " + name + ",\n\n" +
                "Votre demande d'inscription a bien été reçue. Elle est actuellement en attente de validation par un administrateur.\n"
                +
                "Vous recevrez un email dès que votre compte sera activé.\n\n" +
                "Cordialement,\nL'équipe Lumière";
        sendEmail(to, subject, text);
    }

    public void sendAccountActivatedEmail(String to, String name) {
        String subject = "Compte activé - Bienvenue sur Lumière Transports";
        String activationLink = "http://localhost:8090/api/v1/admin/activate?email=" + to;

        String text = "Bonjour " + name + ",\n\n" +
                "Félicitations ! Votre compte a été validé par notre équipe.\n\n" +
                "Veuillez cliquer sur le lien ci-dessous pour confirmer l'activation de votre compte :\n" +
                activationLink + "\n\n" +
                "Une fois activé, vous pourrez vous connecter à votre application mobile.\n\n" +
                "Cordialement,\n" +
                "L'équipe Lumière Transports";

        sendEmail(to, subject, text);
    }

    public void sendAccountRejectedEmail(String to, String name) {
        String subject = "Inscription refusée";
        String text = "Bonjour " + name + ",\n\n" +
                "Nous avons le regret de vous informer que votre demande d'inscription a été refusée.\n\n" +
                "Cordialement,\nL'équipe Lumière";
        sendEmail(to, subject, text);
    }

    public void sendNewRegistrationNotificationToAdmins(String newUserName, String newUserEmail) {
        // Liste des emails des administrateurs et commerciaux
        String[] adminEmails = {
                "admin@lumiere.tn",
                "commercial@lumiere.tn"
        };

        String subject = "Nouvelle demande d'inscription";
        String text = "Bonjour,\n\n" +
                "Une nouvelle demande d'inscription a été reçue :\n\n" +
                "📝 Nom : " + newUserName + "\n" +
                "📧 Email : " + newUserEmail + "\n\n" +
                "Veuillez vous connecter au panneau d'administration pour approuver ou rejeter cette demande.\n\n" +
                "Cordialement,\nSystème Lumière";

        // Envoyer à tous les admins
        for (String adminEmail : adminEmails) {
            try {
                sendEmail(adminEmail, subject, text);
            } catch (Exception e) {
                // Log l'erreur mais continue pour les autres admins
                System.err.println("Failed to send notification to " + adminEmail + ": " + e.getMessage());
            }
        }
    }
}