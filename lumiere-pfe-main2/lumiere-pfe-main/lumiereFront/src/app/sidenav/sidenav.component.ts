import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent {
  @Output() sidebarClosed = new EventEmitter<void>();

  subMenuVisible: boolean = false;
  isActive: boolean = false;

  constructor(private router: Router) { }

  toggleSubMenu(): void {
    this.subMenuVisible = !this.subMenuVisible;
    this.isActive = !this.isActive;
  }

  onCloseSidebar(): void {
    this.sidebarClosed.emit();
  }

  onLogout(): void {
    // Clear token or use AuthService
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}

