package com.example.demo.Controller;

import com.example.demo.Entity.Role;
import com.example.demo.Entity.RolePermission;
import com.example.demo.Service.PermissionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/permissions")
@CrossOrigin("*")
public class PermissionController {

    private final PermissionService permissionService;

    public PermissionController(PermissionService permissionService) {
        this.permissionService = permissionService;
    }

    @GetMapping
    public ResponseEntity<List<RolePermission>> getAllPermissions() {
        return ResponseEntity.ok(permissionService.getAllPermissions());
    }

    @GetMapping("/{role}")
    public ResponseEntity<Map<String, Boolean>> getPermissionsByRole(@PathVariable Role role) {
        return ResponseEntity.ok(permissionService.getPermissionMapByRole(role));
    }

    @PostMapping
    public ResponseEntity<Void> updatePermissions(@RequestBody List<RolePermission> permissions) {
        permissionService.updatePermissions(permissions);
        return ResponseEntity.ok().build();
    }
}
