package com.example.demo.Repository;

import java.util.List;
import java.util.Optional;

import com.example.demo.securityjwt.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.Entity.Client;

public interface ClientRepository extends JpaRepository<Client, Long> {

	Optional<Client> findByCodeclient(String codeclient);

	Optional<Client> findByCodeclientAndOwner(String codeclient, User owner);

	List<Client> findByOwner(User owner);

	Optional<Client> findByCodeAndOwner(Long code, User owner);

	long countByOwner(User owner);

}
