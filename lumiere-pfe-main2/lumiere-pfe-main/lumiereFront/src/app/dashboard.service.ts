import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }

  private baseUrl = 'http://10.221.208.161:8090';
  countArticles(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/articles/count`, { headers: this.getAuthHeaders() });
  }

  countClients(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/clients/count`, { headers: this.getAuthHeaders() });
  }

  countOrders(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/ordres/count`, { headers: this.getAuthHeaders() });
  }
  countNonPlanifieOrders(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/ordres/countNonPlanifie`, { headers: this.getAuthHeaders() });
  }

  countPlanifieOrders(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/ordres/countPlanifie`, { headers: this.getAuthHeaders() });
  }
  countEnCoursDeChargementOrders(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/ordres/count/en-cours-de-chargement`, { headers: this.getAuthHeaders() });
  }

  countChargeOrders(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/ordres/count/charge`, { headers: this.getAuthHeaders() });
  }

  countEnCoursDeLivraisonOrders(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/ordres/count/en-cours-de-livraison`, { headers: this.getAuthHeaders() });
  }

  countLivreOrders(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/ordres/count/livre`, { headers: this.getAuthHeaders() });
  }

  countPendingUsers(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/api/v1/admin/users/count/pending`, { headers: this.getAuthHeaders() });
  }

  private getAuthHeaders() {
    return { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
  }
}
