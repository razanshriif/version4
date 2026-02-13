package com.example.demo.Controller;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.Entity.Ordre;
import com.example.demo.Entity.Statut;
import com.example.demo.Service.OrdreService;
import com.example.demo.Service.PlaFileService;

@RestController
@RequestMapping("/api/ordres")
@CrossOrigin(
    origins = {
        "http://localhost:8100",
        "http://127.0.0.1:8100",
        "http://192.168.*.*",
        "capacitor://localhost",
        "ionic://localhost"
    }
)
public class OrdreController {

    @Autowired
    private OrdreService ordreService;

    @Autowired
    private PlaFileService plaFileService;


    @PostMapping
    public Ordre createOrdre(@RequestBody Ordre ordre) {
        ordre.setStatut(Statut.PLANIFIE);
        return ordreService.save(ordre);
    }

    @GetMapping
    public List<Ordre> getAllOrdres() {
        return ordreService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ordre> getOrdreById(@PathVariable Long id) {
        return ordreService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Ordre> updateOrdre(
            @PathVariable Long id,
            @RequestBody Ordre ordreDetails) {

        Ordre updatedOrdre = ordreService.update(id, ordreDetails);
        return ResponseEntity.ok(updatedOrdre);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrdre(@PathVariable Long id) {
        ordreService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // ================= ADMIN / BACKOFFICE =================

    @PutMapping("/confirmer/{id}")
    public ResponseEntity<Void> confirmerOrdre(@PathVariable Long id) {
        ordreService.confirmer(id);

        Optional<Ordre> ordre = ordreService.findById(id);
        if (ordre.isPresent()) {
            try {
                plaFileService.generatePlaFile(ordre.get());
            } catch (IOException e) {
                return ResponseEntity.internalServerError().build();
            }
        }
        return ResponseEntity.ok().build();
    }

    @GetMapping("/count")
    public long countOrders() {
        return ordreService.countAllOrders();
    }

    @GetMapping("/countNonPlanifie")
    public long countNonPlanifieOrders() {
        return ordreService.countNonPlanifieOrders();
    }

    @GetMapping("/countPlanifie")
    public long countPlanifieOrders() {
        return ordreService.countPlanifieOrders();
    }

    @GetMapping("/count/en-cours-de-chargement")
    public long countEnCoursDeChargementOrders() {
        return ordreService.getEnCoursDeChargementOrdersCount();
    }

    @GetMapping("/count/charge")
    public long countChargeOrders() {
        return ordreService.getChargeOrdersCount();
    }

    @GetMapping("/count/en-cours-de-livraison")
    public long countEnCoursDeLivraisonOrders() {
        return ordreService.getEnCoursDeLivraisonOrdersCount();
    }

    @GetMapping("/count/livre")
    public long countLivreOrders() {
        return ordreService.getLivreOrdersCount();
    }
}
