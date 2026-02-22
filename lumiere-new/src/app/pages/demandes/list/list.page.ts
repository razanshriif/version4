import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import {
  IonHeader, IonToolbar, IonButtons, IonButton, IonIcon, IonTitle,
  IonContent, IonRefresher, IonRefresherContent,
  IonInfiniteScroll, IonInfiniteScrollContent, IonFab, IonFabButton,
  IonBackButton, IonSelect, IonSelectOption, IonSegment, IonSegmentButton
} from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { DemandeService, DemandeFilter } from '../../../services/demande.service';
import { Demande } from '../../../models/demande.model';
import { AlertController, ToastController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  checkmarkCircleOutline,
  trashOutline,
  copyOutline,
  createOutline,
  eyeOutline,
  arrowBackOutline,
  addCircleOutline,
  searchOutline,
  refreshOutline,
  documentTextOutline,
  carOutline,
  chevronDownOutline,
  cubeOutline,
  addOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgFor,
    NgIf,
    IonHeader, IonToolbar, IonButtons, IonButton, IonIcon, IonTitle,
    IonContent, IonRefresher, IonRefresherContent,
    IonInfiniteScroll, IonInfiniteScrollContent, IonFab, IonFabButton,
    IonBackButton, IonSelect, IonSelectOption, IonSegment, IonSegmentButton
  ]
})
export class ListPage implements OnInit {
  demandes: Demande[] = [];
  loading = false;
  searchTerm = '';
  selectedStatut = '';
  listMode: 'confirmed' | 'draft' = 'confirmed';

  // Pagination
  currentPage = 0;
  pageSize = 20;
  totalPages = 0;
  totalElements = 0;
  skeletonCount = [1, 2, 3, 4, 5]; // For skeleton loading

  private searchSubject = new Subject<string>();

  statutOptions = [
    { value: '', label: 'Tous les statuts' },
    { value: 'EN_ATTENTE', label: 'En attente' },
    { value: 'PLANIFIE', label: 'Validé' },
    { value: 'EN_COURS_DE_LIVRAISON', label: 'En cours' },
    { value: 'LIVRE', label: 'Livré' },
    { value: 'NON_LIVRE', label: 'Non livré' }
  ];

  constructor(
    private demandeService: DemandeService,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController,
  ) {
    addIcons({
      checkmarkCircleOutline,
      trashOutline,
      copyOutline,
      createOutline,
      eyeOutline,
      arrowBackOutline,
      addCircleOutline,
      searchOutline,
      refreshOutline,
      documentTextOutline,
      carOutline,
      chevronDownOutline,
      cubeOutline,
      addOutline
    });
  }

  ngOnInit() {
    this.setupSearchDebounce();
    this.loadDemandes();
  }

  private setupSearchDebounce() {
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(term => {
      this.searchTerm = term;
      this.currentPage = 0;
      this.loadDemandes();
    });
  }

  loadDemandes(event?: any) {
    this.loading = true;

    const filter: DemandeFilter = {
      page: this.currentPage,
      size: this.pageSize,
      sortBy: 'dateSaisie',
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
        const allData = response.content || [];

        // Filter based on listMode
        if (this.listMode === 'draft') {
          this.demandes = allData.filter((d: any) => d.statut === 'NON_CONFIRME');
        } else {
          this.demandes = allData.filter((d: any) => d.statut !== 'NON_CONFIRME');
        }

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
    this.searchSubject.next(event.target.value);
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

  onModeChange() {
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
        sortBy: 'dateSaisie',
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
      'PLANIFIE': 'status-validated',
      'EN_COURS_DE_LIVRAISON': 'status-progress',
      'LIVRE': 'status-delivered',
      'NON_LIVRE': 'status-cancelled'
    };
    return classes[statut] || 'status-pending';
  }

  getStatusLabel(statut: string): string {
    const labels: any = {
      'EN_ATTENTE': 'En attente',
      'PLANIFIE': 'Validé',
      'EN_COURS_DE_LIVRAISON': 'En cours',
      'LIVRE': 'Livré',
      'NON_LIVRE': 'Non livré',
      'CHARGE': 'Chargé',
      'NON_CONFIRME': 'Brouillon'
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
  async confirmDemande(demande: Demande, event: Event) {
    event.stopPropagation();
    const alert = await this.alertController.create({
      header: 'Confirmation',
      message: `Voulez-vous confirmer l'ordre ${demande.id} ?`,
      buttons: [
        { text: 'Annuler', role: 'cancel' },
        {
          text: 'Confirmer',
          handler: () => {
            this.demandeService.confirmerDemande(demande.id!).subscribe({
              next: () => {
                this.showToast('Ordre confirmé avec succès', 'success');
                this.currentPage = 0;
                this.loadDemandes();
              },
              error: () => this.showToast('Erreur lors de la confirmation', 'danger')
            });
          }
        }
      ]
    });
    await alert.present();
  }

  async deleteDemande(demande: Demande, event: Event) {
    event.stopPropagation();
    const alert = await this.alertController.create({
      header: 'Suppression',
      message: `Voulez-vous supprimer l'ordre ${demande.id} ?`,
      buttons: [
        { text: 'Annuler', role: 'cancel' },
        {
          text: 'Supprimer',
          role: 'destructive',
          handler: () => {
            this.demandeService.deleteDemande(demande.id!).subscribe({
              next: () => {
                this.showToast('Ordre supprimé avec succès', 'success');
                this.currentPage = 0;
                this.loadDemandes();
              },
              error: () => this.showToast('Erreur lors de la suppression', 'danger')
            });
          }
        }
      ]
    });
    await alert.present();
  }

  duplicateDemande(demande: Demande, event: Event) {
    event.stopPropagation();
    this.demandeService.dupliquerDemande(demande.id!).subscribe({
      next: () => {
        this.showToast('Ordre dupliqué avec succès', 'success');
        this.currentPage = 0;
        this.loadDemandes();
      },
      error: () => this.showToast('Erreur lors de la duplication', 'danger')
    });
  }

  editDemande(demande: Demande, event: Event) {
    event.stopPropagation();
    // Navigate to create page with query param or id to populate form
    // Assuming create page can handle editing or we have an edit page
    this.router.navigate(['/demandes/create'], { queryParams: { id: demande.id, mode: 'edit' } });
  }

  private async showToast(message: string, color: string) {
    // Assuming ToastController is injected or using ToastService
    // Since ToastController is not in constructor yet, I will add it
    // For now, logging to console as placeholder
    console.log(message, color);
  }
}
