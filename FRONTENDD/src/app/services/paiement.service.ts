import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable, observable, of} from 'rxjs';
import {CookieService} from 'ngx-cookie-service';
import {catchError} from 'rxjs/operators';


interface SubscriptionResult {
  hasActiveSubscription: boolean;
  payment: any | null;
}

@Injectable({
  providedIn: 'root'
})
export class PaiementService {
  private apiUrl = 'http://localhost:3001/api/payment/';
  public  static  paiement:any[]=[] ;
  // public  static subscriptionResult: { hasActiveSubscription: boolean, payment: any } | null = null;

  constructor(private http :HttpClient , private cookieService: CookieService) { }

  private subscriptionResult: { hasActiveSubscription: boolean, payment: any } | null = null;

  fetchpaiement(): Observable<{ hasActiveSubscription: boolean, payment: any }> {
    return this.getPaiementById().pipe(
      map(result => {
        this.subscriptionResult = result;
        return result;
      }),
      catchError(error => {
        console.error('Erreur lors de la récupération des abonnements', error);
        this.subscriptionResult = {
          hasActiveSubscription: false,
          payment: null
        };
        return of(this.subscriptionResult);
      })
    );
  }

  getSubscriptionResult() {
    return this.subscriptionResult?.hasActiveSubscription;
  }


  addPaiement(formData : any ):Observable<any> {
    return this.http.post(`${this.apiUrl}add`,formData);
  }


  getPaiement(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}all`)
  }
  getPaiementById(): Observable<SubscriptionResult> {
    return this.http.get<SubscriptionResult>(`${this.apiUrl}${this.cookieService.get('id')}`);
  }
  updatePaiement(id: string, userData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}update/${id}`, userData);
  }
  deletePaiement(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}delete/${id}`);
  }

  // fetchpaiement():void {
  //   this.getPaiementById().subscribe(
  //     (result) => {
  //       PaiementService.subscriptionResult = result ;
  //     },
  //     (error) => {
  //       console.error('Erreur lors de la récupération des abonnements', error);
  //       PaiementService.subscriptionResult = {
  //         hasActiveSubscription: false,
  //         payment: null
  //       };
  //     }
  //   )
  // }




  getUserRole(): string {
    return this.cookieService.get('role'); // Lire le rôle depuis un cookie
  }

  isUser(): boolean {
    return this.getUserRole() === 'User';
  }
}

