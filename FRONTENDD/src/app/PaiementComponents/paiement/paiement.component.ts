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
    // utilisateurId : '',
    // abonnementId :'',
    cvv : '',
    numeroCarte : '',
    nomDePropDeCarte : '',
    // dateExpirationAbon : '',
  }


  paiementForm: FormGroup;
  loading: boolean = false;
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
      email: ['', [Validators.required,
        Validators.email]],
      role: ['', [Validators.required]]
    });
  }

  AbonnId : string = '';
  duree : any ;
  ngOnInit(): void {
// Récupérer l'ID de l'utilisateur depuis l'URL
//     this.userId =
//       this.route.snapshot.paramMap.get('id') || '';
// // Charger les détails de l'utilisateur pour pré-remplir le formulaire
//     if (this.userId) {
//       this.userService.getUserById(this.userId).subscribe(
//         (user) => {
// // Pré-remplir le formulaire avec les données utilisateur
//           this.paiementForm.patchValue({
//             lastname:user.lastname,
//             email: user.email,
//             password: user.password,
//             firstname: user.firstname,
//             phone:user.phone,
//             role:user.role
//           });
//         },
//         (error) => {
//           console.error('Erreur lors de la récupération des informations utilisateur',
//             error);
//         }
//       );
//     }
  }
  add(form : any){
    if(form.valid){
      const abonn ={
        utilisateurId :  this.cookieService.get('id'),
        abonnementId : this.route.snapshot.paramMap.get('id'),
        cvv : this.paiement.cvv,
        nomDePropDeCarte : this.paiement.nomDePropDeCarte,
        months : this.route.snapshot.paramMap.get('duree'),
        numeroCarte : this.paiement.numeroCarte,
      }
      this.paiementserv.addPaiement(abonn).subscribe(
        (response) => {
          console.log("Success:" , response);
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
