package com.example.demo.Controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Entity.Ordre;
import com.example.demo.Service.OrdreService;
import com.example.demo.securityjwt.user.User;
import com.example.demo.securityjwt.repo.UserRepository;
import com.example.demo.Entity.Statut;

@RestController
@RequestMapping("/api/client/dashboard")
public class DashboardController {

    @Autowired
    private OrdreService ordreService;

    @Autowired
    private UserRepository userRepository;

    private User getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findFirstByEmailOrderByIdAsc(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        User user = getAuthenticatedUser();
        Map<String, Object> stats = new HashMap<>();

        long mesDemandesEnCours = ordreService.countNonPlanifieOrders(user) + ordreService.countPlanifieOrders(user);
        long mesDemandesEnAttente = 0; // Or link to a specific status if available
        long mesDemandesTerminees = ordreService.getLivreOrdersCount(user);
        long mesLivraisonsEnCours = ordreService.getEnCoursDeLivraisonOrdersCount(user);
        long totalMesDemandes = ordreService.countAllOrders(user);

        stats.put("mesDemandesEnCours", mesDemandesEnCours);
        stats.put("mesDemandesEnAttente", mesDemandesEnAttente);
        stats.put("mesDemandesTerminees", mesDemandesTerminees);
        stats.put("mesLivraisonsEnCours", mesLivraisonsEnCours);
        stats.put("totalMesDemandes", totalMesDemandes);
        stats.put("totalMesLivraisons", totalMesDemandes); // Assuming Ordre acts as Livraison
        stats.put("notifications", 0); // Placeholder

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/mes-demandes/recentes")
    public ResponseEntity<List<Ordre>> getRecentDemandes() {
        return ResponseEntity.ok(ordreService.findAll(getAuthenticatedUser()));
    }

    @GetMapping("/mes-livraisons/actives")
    public ResponseEntity<List<Ordre>> getActiveLivraisons() {
        // Active deliveries are those en cours de livraison
        User user = getAuthenticatedUser();
        // We'll need to use the repository directly or add a service method if needed,
        // but OrdreService.findAll already returns top 1000. Let's filter or add a
        // specific method.
        // For now, let's use the list from service.
        return ResponseEntity.ok(ordreService.findAll(user).stream()
                .filter(o -> o.getStatut() == Statut.EN_COURS_DE_LIVRAISON)
                .toList());
    }
}
