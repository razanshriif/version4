package com.example.demo.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.demo.Entity.Client;
import com.example.demo.Entity.Ordre;
import com.example.demo.Entity.Statut;

public interface OrdreRepository extends JpaRepository<Ordre, Long>{
	Optional<Ordre> findByVoycle(String voycle);
	
	  @Query("SELECT COUNT(o) FROM Ordre o WHERE o.statut = 'NON_PLANIFIE'")
	    long countNonPlanifieOrders();

	    @Query("SELECT COUNT(o) FROM Ordre o WHERE o.statut = 'PLANIFIE'")
	    long countPlanifieOrders();
	    @Query("SELECT COUNT(o) FROM Ordre o WHERE o.statut = 'EN_COURS_DE_CHARGEMENT'")
	    long countEnCoursDeChargementOrders();

	    @Query("SELECT COUNT(o) FROM Ordre o WHERE o.statut = 'CHARGE'")
	    long countChargeOrders();

	    @Query("SELECT COUNT(o) FROM Ordre o WHERE o.statut = 'EN_COURS_DE_LIVRAISON'")
	    long countEnCoursDeLivraisonOrders();

	    @Query("SELECT COUNT(o) FROM Ordre o WHERE o.statut = 'LIVRE'")
	    long countLivreOrders();

		List<Ordre> findByStatut(Statut nonPlanifie);
		
		 List<Ordre> findTop1000ByOrderByIdDesc();
}
