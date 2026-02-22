package com.example.demo.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import com.example.demo.securityjwt.user.User;
import org.springframework.stereotype.Service;

import com.example.demo.Entity.Client;
import com.example.demo.Repository.ClientRepository;

@Service
public class ClientService {

    private final ClientRepository repo;

    public ClientService(ClientRepository repo) {
        this.repo = repo;
    }

    public List<Client> findAll() {
        return repo.findAll();
    }

    public List<Client> findAllByOwner(User owner) {
        return repo.findByOwner(owner);
    }

    public Optional<Client> findById(Long id) {
        return repo.findById(id);
    }

    public Optional<Client> findByIdAndOwner(Long id, User owner) {
        return repo.findByCodeAndOwner(id, owner);
    }

    public Optional<Client> findbycode(String code) {
        return repo.findByCodeclient(code);
    }

    public Optional<Client> findbycodeAndOwner(String code, User owner) {
        return repo.findByCodeclientAndOwner(code, owner);
    }

    public Client save(Client client) {
        return repo.save(client);
    }

    public Client save(Client client, User owner) {
        client.setOwner(owner);
        return repo.save(client);
    }

    public void deleteById(Long id) {
        repo.deleteById(id);
    }

    public void deleteByIdAndOwner(Long id, User owner) {
        Optional<Client> client = repo.findByCodeAndOwner(id, owner);
        client.ifPresent(c -> repo.deleteById(c.getCode()));
    }

    public Client updateClient(Long id, Client details, User owner) {
        Client client = repo.findByCodeAndOwner(id, owner)
                .orElseThrow(() -> new RuntimeException("Client not found or access denied"));

        client.setNom(details.getNom());
        client.setEmail(details.getEmail());
        client.setTelephone(details.getTelephone());
        client.setAdresse(details.getAdresse());
        client.setVille(details.getVille());
        client.setPays(details.getPays());

        return repo.save(client);
    }

    public long countAllclients() {
        return repo.count();
    }

    public long countByOwner(User owner) {
        return repo.countByOwner(owner);
    }
}
