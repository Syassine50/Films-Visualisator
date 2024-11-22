import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';  // Assuming you are using ngx-cookie-service
import { AuthentificationService } from './services/authentification.service';        // Replace with actual path to your AuthService
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const cookieService = inject(CookieService);
  const authService = inject(AuthentificationService);
  const router = inject(Router);

  const token = cookieService.get('token');

  if (token && authService.isTokenValid(token)) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
