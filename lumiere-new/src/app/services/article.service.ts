import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Article } from '../models/article.model';

@Injectable({
    providedIn: 'root'
})
export class ArticleService {

    private api = `${environment.apiUrl}/articles`;

    constructor(private http: HttpClient) { }

    private authHeaders() {
        return {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        };
    }

    getArticles(): Observable<Article[]> {
        return this.http.get<Article[]>(this.api, this.authHeaders());
    }

    getArticle(id: number): Observable<Article> {
        return this.http.get<Article>(`${this.api}/${id}`, this.authHeaders());
    }

    searchByCodeArticle(codeArticle: string): Observable<Article> {
        return this.http.get<Article>(`${this.api}/search?codeArticle=${codeArticle}`, this.authHeaders());
    }
}
