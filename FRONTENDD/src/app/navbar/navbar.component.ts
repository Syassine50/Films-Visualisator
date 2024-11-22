import { Component } from '@angular/core';
import {AuthentificationService} from '../services/authentification.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  constructor(private authService: AuthentificationService) {}
  isAdmin(): boolean {
    return this.authService.isAdmin();
  }
}
