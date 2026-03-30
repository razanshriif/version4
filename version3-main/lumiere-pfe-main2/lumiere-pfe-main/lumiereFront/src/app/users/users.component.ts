import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { UsersService } from '../users.service';
import { Router } from '@angular/router';
import { ExportService } from '../export.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  helloMessage: string = '';
  clients: any[] = [];
  filteredUsers: any[] = [];
  searchTerm: string = '';
  currentUser: any = { role: '' }; // Track current user's role

  user = {
    id: 0,
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    role: ""
  }

  constructor(
    private authService: AuthService,
    private router: Router,
    private exportService: ExportService
  ) { }

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadUsers();
  }

  loadCurrentUser() {
    // Get current user from localStorage or auth service
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.currentUser = payload;
      } catch (e) {
        console.error('Error decoding token:', e);
      }
    }
  }

  loadUsers() {
    this.authService.getAllUsers().subscribe(
      users => {
        this.clients = users;
        this.searchUsers();
      },
      error => {
        console.error('Failed to fetch users', error);
      }
    );
  }

  approve(id: number) {
    this.authService.updateUserStatus(id, 'ACTIVE').subscribe(
      res => {
        this.loadUsers();
      },
      err => console.error('Error approving user', err)
    );
  }

  reject(id: number) {
    this.authService.updateUserStatus(id, 'REJECTED').subscribe(
      res => {
        this.loadUsers();
      },
      err => console.error('Error rejecting user', err)
    );
  }

  blockUser(id: number) {
    this.authService.updateUserStatus(id, 'REJECTED').subscribe(
      res => {
        this.loadUsers();
      },
      err => console.error('Error blocking user', err)
    );
  }

  deleteUser(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      this.authService.deleteUser(id).subscribe(
        res => {
          this.loadUsers();
        },
        err => console.error('Error deleting user', err)
      );
    }
  }

  editUser(user: any) {
    this.user = { ...user };
    this.openModal();
  }

  openModal() {
    const modal = document.getElementById('addUserModal');
    if (modal) {
      modal.style.display = 'block';
    }
  }

  closeModal() {
    const modal = document.getElementById('addUserModal');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  onSubmit(): void {
    this.authService.register(this.user.firstname, this.user.lastname, this.user.email, this.user.password, this.user.role)
      .subscribe(response => {
        this.user = {
          id: 0,
          firstname: '',
          lastname: '',
          email: '',
          password: '',
          role: 'CLIENT'
        };
        this.closeModal();
        this.loadUsers();
      }, error => {
        console.error('Error saving user:', error);
      });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  searchUsers() {
    this.filteredUsers = this.clients.filter(u =>
      (u.firstname + ' ' + u.lastname).toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  exportToExcel() {
    const columns = [
      { header: 'ID', key: 'ID' },
      { header: 'Prénom', key: 'Prénom' },
      { header: 'Nom', key: 'Nom' },
      { header: 'Email', key: 'Email' },
      { header: 'Rôle', key: 'Rôle' },
      { header: 'Statut', key: 'Statut' }
    ];
    const data = this.filteredUsers.map(u => ({
      'ID': u.id,
      'Prénom': u.firstname,
      'Nom': u.lastname,
      'Email': u.email,
      'Rôle': u.role,
      'Statut': u.status
    }));
    this.exportService.exportExcel(data, 'Liste des Utilisateurs', 'Users_Export', columns);
  }

  openReport() {
    this.router.navigate(['/material/report'], {
      state: {
        title: 'Liste des Utilisateurs',
        columns: [
          { key: 'id', label: 'ID' },
          { key: 'firstname', label: 'Prénom' },
          { key: 'lastname', label: 'Nom' },
          { key: 'email', label: 'Email' },
          { key: 'role', label: 'Rôle' },
          { key: 'status', label: 'Statut' }
        ],
        data: this.filteredUsers
      }
    });
  }

  get currentUserRole(): string {
    return (this.currentUser && this.currentUser.role) ? this.currentUser.role.toUpperCase() : '';
  }
}
