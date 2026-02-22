// src/app/services/demande.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Demande, CreateDemandeRequest, DemandeStatut } from '../models/demande.model';
import { environment } from '../../environments/environment';

export interface DemandeFilter {
  statut?: DemandeStatut;
  dateDebut?: Date;
  dateFin?: Date;
  search?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

@Injectable({
  providedIn: 'root'
})
export class DemandeService {
  private readonly API_URL = `${environment.apiUrl}/ordres`;

  constructor(private http: HttpClient) { }

  /**
   * Obtenir toutes les demandes avec filtres
   */
  getDemandes(filter?: DemandeFilter): Observable<PagedResponse<Demande>> {
    let params = new HttpParams();

    if (filter) {
      if (filter.statut) params = params.set('statut', filter.statut);
      if (filter.dateDebut) params = params.set('dateDebut', filter.dateDebut.toISOString());
      if (filter.dateFin) params = params.set('dateFin', filter.dateFin.toISOString());
      if (filter.search) params = params.set('search', filter.search);
      if (filter.page !== undefined) params = params.set('page', filter.page.toString());
      if (filter.size !== undefined) params = params.set('size', filter.size.toString());
      if (filter.sortBy) params = params.set('sortBy', filter.sortBy);
      if (filter.sortOrder) params = params.set('sortOrder', filter.sortOrder);
    }

    return this.http.get<PagedResponse<Demande>>(this.API_URL, { params });
  }

  /**
   * Obtenir une demande par ID
   */
  getDemandeById(id: number): Observable<Demande> {
    return this.http.get<Demande>(`${this.API_URL}/${id}`);
  }

  /**
   * Créer une nouvelle demande
   */
  createDemande(demande: CreateDemandeRequest): Observable<Demande> {
    return this.http.post<Demande>(this.API_URL, demande);
  }

  /**
   * Mettre à jour une demande
   */
  updateDemande(id: number, demande: Partial<Demande>): Observable<Demande> {
    return this.http.put<Demande>(`${this.API_URL}/${id}`, demande);
  }

  /**
   * Annuler une demande
   */
  annulerDemande(id: number, motif?: string): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/${id}/annuler`, { motif });
  }

  /**
   * Obtenir les statistiques des demandes
   */
  getStatistiques(): Observable<any> {
    return this.http.get(`${this.API_URL}/statistiques`);
  }

  /**
   * Obtenir l'historique d'une demande
   */
  getHistorique(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/${id}/historique`);
  }

  /**
   * Télécharger un document lié à une demande
   */
  downloadDocument(demandeId: number, documentId: number): Observable<Blob> {
    return this.http.get(`${this.API_URL}/${demandeId}/documents/${documentId}`, {
      responseType: 'blob'
    });
  }

  /**
   * Uploader un document pour une demande
   */
  uploadDocument(demandeId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.API_URL}/${demandeId}/documents`, formData);
  }

  /**
   * Obtenir le devis pour une demande
   */
  getDevis(id: number): Observable<any> {
    return this.http.get(`${this.API_URL}/${id}/devis`);
  }

  /**
   * Accepter un devis
   */
  accepterDevis(id: number): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/${id}/devis/accepter`, {});
  }

  /**
   * Refuser un devis
   */
  refuserDevis(id: number, motif: string): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/${id}/devis/refuser`, { motif });
  }
  /**
   * Confirmer une demande
   */
  confirmerDemande(id: number): Observable<Demande> {
    return this.http.put<Demande>(`${this.API_URL}/${id}/confirmer`, {});
  }

  /**
   * Dupliquer une demande
   */
  dupliquerDemande(id: number): Observable<Demande> {
    return this.http.post<Demande>(`${this.API_URL}/${id}/dupliquer`, {});
  }

  /**
   * Supprimer une demande
   */
  deleteDemande(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}