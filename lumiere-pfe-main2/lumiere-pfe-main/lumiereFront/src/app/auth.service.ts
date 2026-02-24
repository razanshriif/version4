import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {






  private apiUrl = 'http://10.221.208.161:8090/api/v1/auth';
  private demoApiUrl = 'http://10.221.208.161:8090/api/v1/demo';

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
    return this.http.get<any[]>(`http://10.221.208.161:8090/api/v1/admin/users`, { headers: this.getAuthHeaders() });
  }

  updateUserStatus(id: number, status: string): Observable<any> {
    return this.http.put<any>(`http://10.221.208.161:8090/api/v1/admin/users/${id}/status?status=${status}`, {}, { headers: this.getAuthHeaders() });
  }

  logout(): void {
    localStorage.removeItem('token');
  }

}
