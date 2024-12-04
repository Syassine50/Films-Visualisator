import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import {Observable, tap, throwError} from 'rxjs';

import { catchError } from 'rxjs/operators';

import {Films} from '../models/films.model';

@Injectable({
  providedIn: 'root'
})
export class FilmsService {

  private apiUrlFilm ='http://localhost:3001/api/films'
  private apiUrlFilmcateg ='http://localhost:3001/api/categorie'
  constructor(private http: HttpClient) { }
  addFilm(formData : any ):Observable<any>{
    return this.http.post(`${this.apiUrlFilm}/ajouter` , formData );
  }
  getFilms(): Observable<any> {
    return this.http.get<any>(`${this.apiUrlFilm}/all`).pipe(
      tap(response => console.log('Raw API response:', response)), // Add this debug log
      catchError(error => {
        console.error('API Error:', error);
        return throwError(() => error);
      })
    );
  }
  updateFilm(id: string, formData: FormData) {
    return this.http.put(`/api/films/${id}`, formData);
  }

  getFilmById(id: string) {
    return this.http.get(`/api/films/${id}`);
  }
  getCategories():Observable<any> {
    return this.http.get<any>(`${this.apiUrlFilmcateg}/all`);
  }
  getfilmBycat(categorie : any ):Observable<any>{

    return this.http.get<any>(`${this.apiUrlFilm}/categorie/${categorie}`);
  }
}
