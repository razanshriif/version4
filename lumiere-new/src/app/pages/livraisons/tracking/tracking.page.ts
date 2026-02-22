import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonIcon,
  IonSpinner,
  IonRefresher,
  IonRefresherContent,
  IonButton
} from '@ionic/angular/standalone';
import { LivraisonService } from '../../../services/livraison.service';
import { Livraison } from '../../../models/livraison.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.page.html',
  styleUrls: ['./tracking.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonIcon,
    IonSpinner,
    IonRefresher,
    IonRefresherContent,
    IonButton,
    CommonModule,
    FormsModule
  ]
})
export class TrackingPage implements OnInit, OnDestroy {
  livraisons: Livraison[] = [];
  selectedLivraison: Livraison | null = null;
  loading = false;
  trackingSubscription?: Subscription;

  constructor(
    private livraisonService: LivraisonService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    // Check if there's an ID in query params
    this.route.queryParams.subscribe(params => {
      if (params['id']) {
        this.loadLivraisonById(params['id']);
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
      next: (livraisons) => {
        this.livraisons = livraisons;
        this.loading = false;

        // Auto-select first livraison if available
        if (livraisons.length > 0) {
          this.selectLivraison(livraisons[0]);
        }
      },
      error: (error) => {
        console.error('Error loading livraisons:', error);
        this.loading = false;
      }
    });
  }

  loadLivraisonById(id: number) {
    this.loading = true;
    this.livraisonService.getLivraisonById(id).subscribe({
      next: (livraison) => {
        this.selectedLivraison = livraison;
        this.livraisons = [livraison];
        this.loading = false;
        this.startRealtimeTracking(id);
      },
      error: (error) => {
        console.error('Error loading livraison:', error);
        this.loading = false;
      }
    });
  }

  selectLivraison(livraison: Livraison) {
    this.selectedLivraison = livraison;

    // Stop previous tracking if any
    if (this.trackingSubscription) {
      this.trackingSubscription.unsubscribe();
    }

    // Start real-time tracking for selected livraison
    this.startRealtimeTracking(livraison.id);
  }

  startRealtimeTracking(id: number) {
    this.trackingSubscription = this.livraisonService.getTrackingRealtime(id).subscribe({
      next: (livraison) => {
        this.selectedLivraison = livraison;

        // Update in the list as well
        const index = this.livraisons.findIndex(l => l.id === id);
        if (index !== -1) {
          this.livraisons[index] = livraison;
        }
      },
      error: (error) => {
        console.error('Error in real-time tracking:', error);
      }
    });
  }

  refreshData(event: any) {
    if (this.selectedLivraison) {
      this.loadLivraisonById(this.selectedLivraison.id);
    } else {
      this.loadActiveLivraisons();
    }

    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  getStatusClass(statut: string): string {
    const classes: any = {
      'EN_ATTENTE': 'status-pending',
      'EN_COURS': 'status-progress',
      'EN_ROUTE': 'status-enroute',
      'LIVREE': 'status-delivered',
      'ANNULEE': 'status-cancelled'
    };
    return classes[statut] || 'status-pending';
  }

  getStatusLabel(statut: string): string {
    const labels: any = {
      'EN_ATTENTE': 'En attente',
      'EN_COURS': 'En cours',
      'EN_ROUTE': 'En route',
      'LIVREE': 'Livrée',
      'ANNULEE': 'Annulée'
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
}
