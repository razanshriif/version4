package com.example.demo.Controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.context.SecurityContextHolder;
import com.example.demo.securityjwt.user.User;
import com.example.demo.securityjwt.repo.UserRepository;
import com.example.demo.Entity.Client;
import com.example.demo.Service.ClientService;

@RestController
@RequestMapping("/api/clients")
public class ClientController {

    private final ClientService clientService;
    private final UserRepository userRepository;

    public ClientController(ClientService clientService, UserRepository userRepository) {
        this.clientService = clientService;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findFirstByEmailOrderByIdAsc(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
    }

    // 📋 LIST
    @GetMapping
    public List<Client> getAll() {
        return clientService.findAllByOwner(getAuthenticatedUser());
    }

    // 🔍 BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Client> getById(@PathVariable Long id) {
        return clientService.findByIdAndOwner(id, getAuthenticatedUser())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 🔍 BY CODE
    @GetMapping("/code/{code}")
    public ResponseEntity<Client> getByCode(@PathVariable String code) {
        return clientService.findbycodeAndOwner(code, getAuthenticatedUser())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ➕ CREATE
    @PostMapping
    public Client create(@RequestBody Client client) {
        return clientService.save(client, getAuthenticatedUser());
    }

    // ✏️ UPDATE
    @PutMapping("/{id}")
    public Client update(@PathVariable Long id, @RequestBody Client client) {
        return clientService.updateClient(id, client, getAuthenticatedUser());
    }

    // ❌ DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        clientService.deleteByIdAndOwner(id, getAuthenticatedUser());
    }

    // 📊 COUNT
    @GetMapping("/count")
    public long count() {
        return clientService.countByOwner(getAuthenticatedUser());
    }
}
