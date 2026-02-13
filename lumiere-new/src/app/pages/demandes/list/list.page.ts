import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonSearchbar,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonBadge,
  IonButton,
  IonSelect,
  IonSelectOption,
  IonInfiniteScroll,
  IonInfiniteScrollContent
} from '@ionic/angular/standalone';
import { DemandeService, DemandeFilter } from '../../../services/demande.service';
import { Demande } from '../../../models/demande.model';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonSearchbar,
    IonRefresher,
    IonRefresherContent,
    IonSpinner,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonBadge,
    IonButton,
    IonSelect,
    IonSelectOption,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    CommonModule,
    FormsModule,
    NgFor,
    NgIf
  ]
})
export class ListPage implements OnInit {
  demandes: Demande[] = [];
  loading = false;
  searchTerm = '';
  selectedStatut = '';

  // Pagination
  currentPage = 0;
  pageSize = 20;
  totalPages = 0;
  totalElements = 0;

  statutOptions = [
    { value: '', label: 'Tous les statuts' },
    { value: 'EN_ATTENTE', label: 'En attente' },
    { value: 'VALIDEE', label: 'Validée' },
    { value: 'EN_COURS', label: 'En cours' },
    { value: 'LIVREE', label: 'Livrée' },
    { value: 'ANNULEE', label: 'Annulée' }
  ];

  constructor(
    private demandeService: DemandeService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadDemandes();
  }

  loadDemandes(event?: any) {
    this.loading = true;

    const filter: DemandeFilter = {
      page: this.currentPage,
      size: this.pageSize,
      sortBy: 'dateDemande',
      sortOrder: 'desc'
    };

    if (this.searchTerm) {
      filter.search = this.searchTerm;
    }

    if (this.selectedStatut) {
      filter.statut = this.selectedStatut as any;
    }

    this.demandeService.getDemandes(filter).subscribe({
      next: (response) => {
        this.demandes = response.content;
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
        this.loading = false;

        if (event) {
          event.target.complete();
        }
      },
      error: (error) => {
        console.error('Error loading demandes:', error);
        this.loading = false;

        if (event) {
          event.target.complete();
        }
      }
    });
  }

  onSearch(event: any) {
    this.searchTerm = event.target.value;
    this.currentPage = 0;
    this.loadDemandes();
  }

  onStatutChange(event: any) {
    this.selectedStatut = event.target.value;
    this.currentPage = 0;
    this.loadDemandes();
  }

  resetFilters() {
    this.searchTerm = '';
    this.selectedStatut = '';
    this.currentPage = 0;
    this.loadDemandes();
  }

  viewDetails(demande: Demande) {
    this.router.navigate(['/demandes/details'], { queryParams: { id: demande.id } });
  }

  createNewDemande() {
    this.router.navigate(['/demandes/create']);
  }

  refreshData(event: any) {
    this.currentPage = 0;
    this.loadDemandes(event);
  }

  loadMore(event: any) {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;

      const filter: DemandeFilter = {
        page: this.currentPage,
        size: this.pageSize,
        sortBy: 'dateDemande',
        sortOrder: 'desc'
      };

      if (this.searchTerm) {
        filter.search = this.searchTerm;
      }

      if (this.selectedStatut) {
        filter.statut = this.selectedStatut as any;
      }

      this.demandeService.getDemandes(filter).subscribe({
        next: (response) => {
          this.demandes = [...this.demandes, ...response.content];
          event.target.complete();
        },
        error: (error) => {
          console.error('Error loading more demandes:', error);
          event.target.complete();
        }
      });
    } else {
      event.target.complete();
    }
  }

  getStatusClass(statut: string): string {
    const classes: any = {
      'EN_ATTENTE': 'status-pending',
      'VALIDEE': 'status-validated',
      'EN_COURS': 'status-progress',
      'LIVREE': 'status-delivered',
      'ANNULEE': 'status-cancelled'
    };
    return classes[statut] || 'status-pending';
  }

  getStatusLabel(statut: string): string {
    const labels: any = {
      'EN_ATTENTE': 'En attente',
      'VALIDEE': 'Validée',
      'EN_COURS': 'En cours',
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
      year: 'numeric'
    });
  }
}
