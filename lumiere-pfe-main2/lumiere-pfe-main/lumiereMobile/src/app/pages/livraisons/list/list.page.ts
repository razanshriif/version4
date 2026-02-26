import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons,
  IonBackButton, IonIcon, IonList, IonItem,
  IonRefresher, IonRefresherContent, IonSpinner
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline, carOutline, chevronForwardOutline,
  locationOutline, calendarOutline, addOutline, chatbubbleEllipsesOutline,
  personOutline, checkmarkOutline
} from 'ionicons/icons';
import { LivraisonService, LivraisonSimple } from '../../../services/livraison.service';

/** The 5 delivery stages mapped to order statuses */
const STEPS = [
  { key: 'created', label: 'Créé', statuts: ['EN_ATTENTE', 'NON_CONFIRME'] },
  { key: 'charged', label: 'Chargé', statuts: ['PLANIFIE', 'CHARGE'] },
  { key: 'transit', label: 'En transit', statuts: ['EN_COURS_DE_LIVRAISON'] },
  { key: 'delivery', label: 'Livraison', statuts: ['EN_LIVRAISON'] },
  { key: 'done', label: 'Livré', statuts: ['LIVRE', 'FIN'] },
];

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons,
    IonBackButton, IonIcon, IonList, IonItem,
    IonRefresher, IonRefresherContent, IonSpinner,
    CommonModule
  ]
})
export class ListPage implements OnInit {
  livraisons: LivraisonSimple[] = [];
  isLoading = false;

  constructor(
    private livraisonService: LivraisonService,
    private router: Router
  ) {
    addIcons({
      arrowBackOutline, carOutline, chevronForwardOutline,
      locationOutline, calendarOutline, addOutline, chatbubbleEllipsesOutline,
      personOutline, checkmarkOutline
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

  viewDetails(liv: LivraisonSimple) {
    this.router.navigate(['/livraisons/tracking'], { queryParams: { id: liv.id } });
  }

  formatDate(date: string | Date | undefined): string {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short'
    });
  }

  getStatusKey(statut: string): string {
    const map: Record<string, string> = {
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

  /**
   * Returns the 5 steps with done / active flags based on current statut.
   */
  getSteps(statut: string): { label: string; done: boolean; active: boolean }[] {
    // Find which step index is the current one
    let activeIdx = 0;
    for (let i = 0; i < STEPS.length; i++) {
      if (STEPS[i].statuts.includes(statut)) {
        activeIdx = i;
        break;
      }
      // If statut not matched yet and we're past index 0, mark last found
      if (i === STEPS.length - 1) activeIdx = 0;
    }

    return STEPS.map((s, i) => ({
      label: s.label,
      done: i < activeIdx,
      active: i === activeIdx
    }));
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
