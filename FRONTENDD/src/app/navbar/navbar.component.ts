import { Component } from '@angular/core';
import { AuthentificationService } from '../services/authentification.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isLoggedIn$: Observable<boolean>;
  fullname$: Observable<string>;

  constructor(
    private authService: AuthentificationService,
    private cookieService: CookieService,
    private router: Router
  ) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.fullname$ = this.authService.fullname$;
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  logout() {
    // Supprimer tous les cookies
    this.cookieService.delete('token');
    this.cookieService.delete('role');
    this.cookieService.delete('id');
    this.cookieService.delete('fullname');

    // Utiliser le service pour mettre à jour l'état
    this.authService.logout();

    // Rediriger vers la page de connexion
    this.router.navigate(['/login-user']);
  }
}
