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
      // dateDeSortie: ['', [Validators.required]],
      trailer: null,
      photoAffiche: null,
      film: null
    });
  }

  ngOnInit() {
    // Check if we're in update mode
    this.filmId = this.route.snapshot.paramMap.get('id');
    if (this.filmId) {
      this.filmService.getFilmById(this.filmId).subscribe(
        (Film) => {
          // Pré-remplir le formulaire avec les données utilisateur
          this.filmForm.patchValue({
            nom: Film.nom,
            description: Film.description,
            dateDeSortie: Film.dateDeSortie
          });
        },
        (error) => {
          console.error('Erreur lors de la récupération des informations utilisateur', error);
        }
      );
    }
  }
  loadFilmDetails(id: string) {
    this.isLoading = true;
    this.filmService.getFilmById(id).subscribe({
      next: (film) => {
        this.film = {
          ...film,
          trailer: null,
          photoAffiche: null,
          film: null
        };
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading film details:', error);
        this.errorMessage = "Impossible de charger les détails du film.";
        this.isLoading = false;
      }
    });
  }

  onFileChange(event: any, type: string) {
    const file = event.target.files[0];
    if (file) {
      this.film[type] = file;
    }
  }

  add(form: any) {
    if (form.valid) {
      this.isLoading = true;
      const formData = new FormData();

      // Ajout des données textuelles
      formData.append('nom', this.film.nom);
      formData.append('description', this.film.description);
      formData.append('dateDeSortie', this.film.dateDeSortie);

      // Ajout des fichiers (optionnel pour la mise à jour)
      if (this.film.trailer instanceof File) {
        formData.append('trailer', this.film.trailer);
      }
      if (this.film.photoAffiche instanceof File) {
        formData.append('photoAffiche', this.film.photoAffiche);
      }
      if (this.film.film instanceof File) {
        formData.append('film', this.film.film);
      }

      // Determine whether to add or update
      if (this.isUpdateMode && this.film.id) {
        formData.append('id', this.film.id);
        this.filmService.updateFilm(this.film.id, formData).subscribe({
          next: (response) => {
            console.log('Success:', response);
            this.isLoading = false;
            alert('Film mis à jour avec succès!');
            this.router.navigate(['/film/list']);
          },
          error: (error) => {
            console.error('Error details:', error);
            this.isLoading = false;
            this.errorMessage = "Erreur lors de la mise à jour du film.";
          }
        });
      } else {
        // Existing add film logic
        this.filmService.addFilm(formData).subscribe({
          next: (response) => {
            console.log('Success:', response);
            this.isLoading = false;
            alert('Film ajouté avec succès!');
            this.router.navigate(['/film/list']);
          },
          error: (error) => {
            console.error('Error details:', error);
            this.isLoading = false;
            this.errorMessage = "Erreur lors de l'ajout du film.";
          }
        });
      }
    } else {
      this.errorMessage = "Veuillez remplir tous les champs requis.";
    }
  }
}
