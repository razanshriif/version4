package com.example.demo.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.Entity.Client;
import com.example.demo.Repository.ClientRepository;
import com.example.demo.Repository.UserRepository;
import com.example.demo.Entity.User;

@Service
public class ClientService {

    @Autowired
    private ClientRepository clientRepository;

    public List<Client> findAll() {
        return clientRepository.findAll();
    }

    // Multi-tenancy: find clients by owner
    public List<Client> findAllByOwner(User owner) {
        return clientRepository.findByOwner(owner);
    }

    public Optional<Client> findbycode(String code) {

        return clientRepository.findByCodeclient(code);

    }

    public String afficheremail(String id) {

        Optional<Client> client = clientRepository.findByCodeclient(id);
        Client c = client.get();
        return c.getEmail();

    }

    public String affichertelephone(String id) {

        Optional<Client> client = clientRepository.findByCodeclient(id);
        Client c = client.get();
        return c.getTelephone();

    }

    public Optional<Client> findById(Long id) {
        return clientRepository.findById(id);
    }

    public Client save(Client client) {
        return clientRepository.save(client);
    }

    // Multi-tenancy: save client with owner
    public Client saveForOwner(Client client, User owner) {
        client.setOwner(owner);
        return clientRepository.save(client);
    }

    public void deleteById(Long id) {
        clientRepository.deleteById(id);
    }

    public Client updateClient(Long id, Client clientDetails) {
        Optional<Client> optionalClient = clientRepository.findById(id);
        if (optionalClient.isPresent()) {
            Client client = optionalClient.get();
            client.setNom(clientDetails.getNom());

            return clientRepository.save(client);
        } else {
            throw new RuntimeException("Client not found with id " + id);
        }
    }

    // Multi-tenancy: update client only if owned by user
    public Client updateClientForOwner(Long id, Client clientDetails, User owner) {
        Optional<Client> optionalClient = clientRepository.findById(id);
        if (optionalClient.isPresent()) {
            Client client = optionalClient.get();
            // Security check: verify ownership
            if (client.getOwner() != null && !client.getOwner().equals(owner)) {
                throw new RuntimeException("Unauthorized: Client does not belong to this user");
            }
            client.setNom(clientDetails.getNom());
            return clientRepository.save(client);
        } else {
            throw new RuntimeException("Client not found with id " + id);
        }
    }

    public long countAllclients() {
        return clientRepository.count(); // Or ordreRepository.countAllOrders();
    }
}