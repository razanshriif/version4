import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private apiUrl = 'http://10.221.208.161:8090';

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




    return this.http.post<any[]>('http://10.221.208.161:8090/api/notifications', notification, { headers: this.getAuthHeaders() });


  }


  private getAuthHeaders() {
    return { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
  }

  ajouternotification(notification: any) {

    this.ajouter(notification).subscribe((res) => { console.log(res) });
    this.read = false;
    window.location.reload();


  }





}
