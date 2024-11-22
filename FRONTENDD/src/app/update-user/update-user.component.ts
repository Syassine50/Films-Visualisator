import { Component, OnInit } from
    '@angular/core';
import { ActivatedRoute, Router } from
    '@angular/router';
import { AuthentificationService } from
    '../services/authentification.service';
import { FormBuilder, FormGroup, Validators }
  from '@angular/forms';
@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrl: './update-user.component.css'
})
export class UpdateUserComponent implements
  OnInit {
  updateUserForm: FormGroup;
  userId: string = '';
  loading: boolean = false;
  errorMessage: string = '';
  constructor(
    private route: ActivatedRoute,
    private userService:
      AuthentificationService,
    private fb: FormBuilder,
    private router: Router
  )
  {

// Initialiser le formulaire avec
    this.updateUserForm = this.fb.group({
      lastname: ['', [Validators.required]],
      firstname: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      email: ['', [Validators.required,
        Validators.email]],
      role: ['', [Validators.required]]
    });
  }
  ngOnInit(): void {
// Récupérer l'ID de l'utilisateur depuis l'URL
    this.userId =
      this.route.snapshot.paramMap.get('id') || '';
// Charger les détails de l'utilisateur pour pré-remplir le formulaire
    if (this.userId) {
      this.userService.getUserById(this.userId).subscribe(
        (user) => {
// Pré-remplir le formulaire avec les données utilisateur
          this.updateUserForm.patchValue({
            lastname:user.lastname,
            email: user.email,
            password: user.password,
            firstname: user.firstname,
            phone:user.phone,
            role:user.role
          });
        },
        (error) => {
          console.error('Erreur lors de la récupération des informations utilisateur',
          error);
        }
      );
    }
  }
// Soumettre le formulaire de mise à jour
  onSubmit(): void {
    if (this.updateUserForm.valid) {
      this.loading = true;
      this.userService.updateUser(this.userId,
        this.updateUserForm.value).subscribe(
        () => {
          this.loading = false;
          alert('Utilisateur mis à jour avec succès');
          this.router.navigate(['/listusers']);
// Redirection après la mise à jour
        },
        (error) => {
          this.loading = false;
          this.errorMessage = 'Erreur lors de la mise à jour de l\'utilisateur';
          console.error(error);
        }
      );
    }
  }
}
