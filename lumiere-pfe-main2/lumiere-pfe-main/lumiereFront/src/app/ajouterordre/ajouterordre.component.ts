import { Component, OnInit } from '@angular/core';
import { OrdreService } from '../ordre.service';

@Component({
  selector: 'app-ajouterordre',
  templateUrl: './ajouterordre.component.html',
  styleUrl: './ajouterordre.component.css'
})
export class AjouterordreComponent implements OnInit {


constructor(private service : OrdreService){};


ordre= {
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
  dateSaisie: "",
  statut: "NON_CONFIRME",
  commentaires: []
}
 
  ordres:any[]=[];
  ordrenconf:any[]=[];
  ngOnInit(): void {
    this.afficher();
    console.log(this.ordres)
    
  } 
  
  // Méthode pour afficher ou masquer le formulaire d'ajout de tâche
  
  afficher() {
    this.service.afficher().subscribe(ordres => {this.ordres = ordres;

      for(let i of ordres){

        if(i.statut=='NON_CONFIRME'){
           this.ordrenconf.push(i);

        }
      }
     
    });
   
  }
  ajouter() {
    this.service.ajouter(this.ordre).subscribe((res) => {
      console.log(res);
     
    });}
  isModalOpen = false;



  consulter(i:any){

    this.ordre=i;
    this.openModal();
  }
  openModal() {
    this.isModalOpen = true;

  }

  closeModal(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.isModalOpen = false;
  }

  onSubmit() {
    // Handle form submission, e.g., save the ordre object

    this.ajouter();
    console.log('Ordre saved:', this.ordre);
    this.closeModal();
  }


confirmer(i:any){

  this.service.confirmer(i).subscribe((res)=>{
    window.location.reload();
  });
} supprimer(id: number): void {
  this.service.supprimer(id).subscribe(
    response => {
      console.log('Ordre supprimé avec succès!', response);
      window.location.reload();

      // Rediriger ou rafraîchir la liste après suppression
      // Remplacez cette ligne selon vos besoins
    },
    error => {
      console.error('Erreur lors de la suppression de l\'ordre', error);
    }
  );
}

dupliquerOrdre(ordre: any): void {
  const nouvelOrdre = { ...ordre }; // Crée une copie de l'ordre
  nouvelOrdre.id = 0; // Réinitialise l'ID pour que le backend en génère un nouveau
  
  this.service.ajouter(nouvelOrdre).subscribe(
    response => {
      console.log('Ordre dupliqué avec succès!', response);
      this.afficher(); // Rafraîchir la liste des ordres
      window.location.reload();

    },
    error => {
      console.error('Erreur lors de la duplication de l\'ordre', error);
    }
  );
}

}
