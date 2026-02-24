import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientServiceService {
  constructor(private http: HttpClient) {}
  getClients(): Observable<any[]> {
    return this.http.get<any[]>('http://10.221.208.161:8090/clients');
  }
  
  addClient(client: any): Observable<any> {
    return this.http.post<any>('http://10.221.208.161:8090/clients', client);
  }
  
  deleteClient(code: number): Observable<void> {
    return this.http.delete<void>(`${'http://10.221.208.161:8090/clients'}/${code}`);
  }

  
  
}
