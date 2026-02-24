import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {




  private apiUrl = 'http://10.221.208.161:8090/api/users'; // URL de l'API des clients

  constructor(private http: HttpClient) { }

  getClients(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  supprimer(id: number): Observable<any> {
    return this.http.delete<any>(`http://10.221.208.161:8090/api/users/${id}`, { headers: this.getAuthHeaders() });



  }

  private getAuthHeaders() {
    return { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
  }
}
