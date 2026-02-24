import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { UsersService } from '../users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  helloMessage: string = '';
  clients: any[] = [];
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
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadUsers();
  }

  loadCurrentUser() {
    // Get current user from localStorage or auth service
    const token = localStorage.getItem('token'); // Changed from 'authToken' to 'token'
    console.log('Token found:', !!token);
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.currentUser = payload;
      console.log('Current user loaded from token:', this.currentUser);
      console.log('Current user role:', this.currentUser.role);
    } else {
      console.error('No token found in localStorage!');
    }
  }

  loadUsers() {
    console.log('Loading users...');
    this.authService.getAllUsers().subscribe(
      users => {
        console.log('Users received from backend:', users);
        console.log('Number of users:', users.length);
        this.clients = users;
      },
      error => {
        console.error('Failed to fetch users', error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
        // this.router.navigate(['/login']); // Optional: redirect if not auth
      }
    );
  }

  approve(id: number) {
    this.authService.updateUserStatus(id, 'ACTIVE').subscribe(
      res => {
        console.log('User approved');
        this.loadUsers();
      },
      err => console.error('Error approving user', err)
    );
  }

  reject(id: number) {
    this.authService.updateUserStatus(id, 'REJECTED').subscribe(
      res => {
        console.log('User rejected');
        this.loadUsers();
      },
      err => console.error('Error rejecting user', err)
    );
  }

  blockUser(id: number) {
    this.authService.updateUserStatus(id, 'REJECTED').subscribe(
      res => {
        console.log('User blocked');
        this.loadUsers();
      },
      err => console.error('Error blocking user', err)
    );
  }

  editUser(user: any) {
    // Populate the modal with user data for editing
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
    // Assuming default 'USER' role and 'PENDING' status from backend logic
    this.authService.register(this.user.firstname, this.user.lastname, this.user.email, this.user.password, this.user.role)
      .subscribe(response => {
        console.log('User registered successfully:', response);
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
        console.error('Error registering user:', error);
      });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Debug helper
  getToken(): string | null {
    return localStorage.getItem('token');
  }
}



