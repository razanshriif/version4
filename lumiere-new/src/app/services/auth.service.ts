
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginRequest, RegisterRequest, AuthResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) { }

  // 🔐 LOGIN
  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/authenticate`, data)
      .pipe(
        tap(res => {
          localStorage.setItem('token', res.token);
        })
      );
  }

  // 📝 REGISTER — account starts as PENDING, no token is returned
  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data);
  }

  // 👤 GET PROFILE (JWT required)
  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile`, {
      headers: this.getAuthHeaders()
    });
  }

  // ✏️ UPDATE PROFILE
  updateProfile(data: RegisterRequest): Observable<any> {
    return this.http.put(`${this.apiUrl}/update`, data, {
      headers: this.getAuthHeaders()
    });
  }

  // 📦 GET ALL USERS
  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/profileALL`, {
      headers: this.getAuthHeaders()
    });
  }

  // 🚪 LOGOUT
  logout(): void {
    localStorage.removeItem('token');
  }

  // 🔍 CHECK ACCOUNT STATUS (public — no token needed)
  checkAccountStatus(email: string): Observable<{ status: string; email: string }> {
    // environment.apiUrl = 'http://HOST:PORT/api'
    // admin status endpoint is at /api/v1/admin/status
    const base = environment.apiUrl.replace('/api', '');
    return this.http.get<{ status: string; email: string }>(
      `${base}/api/v1/admin/status?email=${encodeURIComponent(email)}`
    );
  }

  // 🔑 TOKEN
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // 🔐 Headers
  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`
    });
  }
}
