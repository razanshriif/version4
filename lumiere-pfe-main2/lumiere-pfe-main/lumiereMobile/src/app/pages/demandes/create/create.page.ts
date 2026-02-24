import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  ToastController,
  LoadingController
} from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { DemandeService } from '../../../services/demande.service';
import { ClientService } from '../../../services/client.service';
import { AuthService } from '../../../services/auth.service';
import { Client } from '../../../models/client.model';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule
  ]
})
export class CreatePage implements OnInit {

  ordre = {
    id: 0,
    matricule: "",
    client: '',
    nomclient: '',
    siteclient: '',
    idedi: '',
    codeclientcharg: "",
    chargementNom: "",
    chargementAdr1: "",
    chargementAdr2: "",
    chargementVille: "",
    chargementDate: this.getCurrentDateTime(),
    codeclientliv: "",
    livraisonNom: "",
    livraisonAdr1: "",
    livraisonAdr2: "",
    codepostalliv: "",
    livraisonVille: "",
    livraisonDate: this.getCurrentDateTime(),
    codeArticle: "",
    designation: "",
    poids: 0.0,
    volume: 0.0,
    nombrePalettes: 0,
    nombreColis: 0,
    longueur: 0.0,
    dateSaisie: this.getCurrentDateTime(),
    statut: "NON_CONFIRME",
    commentaires: []
  };

  clients: Client[] = [];
  filteredClients: Client[] = [];
  showClientList = false;
  currentSelectionTarget: 'main' | 'chargement' | 'livraison' = 'main';
  newComment = "";

  constructor(
    private demandeService: DemandeService,
    private clientService: ClientService,
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.loadClientsAndAutoFill();
  }

  getCurrentDateTime(): string {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16); // format: YYYY-MM-DDTHH:mm
  }

  loadClientsAndAutoFill() {
    this.clientService.getAll().subscribe({
      next: (data) => {
        this.clients = data;
        this.filteredClients = data;

        // Auto-fill from Auth Profile first (User's private info)
        this.authService.getProfile().subscribe((profile: any) => {
          if (profile) {
            this.ordre.nomclient = profile.firstname + ' ' + (profile.lastname || '');
            this.ordre.client = profile.codeClient || 'cli007'; // Fallback to provided code
            this.ordre.siteclient = profile.site || '';

            // Also auto-populate chargement as default
            this.ordre.codeclientcharg = this.ordre.client;
            this.ordre.chargementNom = this.ordre.nomclient;
          }
        });
      },
      error: (err) => console.error('Error loading clients:', err)
    });
  }

  filterClients(event: any, target: 'main' | 'chargement' | 'livraison') {
    const val = event.target.value;
    this.currentSelectionTarget = target;
    this.showClientList = true;
    if (val && val.trim() !== '') {
      this.filteredClients = this.clients.filter((item) => {
        const nom = item.nom?.toLowerCase() || '';
        const code = item.codeclient?.toLowerCase() || '';
        const search = val.toLowerCase();
        return nom.includes(search) || code.includes(search);
      });
    } else {
      this.filteredClients = this.clients;
    }
  }

  openPicker(target: 'main' | 'chargement' | 'livraison') {
    this.currentSelectionTarget = target;
    this.filteredClients = this.clients;
    this.showClientList = true;
  }

  onClientSelect(client: Client) {
    if (this.currentSelectionTarget === 'main') {
      this.ordre.client = client.codeclient || '';
      this.ordre.nomclient = client.nom || '';
      this.ordre.siteclient = client.siteExploitation || '';
      this.ordre.idedi = client.idEdi || '';
    } else if (this.currentSelectionTarget === 'chargement') {
      this.ordre.codeclientcharg = client.codeclient || '';
      this.ordre.chargementNom = client.nom || '';
      this.ordre.chargementAdr1 = client.adresse || '';
      this.ordre.chargementVille = client.ville || '';
    } else if (this.currentSelectionTarget === 'livraison') {
      this.ordre.codeclientliv = client.codeclient || '';
      this.ordre.livraisonNom = client.nom || '';
      this.ordre.livraisonAdr1 = client.adresse || '';
      this.ordre.livraisonVille = client.ville || '';
    }

    this.showClientList = false;
  }

  async onSubmit() {
    if (!this.ordre.client) {
      await this.showToast('Veuillez renseigner le code client', 'warning');
      return;
    }

    try {
      const payload = { ...this.ordre };
      if (this.newComment.trim()) {
        payload.commentaires = [...(this.ordre.commentaires || []), this.newComment.trim()] as any;
      }
      // Backend expects Date objects, datetime-local string is usually parseable
      await this.demandeService.createDemande(payload as any).toPromise();
      await this.showToast('Ordre créé avec succès!', 'success');
      this.router.navigate(['/demandes/list']);
    } catch (error) {
      console.error('Erreur lors de la création de l\'ordre:', error);
      await this.showToast('Erreur lors de la création de l\'ordre', 'danger');
    }
  }

  cancel() {
    this.router.navigate(['/demandes/list']);
  }

  goToCreateClient() {
    this.router.navigate(['/clients/create']);
  }

  private async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'top'
    });
    await toast.present();
  }
}
