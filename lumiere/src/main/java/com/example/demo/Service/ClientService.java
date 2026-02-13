package com.example.demo.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
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

    public Optional<Client> findById(Long id) {
        return repo.findById(id);
    }

    public Optional<Client> findbycode(String code) {
        return repo.findByCodeclient(code);
    }

    public Client save(Client client) {
        return repo.save(client);
    }

    public void deleteById(Long id) {
        repo.deleteById(id);
    }

    public Client updateClient(Long id, Client details) {
        Client client = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Client not found"));

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
}
