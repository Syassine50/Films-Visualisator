import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, map, Observable, observable, of} from 'rxjs';
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
  private subscribed = new BehaviorSubject<boolean>(false);
  constructor(private http :HttpClient , private cookieService: CookieService) { }

  private subscriptionResult: { hasActiveSubscription: boolean, payment: any } | null = null;

  fetchpaiement(): Observable<{ hasActiveSubscription: boolean, payment: any }> {
    return this.getPaiementById().pipe(
      map(result => {
        this.subscriptionResult = result;
        return result ;
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

//for getting all data

  // getPaiement(): Observable<any> {
  //   return this.http.get<any>(`${this.apiUrl}all`)
  // }
  private subscriptionStatus = new BehaviorSubject<boolean>(false);

  getSubscriptionStatus$() {
    return this.subscriptionStatus.asObservable();
  }

  updateSubscriptionStatus(status: boolean): void {
    this.subscriptionStatus.next(status);
  }

  getPaiementById(): Observable<SubscriptionResult> {
    return this.http.get<SubscriptionResult>(`${this.apiUrl}${this.cookieService.get('id')}`);

  }

  //apis for deleting and updating payments

  // updatePaiement(id: string, userData: any): Observable<any> {
  //   return this.http.put<any>(`${this.apiUrl}update/${id}`, userData);
  // }
  // deletePaiement(id: string): Observable<any> {
  //   return this.http.delete<any>(`${this.apiUrl}delete/${id}`);
  // }
  //

  getUserRole(): string {
    return this.cookieService.get('role'); // Lire le rôle depuis un cookie
  }

}

