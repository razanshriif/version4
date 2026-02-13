import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, HttpClientModule]
})
export class HomePage implements OnInit {

  user: any = {
    firstname: '',
    lastname: '',
    email: ''
  };

  stats: any = {
    mesDemandesEnCours: 0,
    mesDemandesEnAttente: 0,
    mesDemandesTerminees: 0,
    mesLivraisonsEnCours: 0,
    totalMesDemandes: 0,
    totalMesLivraisons: 0,
    notifications: 0
  };

  mesDemandesRecentes: any[] = [];
  mesLivraisonsActives: any[] = [];

  quickActions = [
    { label: 'Nouvelle<br>demande', icon: 'add-circle-outline', color: 'primary', route: '/demandes/create' },
    { label: 'Mes<br>commandes', icon: 'document-text-outline', color: 'secondary', route: '/demandes/list' },
    { label: 'Suivi<br>livraison', icon: 'navigate-outline', color: 'success', route: '/livraisons/tracking' },
    { label: 'Mon<br>compte', icon: 'person-outline', color: 'tertiary', route: '/profile' }
  ];

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.loadAllData();
  }

  ionViewWillEnter() {
    this.loadAllData();
  }

  loadAllData() {
    this.loadUserProfile();
    this.loadMyStats();
    this.loadMesDemandesRecentes();
    this.loadMesLivraisonsActives();
  }

  loadUserProfile() {
    this.authService.getProfile().subscribe({
      next: (res: any) => {
        this.user = res;
        console.log('✅ User profile loaded:', this.user);
      },
      error: (err) => {
        console.error('❌ Error loading user:', err);
        if (err.status === 401 || err.status === 403) {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  loadMyStats() {
    const headers = this.getAuthHeaders();
    this.http.get(`${environment.apiUrl}/client/dashboard/stats`, { headers }).subscribe({
      next: (res: any) => {
        this.stats = res;
        console.log('✅ Stats loaded:', this.stats);
      },
      error: (err) => console.error('❌ Error loading stats:', err)
    });
  }

  loadMesDemandesRecentes() {
    const headers = this.getAuthHeaders();
    this.http.get(`${environment.apiUrl}/client/dashboard/mes-demandes/recentes`, { headers }).subscribe({
      next: (res: any) => {
        this.mesDemandesRecentes = res;
        console.log('✅ Recent demandes loaded:', this.mesDemandesRecentes);
      },
      error: (err) => console.error('❌ Error loading demandes:', err)
    });
  }

  loadMesLivraisonsActives() {
    const headers = this.getAuthHeaders();
    this.http.get(`${environment.apiUrl}/client/dashboard/mes-livraisons/actives`, { headers }).subscribe({
      next: (res: any) => {
        this.mesLivraisonsActives = res;
        console.log('✅ Active livraisons loaded:', this.mesLivraisonsActives);
      },
      error: (err) => console.error('❌ Error loading livraisons:', err)
    });
  }

  refreshData(event: any) {
    this.loadAllData();
    setTimeout(() => event.target.complete(), 1000);
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  viewDemandeDetails(demande: any) {
    this.router.navigate(['/demandes/details'], { queryParams: { id: demande.id } });
  }

  trackLivraison(livraison: any) {
    this.router.navigate(['/livraisons/tracking'], { queryParams: { id: livraison.id } });
  }

  goToNotifications() {
    this.router.navigate(['/notifications']);
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  createNewDemande() {
    this.router.navigate(['/demandes/create']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  formatDate(date: string | Date): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  formatTime(date: string | Date): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getUserInitials(): string {
    if (!this.user.firstname || !this.user.lastname) return 'U';
    return `${this.user.firstname.charAt(0)}${this.user.lastname.charAt(0)}`.toUpperCase();
  }

  getFullName(): string {
    return `${this.user.firstname || ''} ${this.user.lastname || ''}`.trim() || 'Client';
  }

  getStatusClass(statut: string): string {
    return statut || 'EN_ATTENTE';
  }

  getStatusLabel(statut: string): string {
    const labels: any = {
      'EN_ATTENTE': 'En attente',
      'EN_COURS': 'En cours',
      'EN_ROUTE': 'En route',
      'TERMINEE': 'Livrée',
      'ANNULEE': 'Annulée'
    };
    return labels[statut] || statut;
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
}