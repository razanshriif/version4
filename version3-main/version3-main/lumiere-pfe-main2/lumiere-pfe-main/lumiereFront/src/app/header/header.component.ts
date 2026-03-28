import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  userName: string = '';

  constructor(private service: NotificationService) {
    // Try to get user name from stored token
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.userName = payload.sub || payload.email || 'Admin';
      }
    } catch (e) {
      this.userName = 'Admin';
    }
  }



  ngOnInit(): void {
    this.afficher();
  }
  @Output() menuClicked = new EventEmitter<boolean>();


  showNotifications: boolean = false;
  notifications: any[] = [];
  clients: any[] = [];
  hasNewNotifications: boolean = this.service.read; // Indique qu'il y a de nouvelles notifications

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;


    if (this.showNotifications) {
      this.hasNewNotifications = false; // Réinitialiser l'état de nouvelles notifications
      for (let i of this.clients) {

        i.isRead = false;

      }

    }
  }


  afficher() {
    this.service.afficher().subscribe(clients => {
      this.clients = clients;

      this.clients = this.clients.reverse();

    });



  }




  // Exemple pour ajouter une nouvelle notification

}


