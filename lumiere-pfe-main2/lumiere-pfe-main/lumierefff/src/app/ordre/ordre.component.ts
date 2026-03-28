import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrdreService } from '../ordre.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';


@Component({
  selector: 'app-ordre',
  templateUrl: './ordre.component.html',
  styleUrls: ['./ordre.component.css']
})
export class OrdreComponent implements OnInit {
  isModalOpen = false;


  dateDebut: string = '';
dateFin: string = '';
filtreSite: string = '';
filtreStatut: string = "";
statutOptions: string[] = ["PLANIFIE", "NON_PLANIFIE", "EN_COURS_DE_CHARGEMENT", "CHARGE","EN_COURS_DE_LIVRAISON","LIVRE"];
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
  eventCount: number=0;
  filtreClient: any;

  constructor(private modalService: NgbModal, private service: OrdreService, private http: HttpClient) {}

  ngOnInit(): void {
    this.afficher();
    this.autoRefreshPage();
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
      this.ordresFiltres = ordres;
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
  this.ordresFiltres = this.ordres.filter(ordre => {
    const dateOrdre = new Date(ordre.livraisonDate);

    let dateDebutOK: Date | null = null;
    let dateFinOK: Date | null = null;

    // 🔹 Date début → 00:01
    if (this.dateDebut) {
      dateDebutOK = new Date(this.dateDebut);
      dateDebutOK.setHours(0, 1, 0, 0);
    }

    // 🔹 Date fin → 23:59
    if (this.dateFin) {
      dateFinOK = new Date(this.dateFin);
      dateFinOK.setHours(23, 59, 59, 999);
    }

    const debutOK = !dateDebutOK || dateOrdre >= dateDebutOK;
    const finOK = !dateFinOK || dateOrdre <= dateFinOK;

    const clientOK =
      !this.filtreClient ||
      ordre.client?.toLowerCase().includes(this.filtreClient.toLowerCase());

    const siteOK =
      !this.filtreSite ||
      ordre.siteclient === this.filtreSite;

    // 🔵 Nouveau : filtre statut
    const statutOK =
      !this.filtreStatut || ordre.statut === this.filtreStatut;

    // On garde ton exclusion NON_CONFIRME
    return debutOK &&
           finOK &&
           clientOK &&
           siteOK &&
           statutOK &&
           ordre.statut !== 'NON_CONFIRME';
  });
}



resetFiltre() {
  this.dateDebut = "";
  this.dateFin = "";
  this.filtreClient = "";
  this.filtreSite = "";
  this.filtreStatut = "";

  // Réaffiche tous les ordres sauf ceux "NON_CONFIRME"
  this.ordresFiltres = this.ordres.filter(o => o.statut !== 'NON_CONFIRME');
}





exporterExcel() {
  // 🟦 Convertir ordresFiltres en données simples
  const data = this.ordresFiltres.map(o => ({
    "Date Création": o.dateSaisie,
    "Date Livraison Prévue": o.livraisonDate,
    "Numéro d'ordre": o.orderNumber,
    "Client": o.client,
    "Site": o.siteclient,
    "Statut": o.statut,
    "Chauffeur": o.chauffeur,
    "Camion": o.camion,
    "Date Voyage": o.datevoy,
  }));

  /*
  // 🟩 Convertir en sheet Excel
  const worksheet = XLSX.utils.json_to_sheet(data);

  // 🔵 Créer le classeur
  const workbook = {
    Sheets: { 'Ordres Filtrés': worksheet },
    SheetNames: ['Ordres Filtrés'],
  };

  // 🟣 Générer le fichier Excel en tant que Blob
  const excelBuffer = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array'
  });

  // 🔥 Télécharger
  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  });

  saveAs(blob, "ordres_filtres.xlsx");
  */
}


}
