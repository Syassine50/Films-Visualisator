import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, observable} from 'rxjs';
import {CookieService} from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class PaiementService {
  private apiUrl = 'http://localhost:3001/api/payment/';
  constructor(private http :HttpClient , private cookieService: CookieService) { }

  addPaiement(formData : any ):Observable<any> {
    return this.http.post(`${this.apiUrl}add`,formData);

  }
  getPaiement(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}all`)
  }
  getPaiementById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${id}`);
  }
  updatePaiement(id: string, userData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}update/${id}`, userData);
  }
  deletePaiement(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}delete/${id}`);
  }




  getUserRole(): string {
    return this.cookieService.get('role'); // Lire le rôle depuis un cookie
  }

  isUser(): boolean {
    return this.getUserRole() === 'User';
  }
}

