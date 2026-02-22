import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton,
    IonButton, IonIcon, IonItem, IonLabel, IonInput, IonDatetime,
    IonDatetimeButton, IonModal, IonSegment, IonSegmentButton, IonSelect,
    IonSelectOption, IonList, IonSearchbar, IonNote,
    ToastController, LoadingController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
    businessOutline, locationOutline, cubeOutline, calendarOutline,
    carOutline, searchOutline, sendOutline, arrowUpCircleOutline, chatbubbleOutline
} from 'ionicons/icons';
import { AuthService } from '../../../services/auth.service';
import { ClientService } from '../../../services/client.service';
import { ArticleService } from '../../../services/article.service';
import { OrdreService } from '../../../services/ordre.service';
import { Ordre } from '../../../models/ordre.model';
import { Client } from '../../../models/client.model';
import { Article } from '../../../models/article.model';
import { Router } from '@angular/router';

@Component({
    selector: 'app-non-planned',
    templateUrl: './non-planned.page.html',
    styleUrls: ['./non-planned.page.scss'],
    standalone: true,
    imports: [
        CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent,
        IonButtons, IonBackButton, IonButton, IonIcon, IonItem, IonLabel,
        IonInput, IonDatetime, IonDatetimeButton, IonModal, IonSegment,
        IonSegmentButton, IonSelect, IonSelectOption, IonList, IonSearchbar, IonNote
    ]
})
export class NonPlannedPage implements OnInit {

    ordre: Ordre = {
        client: '',
        nomclient: '',
        siteclient: '',
        codeclientliv: '',
        livraisonNom: '',
        livraisonAdr1: '',
        livraisonVille: '',
        codepostalliv: '',
        codepostalcharg: '',
        livraisonDate: '',
        chargementDate: '',
        codeArticle: '',
        designation: '',
        nombreColis: 0,
        nombrePalettes: 0,
        commentaires: [],
        volume: 0,
        poids: 0
    };

    siteOptions = ['BAR', 'SAL', 'BKS', 'SFX', 'TUN', 'GAB', 'GAS', 'BSL', 'JER', 'BIZ', 'NAS'];

    myClient: Client | null = null;
    userProfile: any = null;
    selectedDestinataire: Client | null = null;
    selectedArticle: Article | null = null;

    allClients: Client[] = [];
    filteredClients: Client[] = [];
    isClientPickerOpen = false;
    pickerTarget: 'chargement' | 'livraison' = 'livraison';

    allArticles: Article[] = [];
    filteredArticles: Article[] = [];
    isArticlePickerOpen = false;

    optionsCommentaire = {
        typeVoyage: 'Dédié',
        typeCamion: 'Cargo',
        typeSemi: '',
        commentaireLibre: ''
    };

    commentaireFinal = '';

    constructor(
        private authService: AuthService,
        private clientService: ClientService,
        private articleService: ArticleService,
        private ordreService: OrdreService,
        private toastCtrl: ToastController,
        private loadingCtrl: LoadingController,
        private router: Router
    ) {
        addIcons({
            businessOutline, locationOutline, cubeOutline, calendarOutline,
            carOutline, searchOutline, sendOutline, arrowUpCircleOutline, chatbubbleOutline
        });
    }

    async ngOnInit() {
        this.initDates();
        await this.loadInitialData();
    }

    initDates() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Default 08:00
        const chargement = new Date(tomorrow);
        chargement.setHours(8, 0, 0, 0);

        // Default 12:00
        const livraison = new Date(tomorrow);
        livraison.setHours(12, 0, 0, 0);

        this.ordre.chargementDate = chargement.toISOString();
        this.ordre.livraisonDate = livraison.toISOString();
    }

    async loadInitialData() {
        // Removed auto-configuration loading message as requested

        try {
            // 1. Get User Profile for Sender Info
            this.userProfile = await this.authService.getProfile().toPromise();
            if (this.userProfile) {
                this.ordre.nomclient = (this.userProfile.firstname + ' ' + (this.userProfile.lastname || '')).trim();
                this.ordre.client = this.userProfile.email || ''; // Using email or identifying field
                this.ordre.siteclient = 'SAL'; // Default or from profile if available

                if (!this.ordre.chargementNom) {
                    this.ordre.chargementNom = this.ordre.nomclient;
                }
            }

            // 2. Pre-fetch all clients for the pickers
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
            this.selectedDestinataire = c;
            this.ordre.codeclientliv = c.codeclient || '';
            this.ordre.livraisonNom = c.nom || '';
            this.ordre.livraisonAdr1 = c.adresse || '';
            this.ordre.livraisonVille = c.ville || '';
            this.ordre.codepostalliv = c.codepostal?.toString() || '';
            this.ordre.livraisonAdr2 = '';
        } else {
            this.ordre.codeclientcharg = c.codeclient || '';
            this.ordre.chargementNom = c.nom || '';
            this.ordre.chargementAdr1 = c.adresse || '';
            this.ordre.chargementVille = c.ville || '';
            this.ordre.codepostalcharg = c.codepostal?.toString() || '';
            this.ordre.chargementAdr2 = '';
        }
        this.isClientPickerOpen = false;
    }

    openArticlePicker() {
        this.isArticlePickerOpen = true;
    }

    filterArticles(event: any) {
        const val = event.target.value.toLowerCase();
        this.filteredArticles = this.allArticles.filter(a =>
            a.label.toLowerCase().includes(val) || a.codeArticle.toLowerCase().includes(val)
        );
    }

    selectArticle(a: Article) {
        this.selectedArticle = a;
        this.ordre.codeArticle = a.codeArticle || '';
        this.ordre.designation = a.label || '';
        this.isArticlePickerOpen = false;
    }

    isFormValid() {
        return this.ordre.client &&
            this.ordre.siteclient &&
            this.ordre.codeclientliv &&
            this.ordre.codeArticle &&
            this.ordre.nombrePalettes > 0 &&
            this.ordre.livraisonVille &&
            this.ordre.chargementVille &&
            this.ordre.codepostalliv;
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

    async submit() {
        const loading = await this.loadingCtrl.create({ message: 'Création de l\'ordre...' });
        await loading.present();

        // Use current built comment
        this.updateCommentaire();
        if (this.commentaireFinal) {
            this.ordre.commentaires = [this.commentaireFinal];
        }

        this.ordreService.ajouter(this.ordre).subscribe({
            next: async (res) => {
                loading.dismiss();
                const toast = await this.toastCtrl.create({
                    message: 'Ordre créé avec succès !',
                    color: 'success',
                    duration: 3000
                });
                toast.present();
                this.router.navigate(['/home']);
            },
            error: (err) => {
                loading.dismiss();
                console.error(err);
            }
        });
    }
}
