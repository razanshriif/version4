import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private apiUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }


  notification: any = {

    "type": "",
    "message": "",
    "isRead": false


  };

  read: boolean = true;
  afficher(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api`, { headers: this.getAuthHeaders() });
  }
  ajouter(notification: any): Observable<any[]> {
    return this.http.post<any[]>(`${environment.apiUrl}/notifications`, notification, { headers: this.getAuthHeaders() });
  }


  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders(token ? { 'Authorization': `Bearer ${token}` } : {});
  }

  ajouternotification(notification: any) {

    this.ajouter(notification).subscribe((res) => { console.log(res) });
    this.read = false;
    window.location.reload();


  }




}
