import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthentificationService} from '../../services/authentification.service';
import {AbonnementsServiceService} from '../../services/abonnements-service.service';

@Component({
  selector: 'app-update-abnn',
  templateUrl: './update-abnn.component.html',
  styleUrl: './update-abnn.component.css'
})
export class UpdateAbnnComponent implements
  OnInit {
  updateAbonnForm: FormGroup;
  AbonnId: string = '';
  loading: boolean = false;
  errorMessage: string = '';
  constructor(
    private route: ActivatedRoute,
    private AbonnService:
      AbonnementsServiceService,
    private fb: FormBuilder,
    private router: Router
  )
  {

// Initialiser le formulaire avec
    this.updateAbonnForm = this.fb.group({
      name: ['', [Validators.required]],
      duree: ['', [Validators.required]],
      prix: ['', [Validators.required]]
    });
  }
  ngOnInit(): void {
// Récupérer l'ID de l'utilisateur depuis l'URL
    this.AbonnId =
      this.route.snapshot.paramMap.get('id') || '';
// Charger les détails de l'utilisateur pour pré-remplir le formulaire
    if (this.AbonnId) {
      this.AbonnService.getAbonnById(this.AbonnId).subscribe(
        (Abonn) => {
// Pré-remplir le formulaire avec les données utilisateur
          this.updateAbonnForm.patchValue({
            name:Abonn.name,
            duree: Abonn.duree,
            prix: Abonn.prix
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
    if (this.updateAbonnForm.valid) {
      this.loading = true;
      this.AbonnService.updateAbonn(this.AbonnId,
        this.updateAbonnForm.value).subscribe(
        () => {
          this.loading = false;
          alert('Utilisateur mis à jour avec succès');
          this.router.navigate(['/Abonnement/ListAbonnement']);
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
