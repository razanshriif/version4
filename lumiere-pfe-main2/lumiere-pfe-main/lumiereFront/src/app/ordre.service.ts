import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdreService {

  constructor(private http: HttpClient) { }

  afficher(): Observable<any[]> {
    return this.http.get<any[]>('http://10.221.208.161:8090/api/ordres', { headers: this.getAuthHeaders() });
  }
  ajouter(depence: any): Observable<any[]> {
    return this.http.post<any[]>('http://10.221.208.161:8090/api/ordres', depence, { headers: this.getAuthHeaders() });
  }



  sendEmail(emailRequest: any): Observable<string> {
    return this.http.post<string>('http://172.18.3.125:8090/api/email/send', emailRequest, { headers: this.getAuthHeaders() });
  }



  supprimer(id: number): Observable<any> {
    return this.http.delete<any>(`http://10.221.208.161:8090/api/ordres/${id}`, { headers: this.getAuthHeaders() });
  }


  confirmer(id: number): Observable<void> {
    return this.http.put<any>(`http://10.221.208.161:8090/api/ordres/confirmer/${id}`, {}, { headers: this.getAuthHeaders() });
  }


  afficheremail(id: any): Observable<any> {
    return this.http.get<any>('http://10.221.208.161:8090/api/clients/email/${id}', { headers: this.getAuthHeaders() });

  }
  private apiUrl = 'http://10.221.208.161:8090/api/ordres';
  private baseUrl = 'http://10.221.208.161:8090/api/clients';



  getEmail(clientId: number): Observable<string> {
    const url = `${this.baseUrl}/email/${clientId}`;
    const headers = this.getAuthHeaders();
    return this.http.get<string>(url, { headers, responseType: 'text' as 'json' });
  }

  gettelephone(clientId: number): Observable<string> {
    const url = `${this.baseUrl}/telephone/${clientId}`;
    const headers = this.getAuthHeaders();
    return this.http.get<string>(url, { headers, responseType: 'text' as 'json' });
  }

  private smsUrl = 'http://172.18.3.65:28500/SMS_SEND';
  sendSms(mobile: string, message: string): Observable<any> {
    console.log(mobile)
    const url = `${this.smsUrl}?tel=${encodeURIComponent(mobile)}&msg=${encodeURIComponent(message)}`;
    console.log(url)
    return this.http.get(url);
  }


  detail: any;

  private ordersUrl = 'assets/mesvoyes.json';
  getOrders(): Observable<any[]> {
    return this.http.get<any[]>(this.ordersUrl);
  }


  private getAuthHeaders() {
    return { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
  }

}
