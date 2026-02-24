import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private http: HttpClient) { }

  afficher(): Observable<any[]> {
    return this.http.get<any[]>('http://10.221.208.161:8090/clients', { headers: this.getAuthHeaders() });
  }
  ajouter(depence: any): Observable<any[]> {
    return this.http.post<any[]>('http://10.221.208.161:8090/clients', depence, { headers: this.getAuthHeaders() });
  }

  supprimer(id: number): Observable<any> {
    return this.http.delete<any>(`http://10.221.208.161:8090/clients/${id}`, { headers: this.getAuthHeaders() });



  }


  getClientDetails(clientCode: string): Observable<any> {
    const url = `http://10.221.208.161:8090/clients/code/${clientCode}`;
    const headers = this.getAuthHeaders();
    return this.http.get<any>(url, { headers });
  }

  private getAuthHeaders() {
    return { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
  }



}
