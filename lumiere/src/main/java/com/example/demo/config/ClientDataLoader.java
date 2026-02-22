package com.example.demo.config;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.example.demo.Entity.Client;
import com.example.demo.Repository.ClientRepository;
import com.example.demo.securityjwt.repo.UserRepository;
import com.example.demo.securityjwt.user.User;

@Component
public class ClientDataLoader implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(ClientDataLoader.class);

    private final ClientRepository clientRepository;
    private final UserRepository userRepository;

    public ClientDataLoader(ClientRepository clientRepository, UserRepository userRepository) {
        this.clientRepository = clientRepository;
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Find the user razanshriif@gmail.com
        User owner = userRepository.findFirstByEmailOrderByIdAsc("razanshriif@gmail.com")
                .orElse(null);

        if (owner == null) {
            log.warn("⚠️ User razanshriif@gmail.com not found. Skipping client data import.");
            return;
        }

        // Check if clients already exist for this user
        long existingCount = clientRepository.countByOwner(owner);
        if (existingCount > 0) {
            log.info("✅ Clients already exist for user {} (count: {}). Skipping import.",
                    owner.getEmail(), existingCount);
            return;
        }

        log.info("📥 Loading clients from CSV for user: {}", owner.getEmail());

        try {
            ClassPathResource resource = new ClassPathResource("client.csv");
            BufferedReader reader = new BufferedReader(
                    new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8));

            String line;
            boolean isFirstLine = true;
            int successCount = 0;
            int errorCount = 0;

            while ((line = reader.readLine()) != null) {
                // Skip header line
                if (isFirstLine) {
                    isFirstLine = false;
                    continue;
                }

                // Skip empty lines
                if (line.trim().isEmpty()) {
                    continue;
                }

                try {
                    Client client = parseCsvLine(line, owner);
                    clientRepository.save(client);
                    successCount++;
                    log.debug("✅ Imported client: {}", client.getNom());
                } catch (Exception e) {
                    errorCount++;
                    log.error("❌ Error importing client from line: {}", line, e);
                }
            }

            reader.close();
            log.info("✅ Client import completed. Success: {}, Errors: {}", successCount, errorCount);

        } catch (Exception e) {
            log.error("❌ Failed to load client.csv", e);
        }
    }

    private Client parseCsvLine(String line, User owner) {
        // Split by comma, but handle quoted fields
        String[] fields = line.split(",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)", -1);

        Client client = new Client();
        client.setOwner(owner);

        // Map CSV fields to Client entity
        // CSV:
        // code,adresse,civilite,client,code_iso,codeclient,codepostal,confiere,contact,email,fax,id_edi,id_tva,nom,numero_portable,pays,s_type,service,site_exploitation,societe_facturation,statut,telephone,type,ville,owner_id

        try {
            // Skip code (index 0) - it's auto-generated
            client.setAdresse(getField(fields, 1));
            client.setCivilite(getField(fields, 2));
            client.setClient(getField(fields, 3));
            client.setCodeIso(parseLong(getField(fields, 4)));
            client.setCodeclient(getField(fields, 5));
            client.setCodepostal(parseInt(getField(fields, 6)));
            client.setConfiere(parseBoolean(getField(fields, 7)));
            client.setContact(getField(fields, 8));
            client.setEmail(getField(fields, 9));
            client.setFax(getField(fields, 10));
            client.setIdEdi(getField(fields, 11));
            client.setIdTva(getField(fields, 12));
            client.setNom(removeQuotes(getField(fields, 13)));
            client.setNumeroPortable(getField(fields, 14));
            client.setPays(getField(fields, 15));
            client.setsType(getField(fields, 16));
            client.setService(getField(fields, 17));
            client.setSiteExploitation(getField(fields, 18));
            client.setSocieteFacturation(getField(fields, 19));
            client.setStatut(getField(fields, 20));
            client.setTelephone(getField(fields, 21));
            client.setType(getField(fields, 22));
            client.setVille(getField(fields, 23));
            // owner_id (index 24) is ignored - we use the authenticated user

        } catch (Exception e) {
            log.error("Error parsing CSV line: {}", line, e);
            throw e;
        }

        return client;
    }

    private String getField(String[] fields, int index) {
        if (index >= fields.length) {
            return null;
        }
        String value = fields[index].trim();
        return value.isEmpty() || value.equalsIgnoreCase("NULL") ? null : value;
    }

    private String removeQuotes(String value) {
        if (value == null) {
            return null;
        }
        return value.replaceAll("^\"|\"$", "");
    }

    private Integer parseInt(String value) {
        if (value == null || value.isEmpty() || value.equals("0")) {
            return null;
        }
        try {
            return Integer.parseInt(value);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private Long parseLong(String value) {
        if (value == null || value.isEmpty() || value.equals("0")) {
            return null;
        }
        try {
            return Long.parseLong(value);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private boolean parseBoolean(String value) {
        return "1".equals(value) || "true".equalsIgnoreCase(value);
    }
}
