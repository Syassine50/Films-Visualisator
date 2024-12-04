import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FilmsService } from '../services/films.service';

@Component({
  selector: 'app-updatefilm',
  templateUrl: './updatefilm.component.html',
  styleUrl: './updatefilm.component.css'
})
export class UpdatefilmComponent implements OnInit {
  updateFilmForm: FormGroup;
  filmId: string = '';
  loading: boolean = false;
  errorMessage: string = '';

  // File storage
  trailer: File | null = null;
  photoAffiche: File | null = null;
  film: File | null = null;

  constructor(
    private route: ActivatedRoute,
    private filmService: FilmsService,
    private fb: FormBuilder,
    private router: Router
  ) {
    // Initialize the form with validators
    this.updateFilmForm = this.fb.group({
      nom: ['', [Validators.required]],
      description: ['', [Validators.required]],
      dateDeSortie: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Retrieve film ID from URL
    this.filmId = this.route.snapshot.paramMap.get('id') || '';

    // Load film details to pre-fill the form
    if (this.filmId) {
      this.filmService.getFilmById(this.filmId).subscribe(
        (film) => {
          // Pre-fill the form with film data
          this.updateFilmForm.patchValue({
            nom: film.nom,
            description: film.description,
            dateDeSortie: film.dateDeSortie
          });
        },
        (error) => {
          console.error('Erreur lors de la récupération des informations du film', error);
          this.errorMessage = 'Impossible de charger les détails du film';
        }
      );
    }
  }

  // Handle file selection
  onFileChange(event: any, type: string) {
    const file = event.target.files[0];
    if (file) {
      switch(type) {
        case 'trailer':
          this.trailer = file;
          break;
        case 'photoAffiche':
          this.photoAffiche = file;
          break;
        case 'film':
          this.film = file;
          break;
      }
    }
  }

  // Submit form
  onSubmit(): void {
    if (this.updateFilmForm.valid) {
      this.loading = true;

      // Create FormData for file upload
      const formData = new FormData();

      // Add form values to FormData
      Object.keys(this.updateFilmForm.controls).forEach(key => {
        formData.append(key, this.updateFilmForm.get(key)?.value);
      });

      // Add files if they exist
      if (this.trailer) formData.append('trailer', this.trailer);
      if (this.photoAffiche) formData.append('photoAffiche', this.photoAffiche);
      if (this.film) formData.append('film', this.film);

      // Add film ID for update
      formData.append('id', this.filmId);

      // Call update service method
      this.filmService.updateFilm(this.filmId, formData).subscribe(
        () => {
          this.loading = false;
          alert('Film mis à jour avec succès');
          this.router.navigate(['/film/list']);
        },
        (error) => {
          this.loading = false;
          this.errorMessage = 'Erreur lors de la mise à jour du film';
          console.error(error);
        }
      );
    }
  }
}
