import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Ordre } from '../models/ordre.model';

@Injectable({
    providedIn: 'root'
})
export class OrdreService {

    private api = `${environment.apiUrl}/ordres`;

    constructor(private http: HttpClient) { }

    private authHeaders() {
        return {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        };
    }

    ajouter(ordre: Ordre): Observable<Ordre> {
        return this.http.post<Ordre>(this.api, ordre, this.authHeaders());
    }

    getAll(): Observable<Ordre[]> {
        return this.http.get<Ordre[]>(this.api, this.authHeaders());
    }

    getById(id: number): Observable<Ordre> {
        return this.http.get<Ordre>(`${this.api}/${id}`, this.authHeaders());
    }
}
