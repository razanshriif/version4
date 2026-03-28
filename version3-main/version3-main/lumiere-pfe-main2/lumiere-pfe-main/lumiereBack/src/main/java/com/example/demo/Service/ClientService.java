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

    @Autowired
    private UserRepository userRepository;

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
            updateClientFields(client, clientDetails);

            // Check if profile is now completed
            if (isProfileComplete(client)) {
                System.out.println("DEBUG: Profile complete for client ID: " + client.getCode());
                client.setProfileCompleted(true);

                // Link to user by email if owner is missing
                if (client.getOwner() == null && client.getEmail() != null) {
                    System.out.println("DEBUG: Owner missing, searching for user with email: " + client.getEmail());
                    userRepository.findByEmail(client.getEmail()).ifPresent(u -> {
                        System.out.println("DEBUG: Found user ID " + u.getId() + ", linking as owner.");
                        client.setOwner(u);
                    });
                }

                // Activate the user
                if (client.getOwner() != null) {
                    User user = client.getOwner();
                    System.out
                            .println("DEBUG: Activating user ID: " + user.getId() + " for client: " + client.getNom());
                    user.setStatus(com.example.demo.Entity.Status.ACTIVE);
                    userRepository.save(user);
                } else {
                    System.out.println("DEBUG: WARNING - Client has NO owner, cannot activate user!");
                }
            } else {
                System.out.println("DEBUG: Profile NOT complete for client ID: " + client.getCode());
                client.setProfileCompleted(false); // Ensure it's false if incomplete
            }

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
            updateClientFields(client, clientDetails);

            // Clients can also complete their own profile if they have access
            if (isProfileComplete(client)) {
                client.setProfileCompleted(true);
            }

            return clientRepository.save(client);
        } else {
            throw new RuntimeException("Client not found with id " + id);
        }
    }

    private void updateClientFields(Client target, Client source) {
        target.setNom(source.getNom());
        target.setAdresse(source.getAdresse());
        target.setVille(source.getVille());
        target.setPays(source.getPays());
        target.setCodepostal(source.getCodepostal());
        target.setTelephone(source.getTelephone());
        target.setEmail(source.getEmail());
        target.setCodeclient(source.getCodeclient());
        target.setCivilite(source.getCivilite());
        target.setType(source.getType());
        target.setStatut(source.getStatut());
        target.setsType(source.getsType());
        target.setSocieteFacturation(source.getSocieteFacturation());
        target.setSiteExploitation(source.getSiteExploitation());
        target.setService(source.getService());
        target.setNumeroPortable(source.getNumeroPortable());
        target.setFax(source.getFax());
        target.setIdEdi(source.getIdEdi());
        target.setIdTva(source.getIdTva());
        target.setCodeIso(source.getCodeIso());
        target.setContact(source.getContact());
    }

    private boolean isProfileComplete(Client client) {
        // Logic to determine if a profile is "enough" to activate the user
        // For now, let's say if codeclient and basic info exist
        return client.getCodeclient() != null && !client.getCodeclient().isEmpty() &&
                client.getNom() != null && !client.getNom().isEmpty() &&
                client.getAdresse() != null && !client.getAdresse().isEmpty();
    }

    public long countAllclients() {
        return clientRepository.count(); // Or ordreRepository.countAllOrders();
    }
}