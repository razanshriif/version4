package com.example.demo.Controller;

import java.io.IOException;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.example.demo.Entity.Ordre;
import com.example.demo.Entity.Statut;
import com.example.demo.Service.OrdreService;
import com.example.demo.Service.PlaFileService;
import com.example.demo.securityjwt.user.User;
import com.example.demo.securityjwt.repo.UserRepository;

@RestController
@RequestMapping("/api/ordres")
@CrossOrigin(origins = "*") // Simplified for mobile connectivity issues
public class OrdreController {

    @Autowired
    private OrdreService ordreService;

    @Autowired
    private PlaFileService plaFileService;

    @Autowired
    private UserRepository userRepository;

    private User getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findFirstByEmailOrderByIdAsc(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
    }

    @PostMapping
    public Ordre createOrdre(@RequestBody Ordre ordre) {
        return ordreService.save(ordre, getAuthenticatedUser());
    }

    @GetMapping
    public ResponseEntity<?> getAllOrdres(
            @RequestParam(required = false) Statut statut,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortOrder) {

        Sort sort = sortOrder.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        User user = getAuthenticatedUser();

        if (statut != null) {
            return ResponseEntity.ok(ordreService.findByStatut(user, statut, pageable));
        }
        return ResponseEntity.ok(ordreService.findAll(user, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ordre> getOrdreById(@PathVariable Long id) {
        return ordreService.findById(id, getAuthenticatedUser())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Ordre> updateOrdre(
            @PathVariable Long id,
            @RequestBody Ordre ordreDetails) {

        Ordre updatedOrdre = ordreService.update(id, ordreDetails, getAuthenticatedUser());
        if (updatedOrdre == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedOrdre);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrdre(@PathVariable Long id) {
        ordreService.deleteById(id, getAuthenticatedUser());
        return ResponseEntity.noContent().build();
    }

    // ================= ADMIN / BACKOFFICE =================

    @PutMapping("/confirmer/{id}")
    public ResponseEntity<Void> confirmerOrdre(@PathVariable Long id) {
        User owner = getAuthenticatedUser();
        Ordre confirmed = ordreService.confirmer(id, owner);

        if (confirmed != null) {
            try {
                plaFileService.generatePlaFile(confirmed);
            } catch (IOException e) {
                return ResponseEntity.internalServerError().build();
            }
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/count")
    public long countOrders() {
        return ordreService.countAllOrders(getAuthenticatedUser());
    }

    @GetMapping("/countNonPlanifie")
    public long countNonPlanifieOrders() {
        return ordreService.countNonPlanifieOrders(getAuthenticatedUser());
    }

    @GetMapping("/countPlanifie")
    public long countPlanifieOrders() {
        return ordreService.countPlanifieOrders(getAuthenticatedUser());
    }

    @GetMapping("/count/en-cours-de-chargement")
    public long countEnCoursDeChargementOrders() {
        return ordreService.getEnCoursDeChargementOrdersCount(getAuthenticatedUser());
    }

    @GetMapping("/count/charge")
    public long countChargeOrders() {
        return ordreService.getChargeOrdersCount(getAuthenticatedUser());
    }

    @GetMapping("/count/en-cours-de-livraison")
    public long countEnCoursDeLivraisonOrders() {
        return ordreService.getEnCoursDeLivraisonOrdersCount(getAuthenticatedUser());
    }

    @GetMapping("/count/livre")
    public long countLivreOrders() {
        return ordreService.getLivreOrdersCount(getAuthenticatedUser());
    }
}
