package com.example.demo.Service;

import com.example.demo.Entity.Role;
import com.example.demo.Entity.RolePermission;
import com.example.demo.Repository.RolePermissionRepository;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class PermissionService {

    private final RolePermissionRepository repository;

    public PermissionService(RolePermissionRepository repository) {
        this.repository = repository;
    }

    public List<RolePermission> getAllPermissions() {
        return repository.findAll();
    }

    public List<RolePermission> getPermissionsByRole(Role role) {
        return repository.findByRole(role);
    }

    public Map<String, Boolean> getPermissionMapByRole(Role role) {
        return repository.findByRole(role).stream()
                .collect(Collectors.toMap(RolePermission::getFeatureKey, RolePermission::isEnabled));
    }

    @Transactional
    public void updatePermissions(List<RolePermission> permissions) {
        for (RolePermission p : permissions) {
            repository.findByRoleAndFeatureKey(p.getRole(), p.getFeatureKey())
                    .ifPresentOrElse(
                            existing -> {
                                existing.setEnabled(p.isEnabled());
                                repository.save(existing);
                            },
                            () -> repository.save(p));
        }
    }

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void seedPermissions() {
        String[] features = {
                "DASHBOARD",
                "ORDRES", "ORDRES_ADD", "ORDRES_EDIT", "ORDRES_DELETE", "ORDRES_VALIDATE", "ORDRES_TRACK",
                "CLIENTS", "CLIENTS_ADD", "CLIENTS_EDIT", "CLIENTS_DELETE",
                "ARTICLES", "ARTICLES_ADD", "ARTICLES_EDIT", "ARTICLES_DELETE",
                "USERS", "USERS_ADD", "USERS_EDIT", "USERS_DELETE",
                "EMAILS"
        };

        for (Role role : Role.values()) {
            for (String feature : features) {
                if (repository.findByRoleAndFeatureKey(role, feature).isEmpty()) {
                    boolean enabled = (role == Role.ADMIN || role == Role.SUPERADMIN || role == Role.COMMERCIAL);

                    // Defaults for CLIENT / USER_LUMIERE / USER
                    if ((role == Role.CLIENT || role == Role.USER_LUMIERE || role == Role.USER)) {
                        List<String> allowedForAll = Arrays.asList(
                                "DASHBOARD", "ORDRES", "ORDRES_TRACK", "EMAILS");
                        if (allowedForAll.contains(feature)) {
                            enabled = true;
                        }

                        // User Lumiere can also add orders
                        if (role == Role.USER_LUMIERE
                                && (feature.equals("ORDRES_ADD") || feature.equals("ORDRES_VALIDATE"))) {
                            enabled = true;
                        }
                    }

                    RolePermission rp = new RolePermission();
                    rp.setRole(role);
                    rp.setFeatureKey(feature);
                    rp.setEnabled(enabled);
                    repository.save(rp);
                }
            }
        }
    }
}
