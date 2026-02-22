package com.example.demo.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.Entity.Ordre;
import com.example.demo.Entity.Statut;
import com.example.demo.Entity.OrderCounter;
import com.example.demo.Entity.Tranck;
import com.example.demo.Repository.OrderCounterRepository;
import com.example.demo.Repository.OrdreRepository;
import com.example.demo.Repository.TranckRepository;
import com.example.demo.securityjwt.user.User;

import jakarta.transaction.Transactional;

@Service
public class OrdreService {

	@Autowired
	private OrdreRepository ordreRepository;

	@Autowired
	private OrderCounterRepository orderCounterRepository;

	private static final int MAX_ORDER_NUMBER = 9999999;

	@Autowired
	private TranckRepository tranckRepository;

	public List<Ordre> findAll(User owner) {
		return ordreRepository.findTop1000ByOwnerOrderByIdDesc(owner);
	}

	public Page<Ordre> findAll(User owner, Pageable pageable) {
		return ordreRepository.findByOwner(owner, pageable);
	}

	public Page<Ordre> findByStatut(User owner, Statut statut, Pageable pageable) {
		return ordreRepository.findByStatutAndOwner(statut, owner, pageable);
	}

	public Optional<Ordre> findById(Long id, User owner) {
		return ordreRepository.findByIdAndOwner(id, owner);
	}

	@Transactional
	public Ordre save(Ordre ordre, User owner) {
		Tranck tranck = new Tranck();
		tranck.setDepart(false);
		tranck.setChargement(false);
		tranck.setLivraison(false);
		tranck.setOwner(owner);

		tranck = tranckRepository.save(tranck);

		ordre.setTrancking(tranck);
		ordre.setOwner(owner);

		tranck.setOrdre(ordre);

		String orderNumber = "DIV" + generateOrderNumber();
		ordre.setOrderNumber(orderNumber);

		ordre.setStatut(Statut.NON_CONFIRME);

		return ordreRepository.save(ordre);
	}

	private String generateOrderNumber() {
		OrderCounter counter = orderCounterRepository.findAll().stream().findFirst().orElse(null);

		if (counter == null) {
			counter = new OrderCounter();
			counter.setCurrentValue(0);
		}

		int newOrderNumber = counter.getCurrentValue() + 1;

		if (newOrderNumber > MAX_ORDER_NUMBER) {
			newOrderNumber = 1;
		}

		counter.setCurrentValue(newOrderNumber);
		orderCounterRepository.save(counter);

		return String.format("%07d", newOrderNumber);
	}

	@Transactional
	public void deleteById(Long id, User owner) {
		Optional<Ordre> existing = ordreRepository.findByIdAndOwner(id, owner);
		if (existing.isPresent()) {
			ordreRepository.delete(existing.get());
		}
	}

	@Transactional
	public Ordre confirmer(Long id, User owner) {
		Optional<Ordre> opte = ordreRepository.findByIdAndOwner(id, owner);
		if (opte.isPresent()) {
			Ordre ordre = opte.get();
			ordre.setStatut(Statut.NON_PLANIFIE);
			return ordreRepository.save(ordre);
		}
		return null;
	}

	@Transactional
	public Ordre update(Long id, Ordre ordreDetails, User owner) {
		Optional<Ordre> opt = ordreRepository.findByIdAndOwner(id, owner);
		if (opt.isPresent()) {
			Ordre ordre = opt.get();

			ordre.setClient(ordreDetails.getClient());
			ordre.setChargementNom(ordreDetails.getChargementNom());
			ordre.setChargementAdr1(ordreDetails.getChargementAdr1());
			ordre.setChargementAdr2(ordreDetails.getChargementAdr2());
			ordre.setChargementVille(ordreDetails.getChargementVille());
			ordre.setChargementDate(ordreDetails.getChargementDate());
			ordre.setLivraisonNom(ordreDetails.getLivraisonNom());
			ordre.setLivraisonAdr1(ordreDetails.getLivraisonAdr1());
			ordre.setLivraisonAdr2(ordreDetails.getLivraisonAdr2());
			ordre.setLivraisonVille(ordreDetails.getLivraisonVille());
			ordre.setLivraisonDate(ordreDetails.getLivraisonDate());
			ordre.setCodeArticle(ordreDetails.getCodeArticle());
			ordre.setDesignation(ordreDetails.getDesignation());

			ordre.setPoids(ordreDetails.getPoids());
			ordre.setVolume(ordreDetails.getVolume());
			ordre.setNombrePalettes(ordreDetails.getNombrePalettes());
			ordre.setNombreColis(ordreDetails.getNombreColis());
			ordre.setLongueur(ordreDetails.getLongueur());

			ordre.setStatut(ordreDetails.getStatut());
			ordre.setCommentaires(ordreDetails.getCommentaires());

			return ordreRepository.save(ordre);
		}
		return null;
	}

	public long countAllOrders(User owner) {
		return ordreRepository.countByOwner(owner);
	}

	public long countNonPlanifieOrders(User owner) {
		return ordreRepository.countNonPlanifieOrdersByOwner(owner);
	}

	public long countPlanifieOrders(User owner) {
		return ordreRepository.countPlanifieOrdersByOwner(owner);
	}

	public long getEnCoursDeChargementOrdersCount(User owner) {
		return ordreRepository.countEnCoursDeChargementOrdersByOwner(owner);
	}

	public long getChargeOrdersCount(User owner) {
		return ordreRepository.countChargeOrdersByOwner(owner);
	}

	public long getEnCoursDeLivraisonOrdersCount(User owner) {
		return ordreRepository.countEnCoursDeLivraisonOrdersByOwner(owner);
	}

	public long getLivreOrdersCount(User owner) {
		return ordreRepository.countLivreOrdersByOwner(owner);
	}
}
