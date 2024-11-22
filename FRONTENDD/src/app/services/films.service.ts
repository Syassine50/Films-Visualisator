import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import {Observable, tap, throwError} from 'rxjs';

import { catchError } from 'rxjs/operators';

import {Films} from '../models/films.model';

@Injectable({
  providedIn: 'root'
})
export class FilmsService {

  private apiUrl ='http://localhost:3001/api/films'
  constructor(private http: HttpClient) { }
  addFilm(formData : any ):Observable<any>{
    return this.http.post(`${this.apiUrl}/ajouter` , formData );
  }
  getFilms(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/all`).pipe(
      tap(response => console.log('Raw API response:', response)), // Add this debug log
      catchError(error => {
        console.error('API Error:', error);
        return throwError(() => error);
      })
    );
  }
}
