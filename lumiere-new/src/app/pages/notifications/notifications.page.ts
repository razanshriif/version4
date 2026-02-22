import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class NotificationsPage implements OnInit {

  notifications: any[] = [
    {
      id: 1,
      title: 'Connexion réussie',
      message: 'Vous êtes maintenant connecté au réseau Lumière.',
      type: 'success',
      date: new Date(),
      read: false
    },
    {
      id: 2,
      title: 'Bienvenue',
      message: 'Bienvenue sur la nouvelle application mobile Lumière !',
      type: 'info',
      date: new Date(Date.now() - 3600000), // 1 hour ago
      read: true
    }
  ];

  constructor(private router: Router) { }

  ngOnInit() {
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  markAsRead(id: number) {
    const notif = this.notifications.find(n => n.id === id);
    if (notif) notif.read = true;
  }

  deleteNotification(id: number) {
    this.notifications = this.notifications.filter(n => n.id !== id);
  }

  getIcon(type: string): string {
    switch (type) {
      case 'success': return 'checkmark-circle-outline';
      case 'warning': return 'warning-outline';
      case 'error': return 'alert-circle-outline';
      default: return 'information-circle-outline';
    }
  }

  getColor(type: string): string {
    switch (type) {
      case 'success': return 'success';
      case 'warning': return 'warning';
      case 'error': return 'danger';
      default: return 'primary';
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}

