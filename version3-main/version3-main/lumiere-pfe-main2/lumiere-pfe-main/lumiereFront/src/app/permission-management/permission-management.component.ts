import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PermissionService } from '../permission.service';

interface Action {
    key: string;
    label: string;
}

interface Module {
    key: string;
    label: string;
    icon: string;
    actions: Action[];
}

@Component({
    selector: 'app-permission-management',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './permission-management.component.html',
    styleUrls: ['./permission-management.component.css']
})
export class PermissionManagementComponent implements OnInit {
    roles = ['ADMIN', 'COMMERCIAL', 'CLIENT', 'USER_LUMIERE'];
    selectedRole: string = 'ADMIN';
    permissions: any[] = [];
    isLoading = false;

    modules: Module[] = [
        {
            key: 'DASHBOARD',
            label: 'Tableau de Bord',
            icon: 'fas fa-chart-line',
            actions: []
        },
        {
            key: 'ORDRES',
            label: 'Gestion des Ordres',
            icon: 'fas fa-clipboard-list',
            actions: [
                { key: 'ORDRES_ADD', label: 'Ajouter des ordres' },
                { key: 'ORDRES_EDIT', label: 'Modifier les ordres' },
                { key: 'ORDRES_DELETE', label: 'Supprimer les ordres' },
                { key: 'ORDRES_VALIDATE', label: 'Valider (Ordres non confirmés)' },
                { key: 'ORDRES_TRACK', label: 'Suivre (Suivi en temps réel)' }
            ]
        },
        {
            key: 'CLIENTS',
            label: 'Gestion des Clients',
            icon: 'fas fa-user-friends',
            actions: [
                { key: 'CLIENTS_ADD', label: 'Ajouter un client' },
                { key: 'CLIENTS_EDIT', label: 'Modifier un client' },
                { key: 'CLIENTS_DELETE', label: 'Supprimer un client' }
            ]
        },
        {
            key: 'ARTICLES',
            label: 'Gestion des Articles',
            icon: 'fas fa-box',
            actions: [
                { key: 'ARTICLES_ADD', label: 'Ajouter un article' },
                { key: 'ARTICLES_EDIT', label: 'Modifier un article' },
                { key: 'ARTICLES_DELETE', label: 'Supprimer un article' }
            ]
        },
        {
            key: 'USERS',
            label: 'Gestion des Utilisateurs',
            icon: 'fas fa-users-cog',
            actions: [
                { key: 'USERS_ADD', label: 'Ajouter un utilisateur' },
                { key: 'USERS_EDIT', label: 'Modifier un utilisateur' },
                { key: 'USERS_DELETE', label: 'Supprimer un utilisateur' }
            ]
        }
    ];

    expandedModule: string | null = 'ORDRES';

    constructor(private permissionService: PermissionService) { }

    ngOnInit(): void {
        this.loadPermissions();
    }

    loadPermissions(): void {
        this.isLoading = true;
        this.permissionService.getAllPermissions().subscribe({
            next: (data) => {
                this.permissions = data;
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Failed to load permissions', err);
                this.isLoading = false;
            }
        });
    }

    toggleModule(key: string) {
        this.expandedModule = this.expandedModule === key ? null : key;
    }

    getPermission(key: string): any {
        return this.permissions.find(p => p.role === this.selectedRole && p.featureKey === key);
    }

    savePermissions(): void {
        this.isLoading = true;
        this.permissionService.updatePermissions(this.permissions).subscribe({
            next: () => {
                alert('Configuration sauvegardée avec succès !');
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Failed to save permissions', err);
                alert('Erreur lors de la sauvegarde');
                this.isLoading = false;
            }
        });
    }
}
