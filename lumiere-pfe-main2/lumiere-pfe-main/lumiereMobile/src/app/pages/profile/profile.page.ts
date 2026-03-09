import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonButton,
  IonButtons,
  IonIcon,
  AlertController
} from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  chatbubbleEllipsesOutline, arrowBackOutline, createOutline, keyOutline,
  logOutOutline, personOutline, mailOutline, callOutline,
  lockClosedOutline, notificationsOutline, chevronForwardOutline
} from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service'; // Assuming this path for ToastService

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  host: { 'class': 'ion-page' },
  imports: [
    IonContent,
    IonHeader,
    IonIcon,
    IonButton,
    CommonModule,
    FormsModule,
    HttpClientModule
  ]
})
export class ProfilePage implements OnInit {
  loading = false;
  updating = false;
  editMode = false;
  selectedSegment = 'profile';
  user: any = null;
  stats: any = {
    totalMesDemandes: 0,
    totalMesLivraisons: 0
  };

  constructor(
    private authService: AuthService,
    public router: Router,
    private toastService: ToastService,
    private alertController: AlertController,
    public navCtrl: NavController,
    private http: HttpClient
  ) {
    addIcons({
      chatbubbleEllipsesOutline, arrowBackOutline, createOutline, keyOutline, logOutOutline,
      personOutline, mailOutline, callOutline, lockClosedOutline, notificationsOutline, chevronForwardOutline
    });
  }

  ngOnInit() {
    this.loadProfile();
    this.loadStats();
  }

  loadStats() {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    this.http.get(`${environment.apiUrl}/client/dashboard/stats`, { headers }).subscribe({
      next: (res: any) => {
        this.stats = res;
      },
      error: (err) => console.error('Error loading stats:', err)
    });
  }

  loadProfile() {
    this.loading = true;
    this.authService.getProfile().subscribe({
      next: (user) => {
        this.user = user;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.loading = false;

        if (error.status === 401 || error.status === 403) {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
    // For now, toggleEditMode just switches the state. 
    // Further implementation for editing can be added here.
  }

  async editField(field: string) {
    const labels: any = {
      'firstname': 'Prénom',
      'lastname': 'Nom',
      'email': 'Email',
      'telephone': 'Téléphone'
    };

    const currentValue = this.user[field] || '';

    const alert = await this.alertController.create({
      header: `Modifier ${labels[field]}`,
      inputs: [
        {
          name: 'value',
          type: field === 'email' ? 'email' : (field === 'telephone' ? 'tel' : 'text'),
          placeholder: labels[field],
          value: currentValue
        }
      ],
      buttons: [
        { text: 'Annuler', role: 'cancel' },
        {
          text: 'Enregistrer',
          handler: (data) => {
            if (data.value !== currentValue) {
              this.updateProfile(field, data.value);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  updateProfile(field: string, value: string) {
    // For now, update locally to show immediate feedback.
    // In a real app, we would send this to the backend.
    this.user[field] = value;
    this.toastService.show(`${field} mis à jour avec succès (simulation)`, 'success');
  }

  async logout() {
    const alert = await this.alertController.create({
      header: 'Déconnexion',
      message: 'Voulez-vous vraiment vous déconnecter ?',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel'
        },
        {
          text: 'Déconnexion',
          handler: () => {
            this.authService.logout();
            this.router.navigate(['/login']);
          }
        }
      ]
    });

    await alert.present();
  }

  getUserInitials(): string {
    if (!this.user) return 'U';
    const firstname = this.user.firstname || '';
    const lastname = this.user.lastname || '';
    return `${firstname.charAt(0)}${lastname.charAt(0)}`.toUpperCase() || 'U';
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  goToNotifications() {
    this.router.navigate(['/notifications']);
  }

  goToPassword() {
    // Assuming a route for password change
    this.router.navigate(['/profile/password']);
  }
}
