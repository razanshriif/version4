import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonIcon,
  ToastController
} from '@ionic/angular/standalone';
import { DemandeService } from '../../../services/demande.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonIcon,
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
    chargementDate: "",
    codeclientliv: "",
    livraisonNom: "",
    livraisonAdr1: "",
    livraisonAdr2: "",
    codepostalliv: "",
    livraisonVille: "",
    livraisonDate: "",
    codeArticle: "",
    designation: "",
    poids: 0.0,
    volume: 0.0,
    nombrePalettes: 0,
    nombreColis: 0,
    longueur: 0.0,
    dateSaisie: new Date().toISOString().split('T')[0],
    statut: "NON_CONFIRME",
    commentaires: []
  };

  constructor(
    private demandeService: DemandeService,
    private router: Router,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    // Initialize with current date
    this.ordre.dateSaisie = new Date().toISOString().split('T')[0];
  }

  async onSubmit() {
    // Validate required fields
    if (!this.ordre.client) {
      await this.showToast('Veuillez renseigner le code client', 'warning');
      return;
    }

    try {
      await this.demandeService.createDemande(this.ordre as any).toPromise();
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
