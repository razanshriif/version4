import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons,
  IonBackButton, IonIcon, IonList, IonItem, IonBadge,
  IonRefresher, IonRefresherContent, IonSpinner
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline, carOutline, chevronForwardOutline,
  locationOutline, calendarOutline, addOutline, chatbubbleEllipsesOutline
} from 'ionicons/icons';
import { LivraisonService } from '../../../services/livraison.service';
import { Livraison } from '../../../models/livraison.model';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons,
    IonBackButton, IonIcon, IonList, IonItem, IonBadge,
    IonRefresher, IonRefresherContent, IonSpinner,
    CommonModule
  ]
})
export class ListPage implements OnInit {
  livraisons: Livraison[] = [];
  isLoading = false;

  constructor(
    private livraisonService: LivraisonService,
    private router: Router
  ) {
    addIcons({
      arrowBackOutline, carOutline, chevronForwardOutline,
      locationOutline, calendarOutline, addOutline, chatbubbleEllipsesOutline
    });
  }

  ngOnInit() {
    this.loadLivraisons();
  }

  loadLivraisons(event?: any) {
    this.isLoading = true;
    this.livraisonService.getLivraisons().subscribe({
      next: (res: any) => {
        this.livraisons = Array.isArray(res) ? res : (res.content || []);
        this.isLoading = false;
        if (event) event.target.complete();
      },
      error: (err) => {
        console.error('Error loading livraisons', err);
        this.isLoading = false;
        if (event) event.target.complete();
      }
    });
  }

  viewDetails(liv: Livraison) {
    this.router.navigate(['/livraisons/tracking'], { queryParams: { id: liv.id } });
  }

  formatDate(date: string | Date): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short'
    });
  }

  getStatusColor(statut: string): string {
    switch (statut) {
      case 'EN_COURS': return 'primary';
      case 'LIVRE': return 'success';
      case 'RETARD': return 'danger';
      default: return 'medium';
    }
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
