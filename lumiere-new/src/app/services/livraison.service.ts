// src/app/services/livraison.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Livraison, Position, Incident } from '../models/livraison.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LivraisonService {
  private readonly API_URL = `${environment.apiUrl}/livraisons`;
  private readonly TRACKING_INTERVAL = 30000; // 30 secondes

  constructor(private http: HttpClient) {}

  /**
   * Obtenir toutes les livraisons du client
   */
  getLivraisons(): Observable<Livraison[]> {
    return this.http.get<Livraison[]>(this.API_URL);
  }

  /**
   * Obtenir une livraison par ID
   */
  getLivraisonById(id: number): Observable<Livraison> {
    return this.http.get<Livraison>(`${this.API_URL}/${id}`);
  }

  /**
   * Obtenir le suivi en temps réel d'une livraison
   */
  getTrackingRealtime(id: number): Observable<Livraison> {
    return interval(this.TRACKING_INTERVAL).pipe(
      switchMap(() => this.http.get<Livraison>(`${this.API_URL}/${id}/tracking`))
    );
  }

  /**
   * Obtenir la position actuelle d'une livraison
   */
  getPosition(id: number): Observable<Position> {
    return this.http.get<Position>(`${this.API_URL}/${id}/position`);
  }

  /**
   * Obtenir l'itinéraire d'une livraison
   */
  getItineraire(id: number): Observable<Position[]> {
    return this.http.get<Position[]>(`${this.API_URL}/${id}/itineraire`);
  }

  /**
   * Obtenir l'historique des positions
   */
  getHistoriquePositions(id: number, dateDebut?: Date, dateFin?: Date): Observable<Position[]> {
    let url = `${this.API_URL}/${id}/historique-positions`;
    const params: any = {};
    
    if (dateDebut) params.dateDebut = dateDebut.toISOString();
    if (dateFin) params.dateFin = dateFin.toISOString();
    
    return this.http.get<Position[]>(url, { params });
  }

  /**
   * Obtenir les incidents d'une livraison
   */
  getIncidents(id: number): Observable<Incident[]> {
    return this.http.get<Incident[]>(`${this.API_URL}/${id}/incidents`);
  }

  /**
   * Signaler un incident
   */
  signalerIncident(livraisonId: number, incident: Partial<Incident>): Observable<Incident> {
    return this.http.post<Incident>(`${this.API_URL}/${livraisonId}/incidents`, incident);
  }

  /**
   * Obtenir la timeline d'une livraison
   */
  getTimeline(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/${id}/timeline`);
  }

  /**
   * Calculer le temps estimé d'arrivée
   */
  getETA(id: number): Observable<any> {
    return this.http.get(`${this.API_URL}/${id}/eta`);
  }

  /**
   * Obtenir les livraisons en cours
   */
  getLivraisonsEnCours(): Observable<Livraison[]> {
    return this.http.get<Livraison[]>(`${this.API_URL}/en-cours`);
  }

  /**
   * Obtenir les livraisons terminées
   */
  getLivraisonsTerminees(page: number = 0, size: number = 20): Observable<any> {
    return this.http.get(`${this.API_URL}/terminees`, {
      params: { page: page.toString(), size: size.toString() }
    });
  }

  /**
   * Évaluer une livraison
   */
  evaluerLivraison(id: number, note: number, commentaire?: string): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/${id}/evaluation`, {
      note,
      commentaire
    });
  }

  /**
   * Obtenir le bon de livraison (PDF)
   */
  getBonLivraison(id: number): Observable<Blob> {
    return this.http.get(`${this.API_URL}/${id}/bon-livraison`, {
      responseType: 'blob'
    });
  }

  /**
   * Confirmer la réception de la livraison
   */
  confirmerReception(id: number, signature?: string, photos?: string[]): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/${id}/confirmer-reception`, {
      signature,
      photos
    });
  }
}