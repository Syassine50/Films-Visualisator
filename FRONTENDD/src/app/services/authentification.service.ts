import { Injectable } from '@angular/core';

import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Observable, tap, throwError} from 'rxjs';

import { catchError } from 'rxjs/operators';

import { User } from '../models/user.model';
import {CookieService} from 'ngx-cookie-service';



@Injectable({

  providedIn: 'root'

})

export class AuthentificationService {
  private apiUrl = 'http://localhost:3001/api/users';



  constructor(private http: HttpClient ,
              private cookieService: CookieService) { }



  registerUser(userData: any): Observable<any> {

    return this.http.post('http://localhost:3001/api/users/register', userData, {

      headers: {

        'Content-Type': 'application/json'

      }

    });



  }

  loginUser(email: string, password: string): Observable<any> {
    const url = 'http://localhost:3001/api/users/login-user';
    const body = { email, password };

    return this.http.post<any>(url, body).pipe(
      catchError((error) => {
        console.error('Error during login:', error);
        return throwError('Login failed. Please try again.');
      }),
      tap(response => {
        console.log('API Response:', response); // Log pour vérifier la réponse ici
      })
    );
  }

  getUsers(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/all`);
  }
  getUserById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
  updateUser(id: string, userData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, userData);
  }
  deleteUser(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.cookieService.get('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Method to validate if token is present and valid
  isTokenValid(token: string): boolean {
    // Placeholder validation logic (e.g., expiration check)
    return !!token;
  }

  // Centralized error handling
  private handleError(error: any): Observable<never> {
    console.error('API error occurred:', error);
    return throwError('An error occurred; please try again.');
  }
  getUserRole(): string {
    return this.cookieService.get('role'); // Lire le rôle depuis un cookie
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'admin';
  }
}
