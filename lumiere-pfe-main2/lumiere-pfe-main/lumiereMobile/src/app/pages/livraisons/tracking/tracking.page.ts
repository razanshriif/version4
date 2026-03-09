import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonButton,
  IonIcon,
  IonSpinner,
  IonRefresher,
  IonRefresherContent
} from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { chatbubbleEllipsesOutline, arrowBackOutline, refreshOutline, cubeOutline, calendarClearOutline, mapOutline, personCircleOutline, busOutline, repeatOutline, logOutOutline, notificationsOutline } from 'ionicons/icons';
import { LivraisonService, LivraisonSimple } from '../../../services/livraison.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.page.html',
  styleUrls: ['./tracking.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonButton,
    IonIcon,
    IonSpinner,
    IonRefresher,
    IonRefresherContent,
    CommonModule,
    FormsModule
  ]
})
export class TrackingPage implements OnInit, OnDestroy {
  livraisons: LivraisonSimple[] = [];
  selectedLivraison: LivraisonSimple | null = null;
  loading = false;
  trackingSubscription?: Subscription;

  constructor(
    private livraisonService: LivraisonService,
    private route: ActivatedRoute,
    private router: Router,
    public navCtrl: NavController
  ) {
    addIcons({ chatbubbleEllipsesOutline, arrowBackOutline, refreshOutline, cubeOutline, calendarClearOutline, mapOutline, personCircleOutline, busOutline, repeatOutline, logOutOutline, notificationsOutline });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['id']) {
        this.loadLivraisonById(+params['id']);
      } else {
        this.loadActiveLivraisons();
      }
    });
  }

  ngOnDestroy() {
    if (this.trackingSubscription) {
      this.trackingSubscription.unsubscribe();
    }
  }

  loadActiveLivraisons() {
    this.loading = true;
    this.livraisonService.getLivraisonsEnCours().subscribe({
      next: (livraisons: LivraisonSimple[]) => {
        this.livraisons = livraisons;
        this.loading = false;

        if (livraisons.length > 0) {
          this.selectLivraison(livraisons[0]);
        }
      },
      error: (error: any) => {
        console.error('Error loading livraisons:', error);
        this.loading = false;
      }
    });
  }

  loadLivraisonById(id: number) {
    this.loading = true;
    this.livraisonService.getLivraisonById(id).subscribe({
      next: (livraison: LivraisonSimple) => {
        this.selectedLivraison = livraison;
        this.livraisons = [livraison];
        this.loading = false;
        // Pas de tracking temps réel — on poll manuellement via refresh
      },
      error: (error: any) => {
        console.error('Error loading livraison:', error);
        this.loading = false;
      }
    });
  }

  selectLivraison(livraison: LivraisonSimple) {
    this.selectedLivraison = livraison;

    if (this.trackingSubscription) {
      this.trackingSubscription.unsubscribe();
    }
    // Pas de WebSocket/SSE disponible — le tracking est statique
  }

  refreshData(event?: any) {
    if (this.selectedLivraison) {
      this.loadLivraisonById(this.selectedLivraison.id);
    } else {
      this.loadActiveLivraisons();
    }

    if (event?.target?.complete) {
      setTimeout(() => {
        event.target.complete();
      }, 1000);
    }
  }

  getStatusClass(statut: string): string {
    const classes: any = {
      'NON_CONFIRME': 'status-draft',
      'NON_PLANIFIE': 'status-pending',
      'PLANIFIE': 'status-validated',
      'EN_COURS_DE_CHARGEMENT': 'status-loading',
      'CHARGE': 'status-loaded',
      'EN_COURS_DE_LIVRAISON': 'status-progress',
      'LIVRE': 'status-delivered',
      'FIN': 'status-done'
    };
    return classes[statut] || 'status-pending';
  }

  getStatusKey(statut: string): string {
    const map: Record<string, string> = {
      NON_CONFIRME: 'pending',
      EN_ATTENTE: 'pending',
      PLANIFIE: 'ready',
      CHARGE: 'ready',
      EN_COURS_DE_LIVRAISON: 'transit',
      EN_LIVRAISON: 'delivery',
      LIVRE: 'done',
      FIN: 'done',
      NON_LIVRE: 'failed'
    };
    return map[statut] || 'pending';
  }

  getStatusLabel(statut: string): string {
    const labels: any = {
      'NON_CONFIRME': 'Brouillon',
      'NON_PLANIFIE': 'Non planifié',
      'PLANIFIE': 'Planifié',
      'EN_COURS_DE_CHARGEMENT': 'En chargement',
      'CHARGE': 'Chargé',
      'EN_COURS_DE_LIVRAISON': 'En livraison',
      'LIVRE': 'Livré',
      'FIN': 'Terminé'
    };
    return labels[statut] || statut;
  }

  formatDate(date: string | Date): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  viewOnMap() {
    if (this.selectedLivraison) {
      this.router.navigate(['/map'], {
        queryParams: { livraisonId: this.selectedLivraison.id }
      });
    }
  }

  viewHistory() {
    if (this.selectedLivraison) {
      // Pour l'instant, on redirige vers la même carte avec un paramètre historique ou on affiche un toast/modal
      // En attendant l'implémentation réelle du tracé historique sur la carte
      this.router.navigate(['/map'], {
        queryParams: {
          livraisonId: this.selectedLivraison.id,
          view: 'history'
        }
      });
    }
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  logout() {
    this.navCtrl.navigateRoot('/login');
  }
}
