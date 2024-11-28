import { Component } from '@angular/core';
import { AbonnementsServiceService} from '../../services/abonnements-service.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-add-abonn',
  templateUrl: './add-abonn.component.html',
  styleUrl: './add-abonn.component.css'
})
export class AddAbonnComponent {
  abonnement:any ={
    name : '',
    duree :'',
    prix : '',
  }
  errorMessage = '';

  constructor(private abonServ : AbonnementsServiceService , private router :Router) {
  }

  add(form : any){
    if(form.valid){
      const abonn ={
        name:this.abonnement.name,
        duree: this.abonnement.duree,
        prix:this.abonnement.prix
      }
      this.abonServ.addAbonnement(abonn).subscribe(
       (response) => {
          console.log("Success:" , response);
          this.router.navigate(['/Abonnement/ListAbonnement']);
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
