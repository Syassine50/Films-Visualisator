import { Component, OnInit } from '@angular/core';
import { FilmsService } from '../services/films.service';
import { Router, ActivatedRoute } from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-updatefilm',
  templateUrl: './updatefilm.component.html',
  styleUrl: './updatefilm.component.css'
})
export class UpdatefilmComponent  implements OnInit {
  film: any = {
    id: null,
    nom: '',
    description: '',
    dateDeSortie: '',
    trailer: null,
    photoAffiche: null,
    film: null
  };
  filmId: string | null = '';
  filmForm:FormGroup ;
  isLoading = false;
  errorMessage = '';
  isUpdateMode = false;

  constructor(
    private filmService: FilmsService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
  ) {
    this.filmForm = this.fb.group({
      nom: ['', [Validators.required]],
      description: ['', [Validators.required]],
      dateDeSortie: ['', [Validators.required]],
      trailer: null,
      photoAffiche: null,
      film: null
    });
  }

  ngOnInit() {
    // Check if we're in update mode
    this.filmId =      this.route.snapshot.paramMap.get('id') || '';

    console.log(this.filmId);
    // console.log(this.filmService.getFilmById(this.filmId));
    if (this.filmId) {
      this.filmService.getFilmById(this.filmId).subscribe(
        (Film) => {
          // Pré-remplir le formulaire avec les données utilisateur
          this.filmForm.patchValue({
            nom: Film.nom,
            description: Film.description,
            dateDeSortie: Film.dateDeSortie,
          });
        },
        (error) => {
          console.error('Erreur lors de la récupération des informations utilisateur', error);
        }
      );
    }
  }
  // loadFilmDetails(id: string) {
  //   this.isLoading = true;
  //   this.filmService.getFilmById(id).subscribe({
  //     next: (film) => {
  //       this.film = {
  //         ...film,
  //         trailer: null,
  //         photoAffiche: null,
  //         film: null
  //       };
  //       this.isLoading = false;
  //     },
  //     error: (error) => {
  //       console.error('Error loading film details:', error);
  //       this.errorMessage = "Impossible de charger les détails du film.";
  //       this.isLoading = false;
  //     }
  //   });
  // }

  onFileChange(event: any, type: string) {
    const file = event.target.files[0];
    if (file) {
      this.film[type] = file;
    }
  }

  onSubmit() {
    if (this.filmForm.invalid) {
      return;
    }

    const formData = new FormData();
    formData.append('nom', this.filmForm.value.nom);
    formData.append('description', this.filmForm.value.description);
    formData.append('dateDeSortie', this.filmForm.value.dateDeSortie);
    formData.append('categorie', this.filmForm.value.categorie);

    if (this.film.trailer  instanceof File) {
      formData.append('trailer', this.film.trailer);
    }
    if (this.film.photoAffiche  instanceof File) {
      formData.append('photoAffiche', this.film.photoAffiche);
    }
    if (this.film.film  instanceof File) {
      formData.append('film', this.film.film);
    }

    this.isLoading = true;

    if (this.filmId) {
      // Update existing film
      this.filmService.updateFilm(this.filmId, formData).subscribe(
        (response) => {
          console.log('Film updated successfully:', response);
          this.isLoading = false;
          this.router.navigate(['/']); // Redirect to film list after update
        },
        (error) => {
          console.error('Error updating film:', error);
          this.isLoading = false;
          this.errorMessage = 'Erreur lors de la modification du film.';
        }
      );
    } else {
      this.errorMessage = 'Identifiant du film non trouvé.';
      this.isLoading = false;
    }
  }

}
