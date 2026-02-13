package com.example.demo.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.Entity.Client;





public interface ClientRepository extends JpaRepository<Client, Long>{
	
	
	Optional<Client> findByCodeclient(String codeclient);
	
	

}
