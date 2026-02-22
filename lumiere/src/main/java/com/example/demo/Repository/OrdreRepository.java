package com.example.demo.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.demo.Entity.Client;
import com.example.demo.Entity.Ordre;
import com.example.demo.Entity.Statut;
import com.example.demo.securityjwt.user.User;

public interface OrdreRepository extends JpaRepository<Ordre, Long> {
	Optional<Ordre> findByVoycle(String voycle);

	Page<Ordre> findByOwner(User owner, Pageable pageable);

	List<Ordre> findByOwnerOrderByIdDesc(User owner);

	Optional<Ordre> findByIdAndOwner(Long id, User owner);

	@Query("SELECT COUNT(o) FROM Ordre o WHERE o.statut = 'NON_PLANIFIE' AND o.owner = :owner")
	long countNonPlanifieOrdersByOwner(@Param("owner") User owner);

	@Query("SELECT COUNT(o) FROM Ordre o WHERE o.statut = 'PLANIFIE' AND o.owner = :owner")
	long countPlanifieOrdersByOwner(@Param("owner") User owner);

	@Query("SELECT COUNT(o) FROM Ordre o WHERE o.statut = 'EN_COURS_DE_CHARGEMENT' AND o.owner = :owner")
	long countEnCoursDeChargementOrdersByOwner(@Param("owner") User owner);

	@Query("SELECT COUNT(o) FROM Ordre o WHERE o.statut = 'CHARGE' AND o.owner = :owner")
	long countChargeOrdersByOwner(@Param("owner") User owner);

	@Query("SELECT COUNT(o) FROM Ordre o WHERE o.statut = 'EN_COURS_DE_LIVRAISON' AND o.owner = :owner")
	long countEnCoursDeLivraisonOrdersByOwner(@Param("owner") User owner);

	@Query("SELECT COUNT(o) FROM Ordre o WHERE o.statut = 'LIVRE' AND o.owner = :owner")
	long countLivreOrdersByOwner(@Param("owner") User owner);

	List<Ordre> findByStatutAndOwner(Statut statut, User owner);

	Page<Ordre> findByStatutAndOwner(Statut statut, User owner, Pageable pageable);

	List<Ordre> findTop1000ByOwnerOrderByIdDesc(User owner);

	long countByOwner(User owner);

	// Existing global methods (can be kept for admin or internal use)
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

	List<Ordre> findByStatut(Statut statut);

	List<Ordre> findTop1000ByOrderByIdDesc();
}
