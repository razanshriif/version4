// src/app/models/notification.model.ts

export interface Notification {
  id: number;
  userId: number;
  titre: string;
  message: string;
  type: NotificationType;
  priorite: NotificationPriorite;
  dateCreation: Date;
  dateExpiration?: Date;
  lue: boolean;
  dateLecture?: Date;
  
  // Données associées
  demandeId?: number;
  livraisonId?: number;
  incidentId?: number;
  
  // Actions
  actionUrl?: string;
  actionLabel?: string;
}

export enum NotificationType {
  INFO = 'INFO',
  DEMANDE = 'DEMANDE',
  LIVRAISON = 'LIVRAISON',
  INCIDENT = 'INCIDENT',
  SYSTEME = 'SYSTEME',
  MARKETING = 'MARKETING'
}

export enum NotificationPriorite {
  BASSE = 'BASSE',
  NORMALE = 'NORMALE',
  HAUTE = 'HAUTE',
  URGENTE = 'URGENTE'
}

export interface NotificationSettings {
  userId: number;
  pushEnabled: boolean;
  emailEnabled: boolean;
  smsEnabled: boolean;
  
  // Préférences par type
  demandes: boolean;
  livraisons: boolean;
  incidents: boolean;
  marketing: boolean;
  
  // Horaires
  heureDebut?: string;
  heureFin?: string;
}