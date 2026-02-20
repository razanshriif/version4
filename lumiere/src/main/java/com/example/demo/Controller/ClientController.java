package com.example.demo.Controller;

import java.util.List;

import java.util.Optional;
import org.springframework.http.ResponseEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Entity.Client;
import com.example.demo.Service.ClientService;
@RestController
@RequestMapping("/clients")
public class ClientController {

    private final ClientService clientService;

    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }

    // 📋 LIST
    @GetMapping
    public List<Client> getAll() {
        return clientService.findAll();
    }

    // 🔍 BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Client> getById(@PathVariable Long id) {
        return clientService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 🔍 BY CODE
    @GetMapping("/code/{code}")
    public ResponseEntity<Client> getByCode(@PathVariable String code) {
        return clientService.findbycode(code)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ➕ CREATE
    @PostMapping
    public Client create(@RequestBody Client client) {
        return clientService.save(client);
    }

    // ✏️ UPDATE
    @PutMapping("/{id}")
    public Client update(@PathVariable Long id, @RequestBody Client client) {
        return clientService.updateClient(id, client);
    }

    // ❌ DELETE
    @DeleteMapping("/{id}")























    
    public void delete(@PathVariable Long id) {
        clientService.deleteById(id);
    }

    // 📊 COUNT
    @GetMapping("/count")
    public long count() {
        return clientService.countAllclients();
    }
}
