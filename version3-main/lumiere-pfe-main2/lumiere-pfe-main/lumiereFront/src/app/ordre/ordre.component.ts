import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrdreService } from '../ordre.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-ordre',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    NgbModule
  ],
  templateUrl: './ordre.component.html',
  styleUrls: ['./ordre.component.css']
})
export class OrdreComponent implements OnInit {
  isModalOpen = false;


  dateDebut: string = this.getTodayDate();
  dateFin: string = this.getTodayDate();
  filtreClient: any;
  filtreSite: string = '';
  filtreStatut: string = "";
  filtreChauffeur: string = "";
  filtreDestination: string = "";
  statutOptions: string[] = ["PLANIFIE", "NON_PLANIFIE", "EN_COURS_DE_CHARGEMENT", "CHARGE", "EN_COURS_DE_LIVRAISON", "LIVRE"];
  siteOptions: string[] = [
    'BAR', 'SAL', 'BKS', 'SFX', 'TUN',
    'GAB', 'GAS', 'BSL', 'JER', 'BIZ', 'NAS'
  ];

  email = {
    to: "",
    subject: "",
    body: ""
  };

  sms = {
    mobile: '',
    message: ''
  };
  ordresFiltres: any[] = [];
  ordres: any[] = [];
  ordresPlanifies: any[] = [];
  // Define statutMap as a class property
  statutMap: { [key: string]: number } = {
    'PLANIFIE': 0,
    'Départ': 0,
    'Chargement': 1,
    'Chargé': 2,
    'Livraison': 3,
    'Livré': 4,
    'Fin': 5
  };
  eventCount: number = 0;

  constructor(private modalService: NgbModal, private service: OrdreService, private http: HttpClient) { }

  ngOnInit(): void {
    this.filtrerParDate();
    this.autoRefreshPage();
  }

  private getTodayDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  openModal() {
    console.log('open')
    this.isModalOpen = true;
  }

  closeModal(event?: MouseEvent) {
    this.isModalOpen = false;
  }

  onSubmit() {
    this.service.sendEmail(this.email).subscribe(
      response => {
        console.log('Email envoyé avec succès', response);
      },
      error => {
        console.error('Error sending email', error);
      }
    );
    this.closeModal();
  }

  getEmail(clientId: number): void {
    console.log('get email')
    this.service.getEmail(clientId).subscribe(
      response => {
        this.email.to = response;
      },
      error => {
        console.error('Error fetching email:', error);
      }
    );
  }

  getTelephone(clientId: number): Observable<string> {
    return this.service.gettelephone(clientId);
  }

  sendSms(clientId: number, ordre: any) {
    this.getTelephone(clientId).subscribe(
      (telephone: string) => {
        this.sms.mobile = telephone;
        this.sms.message = `Bonjour, votre voyage est : ${ordre.statut}`;

        this.service.sendSms(this.sms.mobile, this.sms.message).subscribe(
          response => {
            console.log('SMS envoyé avec succès', response);
          },
          error => {
            console.error("Erreur lors de l'envoi du SMS", error);
          }
        );
      },
      error => {
        console.error("Erreur lors de la récupération du téléphone", error);
      }
    );
  }


  afficher() {
    this.service.afficher().subscribe(ordres => {
      this.ordres = ordres;
      this.ordresFiltres = this.ordres;
      this.sortEvents();
    });
  }

  detail(ordre: any) {
    this.service.detail = ordre;
    console.log(this.service.detail);
  }

  sortEvents() {
    for (let ordre of this.ordres) {
      if (ordre.events) {
        ordre.events.sort((a: string, b: string) => a.localeCompare(b, 'fr', { sensitivity: 'base' }));
      }
    }
  }


  getTimelineClass(index: number, events: any[], statut: string): string {
    this.eventCount = 0;
    if (events != null) {
      this.eventCount = events.filter(event => event !== null && event !== undefined).length;
    }

    if (statut === 'PLANIFIE') {
      return index === 0 ? 'pending' : 'inactive';
    }
    else if (this.eventCount === 6) {
      // Tous les steps sont completed
      return 'completed';
    }
    else if (this.eventCount >= 2 && this.eventCount <= 6) {
      if (index < this.eventCount - 1) return 'completed';
      if (index === this.eventCount - 1) return 'pending';
      return 'inactive';
    }

    return '';
  }


  autoRefreshPage(): void {
    setInterval(() => {
      this.ordres.forEach(ordre => {
        if (ordre.statut === 'Fin' && !ordre.events[5]) {
          ordre.events[5] = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        }
      });
    }, 3 * 60 * 1000); // 3 minutes
  }


  filtrerParDate() {
    const params = {
      client: this.filtreClient,
      statut: this.filtreStatut,
      startDate: this.dateDebut,
      endDate: this.dateFin,
      site: this.filtreSite,
      chauffeur: this.filtreChauffeur,
      destination: this.filtreDestination
    };

    this.service.search(params).subscribe(ordres => {
      // On garde l'exclusion des NON_CONFIRME côté front si besoin, 
      // ou on laisse le backend tout renvoyer.
      this.ordresFiltres = ordres.filter(o => o.statut !== 'NON_CONFIRME');
    });
  }



  resetFiltre() {
    this.dateDebut = this.getTodayDate();
    this.dateFin = this.getTodayDate();
    this.filtreClient = "";
    this.filtreSite = "";
    this.filtreStatut = "";
    this.filtreChauffeur = "";
    this.filtreDestination = "";

    this.filtrerParDate();
  }


  exporterExcel() {
    const headers = [
      'dateSaisie', 'livraisonDate', 'orderNumber', 'client', 'siteclient',
      'statut', 'chauffeur', 'camion', 'datevoy'
    ];

    const filename = `suivi_ordres_${new Date().getTime()}.csv`;
    this.service.exportToCsv(this.ordresFiltres, filename, headers);
  }



}
