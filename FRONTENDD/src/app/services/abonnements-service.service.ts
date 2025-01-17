import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, observable} from 'rxjs';
import {CookieService} from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AbonnementsServiceService {
  private apiUrl = 'http://localhost:3001/api/abonnement/';
  constructor(private http :HttpClient , private cookieService: CookieService) { }

  addAbonnement(formData : any ):Observable<any> {
    return this.http.post(`${this.apiUrl}add`,formData);

  }
  getAbonn(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}all`)
  }
  getAbonnById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${id}`);
  }
  updateAbonn(id: string, userData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}update/${id}`, userData);
  }
  deleteAbonn(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}delete/${id}`);
  }




  getUserRole(): string {
    return this.cookieService.get('role'); // Lire le rôle depuis un cookie
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'admin';
  }
}

