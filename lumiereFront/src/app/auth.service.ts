import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {






  private apiUrl = 'http://localhost:8090/api/auth';
  private adminApiUrl = 'http://localhost:8090/api/v1/admin';

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/authenticate`, { email, password });
  }

  register(firstname: string, lastname: string, email: string, password: string, role: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { firstname, lastname, email, password, role });
  }


  profile(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/profile`, { headers: this.getAuthHeaders() });
  }
  private getAuthHeaders() {
    return { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
  }

  isAuthenticated(): boolean {
    // Implement your logic to check if the user is authenticated
    return !!localStorage.getItem('token');
  }

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.adminApiUrl}/users`, { headers: this.getAuthHeaders() });
  }

  updateUserStatus(id: number, status: string): Observable<any> {
    return this.http.put<any>(`${this.adminApiUrl}/users/${id}/status?status=${status}`, {}, { headers: this.getAuthHeaders() });
  }

  logout(): void {
    localStorage.removeItem('token');
  }

}
