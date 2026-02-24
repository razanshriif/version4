package com.example.demo.Service;

import java.util.List;



import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.Entity.Article;
import com.example.demo.Entity.Ordre;

import com.example.demo.Entity.Statut;
import com.example.demo.Entity.Client;
import com.example.demo.Entity.OrderCounter;
import com.example.demo.Entity.Tranck;
import com.example.demo.Repository.ClientRepository;
import com.example.demo.Repository.OrderCounterRepository;
import com.example.demo.Repository.OrdreRepository;
import com.example.demo.Repository.TranckRepository;
import com.example.demo.Service.TranckService;

import jakarta.transaction.Transactional;

@Service
public class OrdreService {
	
	
	
	@Autowired
	    private OrdreRepository ordreRepository;
	  @Autowired
	    private OrderCounterRepository orderCounterRepository;
	
	  private static final int MAX_ORDER_NUMBER = 9999999;

	  @Autowired
	  private  ClientRepository clientRepository ;
	
	
	  @Autowired
	  private  MatriculeService matriculeService ;
	    @Autowired
	    private TranckRepository tranckRepository;
	    
	    
	 



	    public List<Ordre> findAll() {
	        return ordreRepository.findTop1000ByOrderByIdDesc();
	    }

	    public Optional<Ordre> findById(Long id) {
	        return ordreRepository.findById(id);
	    }

	    @Transactional
	    public Ordre save(Ordre ordre) {
	        Tranck tranck = new Tranck();
	        tranck.setDepart(false);
	        tranck.setChargement(false);
	        tranck.setLivraison(false);
	
	        tranck = tranckRepository.save(tranck);
	        
	        ordre.setTrancking(tranck);
	        
	        tranck.setOrdre(ordre);

	        String orderNumber ="DIV"+ generateOrderNumber();
	        ordre.setOrderNumber(orderNumber);
            
            ordre.setStatut(Statut.NON_CONFIRME);
         
  	      
	        return ordreRepository.save(ordre);
	        
	   
	         
	    }
	    
	    private String generateOrderNumber() {
	        // Récupérer le compteur actuel
	        OrderCounter counter = orderCounterRepository.findAll().stream().findFirst().orElse(null);

	        if (counter == null) {
	            // Initialiser le compteur s'il n'existe pas
	            counter = new OrderCounter();
	            counter.setCurrentValue(0);
	        }

	        // Incrémenter le compteur
	        int newOrderNumber = counter.getCurrentValue() + 1;

	        if (newOrderNumber > MAX_ORDER_NUMBER) {
	            newOrderNumber = 1; // Réinitialiser le compteur à 1
	        }

	        // Mettre à jour le compteur
	        counter.setCurrentValue(newOrderNumber);
	        orderCounterRepository.save(counter);

	        // Retourner le numéro d'ordre formaté sur 7 chiffres
	        return String.format("%07d", newOrderNumber);
	    }
	    
	    
	    

	    @Transactional
	    public void deleteById(Long id) {
	        ordreRepository.deleteById(id);
	    }

	    
	    @Transactional
	    public Ordre confirmer(Long id) {
	    	
	    	
	    	
	    	Optional<Ordre> Ordre = ordreRepository.findById(id);
	    	Ordre ordre=Ordre.get();
	    	ordre.setStatut(Statut.NON_PLANIFIE);
	    	
	    	
	    	
	    
	    	
	    	
	    	
	    	final Ordre updatedOrdre = ordreRepository.save(ordre);
	        return updatedOrdre;
	    	
	    	
	    	
	    }

	    
	    
	    @Transactional
	    public Ordre update(Long id, Ordre ordreDetails) {
	    	Optional<Ordre> Ordre = ordreRepository.findById(id);
Ordre ordre=Ordre.get();
	       
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
	        ordre.setTrancking(ordreDetails.getTrancking());

	        final Ordre updatedOrdre = ordreRepository.save(ordre);
	        return updatedOrdre;
	    }
	    
	    
	    
	    public long countAllOrders() {
	        return ordreRepository.count(); // Or ordreRepository.countAllOrders();
	    }
	    
	    
	    public long countNonPlanifieOrders() {
	        return ordreRepository.countNonPlanifieOrders();
	    }

	    public long countPlanifieOrders() {
	        return ordreRepository.countPlanifieOrders();
	    }
	    
	    
	    public long getEnCoursDeChargementOrdersCount() {
	        return ordreRepository.countEnCoursDeChargementOrders();
	    }

	    public long getChargeOrdersCount() {
	        return ordreRepository.countChargeOrders();
	    }

	    public long getEnCoursDeLivraisonOrdersCount() {
	        return ordreRepository.countEnCoursDeLivraisonOrders();
	    }

	    public long getLivreOrdersCount() {
	        return ordreRepository.countLivreOrders();
	    }
    
}
