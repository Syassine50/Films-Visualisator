import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthentificationService} from '../../services/authentification.service';
import {CookieService} from 'ngx-cookie-service';
import {PaiementService} from '../../services/paiement.service';

@Component({
  selector: 'app-paiement',
  templateUrl: './paiement.component.html',
  styleUrl: './paiement.component.css'
})
export class PaiementComponent implements
  OnInit {

  paiement:any ={
    cvv : '',
    numeroCarte : '',
    nomDePropDeCarte : '',
  }



  paiementForm: FormGroup;
  errorMessage: string = '';
  constructor(
    private route: ActivatedRoute,
    private userService:
      AuthentificationService,
    private paiementserv : PaiementService ,
    private fb: FormBuilder,
    private router: Router,
    private cookieService: CookieService
  )
  {

// Initialiser le formulaire avec
    this.paiementForm = this.fb.group({
      numeroCarte: ['', [Validators.required]],
      cvv: ['', [Validators.required]],
      nomDePropDeCarte: ['', [Validators.required]],
    });
  }
  subscriptionResult: { hasActiveSubscription: boolean, payment: any } | null = null;

  duree : any ;
  ngOnInit(): void {

    this.paiementserv.fetchpaiement().subscribe(
      result => {
        this.subscriptionResult = result;
      }
    );
  }
  add(form : any){
    if(form.valid){
      const abonn ={
        utilisateurId :  this.cookieService.get('id'),
        abonnementId : this.route.snapshot.paramMap.get('id'),
        cvv : this.paiement.cvv,
        nomDePropDeCarte : this.paiement.nomDePropDeCarte,
        months : parseInt(<any> this.route.snapshot.paramMap.get('duree')),
        numeroCarte : this.paiement.numeroCarte,
      }
      this.paiementserv.addPaiement(abonn).subscribe(
        (response) => {
          this.router.navigate(['/']);
        },
        (error)=>{
          console.error("error details :" , error);
        }
      );

    }
    else {
      this.errorMessage = "Veuillez remplir tous les champs requis.";
    }
  }
}
