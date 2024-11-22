import { Component } from '@angular/core';

import { AuthentificationService } from '../services/authentification.service';

import { Router } from '@angular/router';

import { HttpErrorResponse } from '@angular/common/http';

import { User } from '../models/user.model';

@Component({

  selector: 'app-register',

  templateUrl: './register.component.html',

  styleUrl: './register.component.css'

})

export class RegisterComponent {

  user: any = {};



  constructor(private userService: AuthentificationService, private router: Router) {}



  register() {

    const userData = {

      lastname:this.user.lastname,
      email: this.user.email,
      password: this.user.password,
      firstname: this.user.firstname,
      phone:this.user.phone,
      role:this.user.role

    };



    this.userService.registerUser(userData).subscribe(

      (response) => {

        console.log(response);

        alert('Inscription réussie:');

        this.router.navigate(['/']);

      },

        (error:HttpErrorResponse ) => {

        console.error('Erreur lors de l\'inscription:', error);

        // Affichez un message d'erreur à l'utilisateur si besoin

      }

    );

  }

}


