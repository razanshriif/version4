import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  ToastController,
  LoadingController,
  IonHeader, IonToolbar, IonButtons, IonButton, IonIcon, IonTitle,
  IonContent, IonItem, IonLabel, IonInput, IonDatetime,
  IonDatetimeButton, IonModal, IonSegment, IonSegmentButton, IonSelect,
  IonSelectOption, IonList, IonSearchbar, IonNote, IonTextarea
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  businessOutline, locationOutline, cubeOutline, calendarOutline,
  carOutline, searchOutline, sendOutline, arrowUpCircleOutline, chatbubbleOutline,
  arrowBackOutline, personAddOutline, closeOutline, cloudUploadOutline
} from 'ionicons/icons';
import { DemandeService } from '../../../services/demande.service';
import { ClientService } from '../../../services/client.service';
import { ArticleService } from '../../../services/article.service';
import { AuthService } from '../../../services/auth.service';
import { Client } from '../../../models/client.model';
import { Article } from '../../../models/article.model';
import { Ordre } from '../../../models/ordre.model';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent,
    IonButtons, IonButton, IonIcon, IonItem, IonLabel,
    IonInput, IonDatetime, IonDatetimeButton, IonModal, IonSegment,
    IonSegmentButton, IonSelect, IonSelectOption, IonList, IonSearchbar, IonNote, IonTextarea
  ]
})
export class CreatePage implements OnInit {
  ordre: Ordre = {
    client: '',
    nomclient: '',
    siteclient: 'SAL',
    codeclientcharg: '',
    chargementNom: '',
    chargementAdr1: '',
    chargementVille: '',
    codepostalcharg: '',
    codeclientliv: '',
    livraisonNom: '',
    livraisonAdr1: '',
    livraisonVille: '',
    codepostalliv: '',
    chargementDate: '',
    livraisonDate: '',
    codeArticle: '',
    designation: '',
    nombreColis: 0,
    nombrePalettes: 0,
    commentaires: [],
    volume: 0,
    poids: 0,
    statut: "NON_CONFIRME"
  };

  siteOptions = ['BAR', 'SAL', 'BKS', 'SFX', 'TUN', 'GAB', 'GAS', 'BSL', 'JER', 'BIZ', 'NAS'];

  allClients: Client[] = [];
  filteredClients: Client[] = [];
  isClientPickerOpen = false;
  pickerTarget: 'chargement' | 'livraison' = 'livraison';

  allArticles: Article[] = [];
  filteredArticles: Article[] = [];
  isArticlePickerOpen = false;

  optionsCommentaire = {
    typeVoyage: '',
    typeCamion: '',
    typeSemi: '',
    commentaireLibre: ''
  };

  commentaireFinal = '';
  userProfile: any = null;

  constructor(
    private demandeService: DemandeService,
    private clientService: ClientService,
    private articleService: ArticleService,
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {
    addIcons({
      businessOutline, locationOutline, cubeOutline, calendarOutline,
      carOutline, searchOutline, sendOutline, arrowUpCircleOutline, chatbubbleOutline,
      arrowBackOutline, personAddOutline, closeOutline, cloudUploadOutline
    });
  }

  async ngOnInit() {
    this.initDates();
    await this.loadInitialData();
  }

  initDates() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const chargement = new Date(tomorrow);
    chargement.setHours(8, 0, 0, 0);
    const livraison = new Date(tomorrow);
    livraison.setHours(12, 0, 0, 0);

    this.ordre.chargementDate = chargement.toISOString();
    this.ordre.livraisonDate = livraison.toISOString();
  }

  async loadInitialData() {
    try {
      // 1. Get User Profile for Sender Info (Block 1 & 2)
      this.userProfile = await this.authService.getProfile().toPromise();
      if (this.userProfile) {
        this.ordre.nomclient = (this.userProfile.firstname + ' ' + (this.userProfile.lastname || '')).trim();
        this.ordre.client = this.userProfile.email || this.userProfile.codeClient || '';
        this.ordre.siteclient = this.userProfile.site || 'SAL';

        // Auto-populate Block 2 (Chargement)
        this.ordre.codeclientcharg = this.ordre.client;
        this.ordre.chargementNom = this.ordre.nomclient;
        this.ordre.chargementAdr1 = this.userProfile.adresse || '';
        this.ordre.chargementVille = this.userProfile.ville || '';
        this.ordre.codepostalcharg = this.userProfile.codepostal?.toString() || '';
      }

      // 2. Pre-fetch all clients
      this.allClients = await this.clientService.getAll().toPromise() || [];
      this.filteredClients = [...this.allClients];

      // 3. Pre-fetch all articles
      this.allArticles = await this.articleService.getArticles().toPromise() || [];
      this.filteredArticles = [...this.allArticles];

    } catch (e) {
      console.error('Error loading data', e);
    }
  }

  openClientPicker(target: 'chargement' | 'livraison' = 'livraison') {
    this.pickerTarget = target;
    this.filteredClients = [...this.allClients];
    this.isClientPickerOpen = true;
  }

  filterClients(event: any) {
    const val = event.target.value.toLowerCase();
    this.filteredClients = this.allClients.filter(c =>
      (c.nom?.toLowerCase().includes(val) || false) ||
      (c.codeclient?.toLowerCase().includes(val) || false) ||
      (c.ville?.toLowerCase().includes(val) || false)
    );
  }

  selectClient(c: Client) {
    if (this.pickerTarget === 'livraison') {
      this.ordre.codeclientliv = c.codeclient || '';
      this.ordre.livraisonNom = c.nom || '';
      this.ordre.livraisonAdr1 = c.adresse || '';
      this.ordre.livraisonVille = c.ville || '';
      this.ordre.codepostalliv = c.codepostal?.toString() || '';
    } else {
      this.ordre.codeclientcharg = c.codeclient || '';
      this.ordre.chargementNom = c.nom || '';
      this.ordre.chargementAdr1 = c.adresse || '';
      this.ordre.chargementVille = c.ville || '';
      this.ordre.codepostalcharg = c.codepostal?.toString() || '';
    }
    this.isClientPickerOpen = false;
  }

  openArticlePicker() {
    this.filteredArticles = [...this.allArticles];
    this.isArticlePickerOpen = true;
  }

  filterArticles(event: any) {
    const val = event.target.value.toLowerCase();
    this.filteredArticles = this.allArticles.filter(a =>
      a.label.toLowerCase().includes(val) || a.codeArticle.toLowerCase().includes(val)
    );
  }

  selectArticle(a: Article) {
    this.ordre.codeArticle = a.codeArticle || '';
    this.ordre.designation = a.label || '';
    this.isArticlePickerOpen = false;
  }

  updateCommentaire() {
    const parts = [];
    if (this.optionsCommentaire.typeVoyage) {
      parts.push(this.optionsCommentaire.typeVoyage);
    }
    if (this.optionsCommentaire.typeCamion) {
      parts.push(this.optionsCommentaire.typeCamion);
      if (this.optionsCommentaire.typeCamion === 'Semi' && this.optionsCommentaire.typeSemi) {
        parts.push(`(${this.optionsCommentaire.typeSemi})`);
      }
    }
    if (this.optionsCommentaire.commentaireLibre) {
      parts.push(this.optionsCommentaire.commentaireLibre);
    }
    this.commentaireFinal = parts.join(', ');
  }

  async onSubmit() {
    if (!this.ordre.client) {
      await this.showToast('Veuillez renseigner le code client', 'warning');
      return;
    }

    const loading = await this.loadingController.create({ message: 'Création de l\'ordre...' });
    await loading.present();

    try {
      this.updateCommentaire();
      if (this.commentaireFinal) {
        this.ordre.commentaires = [this.commentaireFinal];
      }

      const payload = { ...this.ordre };
      await this.demandeService.createDemande(payload as any).toPromise();
      await loading.dismiss();
      await this.showToast('Ordre créé avec succès!', 'success');
      this.router.navigate(['/demandes/list']);
    } catch (error) {
      await loading.dismiss();
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
