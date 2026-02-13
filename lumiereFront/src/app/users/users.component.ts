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
    this.loadUsers();
  }

  loadUsers() {
    this.authService.getAllUsers().subscribe(
      users => this.clients = users,
      error => {
        console.error('Failed to fetch users', error);
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
          role: 'USER'
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
}



