import { Component } from '@angular/core';
import { AuthentificationService } from '../services/authentification.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(
    private userService: AuthentificationService,
    private router: Router,
    private cookieService: CookieService
  ) { }

  loginUser() {
    this.userService.loginUser(this.email, this.password).subscribe(
      (response) => {
        console.log('API Response:', response); // Log la réponse pour l'inspection

        const token = response.token; // Assurez-vous que le token est correctement extrait
        const role = response.role; // Vérifiez que vous extrayez le rôle
        const id = response.id; // Vérifiez que vous extrayez le rôle
        const fullname =response.fullname ;
        if (token) {
          // Stockage sécurisé du cookie
          const cookieExpirationDays = 7;
          this.cookieService.set('token', token, cookieExpirationDays, '/', '', true, 'Strict');
          this.cookieService.set('role', role, cookieExpirationDays, '/', '', true, 'Strict');
          this.cookieService.set('id', id, cookieExpirationDays, '/', '', true, 'Strict');
          this.cookieService.set('fullname', fullname, cookieExpirationDays, '/', '', true, 'Strict');
          this.userService.login(fullname);

          // Vérifiez le token avant de naviguer
          if (this.userService.isTokenValid(token)) {
            this.router.navigate(['/']);
          } else {
            alert("Token invalide, veuillez réessayer.");
          }
        } else {
          alert("Token manquant dans la réponse.");
        }
      },
      (error) => {
        console.error(error);
        alert("Erreur lors de la connexion. Vérifiez vos informations et réessayez.");
      }
    );
  }



}

