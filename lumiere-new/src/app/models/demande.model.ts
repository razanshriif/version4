// src/app/models/demande.model.ts

export interface Demande {
  id: number;
  numeroReference: string;
  clientId: number;
  dateCreation: Date;
  dateEnlevement: Date;
  dateLivraisonSouhaitee: Date;
  statut: DemandeStatut;
  priorite: Priorite;
  
  // Informations enlèvement
  adresseEnlevement: Adresse;
  contactEnlevement: Contact;
  
  // Informations livraison
  adresseLivraison: Adresse;
  contactLivraison: Contact;
  
  // Marchandise
  marchandise: Marchandise[];
  
  // Détails
  instructions?: string;
  valeurMarchandise?: number;
  assurance?: boolean;
  
  // Validation
  validePar?: number;
  dateValidation?: Date;
  commentaireValidation?: string;
  
  // Camion assigné
  camionId?: number;
}

export enum DemandeStatut {
  BROUILLON = 'BROUILLON',
  EN_ATTENTE = 'EN_ATTENTE',
  VALIDEE = 'VALIDEE',
  REFUSEE = 'REFUSEE',
  EN_COURS = 'EN_COURS',
  LIVREE = 'LIVREE',
  ANNULEE = 'ANNULEE'
}

export enum Priorite {
  NORMALE = 'NORMALE',
  URGENTE = 'URGENTE',
  TRES_URGENTE = 'TRES_URGENTE'
}

export interface Adresse {
  rue: string;
  codePostal: string;
  ville: string;
  pays: string;
  complement?: string;
  latitude?: number;
  longitude?: number;
}

export interface Contact {
  nom: string;
  prenom: string;
  telephone: string;
  email?: string;
}

export interface Marchandise {
  id?: number;
  description: string;
  quantite: number;
  unite: Unite;
  poids: number;
  volume?: number;
  typeColis: TypeColis;
  fragile: boolean;
  dangereux: boolean;
}

export enum Unite {
  PIECE = 'PIECE',
  COLIS = 'COLIS',
  PALETTE = 'PALETTE',
  CONTENEUR = 'CONTENEUR'
}

export enum TypeColis {
  CARTON = 'CARTON',
  PALETTE = 'PALETTE',
  CONTENEUR = 'CONTENEUR',
  VRAC = 'VRAC',
  AUTRE = 'AUTRE'
}

export interface CreateDemandeRequest {
  dateEnlevement: Date;
  dateLivraisonSouhaitee: Date;
  priorite: Priorite;
  adresseEnlevement: Adresse;
  contactEnlevement: Contact;
  adresseLivraison: Adresse;
  contactLivraison: Contact;
  marchandise: Marchandise[];
  instructions?: string;
  valeurMarchandise?: number;
  assurance?: boolean;
}