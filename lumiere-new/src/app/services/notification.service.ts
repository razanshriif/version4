// src/app/services/notification.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PushNotifications, Token } from '@capacitor/push-notifications';
import { Notification, NotificationSettings } from '../models/notification.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly API_URL = `${environment.apiUrl}/notifications`;
  
  private unreadCountSubject = new BehaviorSubject<number>(0);
  public unreadCount$ = this.unreadCountSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initPushNotifications();
    this.loadUnreadCount();
  }

  /**
   * Initialiser les push notifications
   */
  private async initPushNotifications() {
    // Demander la permission
    const permission = await PushNotifications.requestPermissions();
    
    if (permission.receive === 'granted') {
      await PushNotifications.register();
    }

    // Gérer la réception du token
    PushNotifications.addListener('registration', (token: Token) => {
      this.registerDeviceToken(token.value).subscribe();
    });

    // Gérer les erreurs
    PushNotifications.addListener('registrationError', (error: any) => {
      console.error('Push notification registration error:', error);
    });

    // Gérer la réception de notifications
    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      this.handleNotificationReceived(notification);
    });

    // Gérer le clic sur une notification
    PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
      this.handleNotificationAction(action);
    });
  }

  /**
   * Obtenir toutes les notifications
   */
  getNotifications(page: number = 0, size: number = 20): Observable<any> {
    return this.http.get(`${this.API_URL}`, {
      params: { page: page.toString(), size: size.toString() }
    });
  }

  /**
   * Obtenir les notifications non lues
   */
  getUnreadNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.API_URL}/unread`);
  }

  /**
   * Marquer une notification comme lue
   */
  markAsRead(id: number): Observable<void> {
    return this.http.put<void>(`${this.API_URL}/${id}/read`, {})
      .pipe(tap(() => this.updateUnreadCount()));
  }

  /**
   * Marquer toutes les notifications comme lues
   */
  markAllAsRead(): Observable<void> {
    return this.http.put<void>(`${this.API_URL}/read-all`, {})
      .pipe(tap(() => this.unreadCountSubject.next(0)));
  }

  /**
   * Supprimer une notification
   */
  deleteNotification(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`)
      .pipe(tap(() => this.updateUnreadCount()));
  }

  /**
   * Supprimer toutes les notifications lues
   */
  deleteAllRead(): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/read`);
  }

  /**
   * Obtenir le nombre de notifications non lues
   */
  getUnreadCount(): Observable<number> {
    return this.http.get<number>(`${this.API_URL}/unread/count`);
  }

  /**
   * Charger le nombre de notifications non lues
   */
  private loadUnreadCount() {
    this.getUnreadCount().subscribe(
      count => this.unreadCountSubject.next(count),
      error => console.error('Error loading unread count:', error)
    );
  }

  /**
   * Mettre à jour le compteur de notifications non lues
   */
  private updateUnreadCount() {
    this.loadUnreadCount();
  }

  /**
   * Obtenir les paramètres de notification
   */
  getSettings(): Observable<NotificationSettings> {
    return this.http.get<NotificationSettings>(`${this.API_URL}/settings`);
  }

  /**
   * Mettre à jour les paramètres de notification
   */
  updateSettings(settings: Partial<NotificationSettings>): Observable<NotificationSettings> {
    return this.http.put<NotificationSettings>(`${this.API_URL}/settings`, settings);
  }

  /**
   * Enregistrer le token du device
   */
  private registerDeviceToken(token: string): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/device-token`, { token });
  }

  /**
   * Gérer la réception d'une notification
   */
  private handleNotificationReceived(notification: any) {
    console.log('Notification received:', notification);
    this.updateUnreadCount();
  }

  /**
   * Gérer l'action sur une notification
   */
  private handleNotificationAction(action: any) {
    console.log('Notification action:', action);
    
    // Extraire les données de la notification
    const data = action.notification.data;
    
    // Navigation basée sur le type de notification
    if (data.type === 'DEMANDE' && data.demandeId) {
      // Naviguer vers les détails de la demande
      // this.router.navigate(['/demandes', data.demandeId]);
    } else if (data.type === 'LIVRAISON' && data.livraisonId) {
      // Naviguer vers le tracking
      // this.router.navigate(['/livraisons', data.livraisonId, 'tracking']);
    }
  }

  /**
   * Tester l'envoi d'une notification
   */
  testNotification(): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/test`, {});
  }
}