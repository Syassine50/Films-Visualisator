import { Component } from '@angular/core';
import { FilmsService } from '../services/films.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-addfilm',
  templateUrl: './addfilm.component.html',
  styleUrl: './addfilm.component.css'
})
export class AddfilmComponent {
  film: any = {
    nom: '',
    description: '',
    dateDeSortie: '',
    trailer: null,
    photoAffiche: null,
    film: null
  };

  isLoading = false;
  errorMessage = '';

  constructor(private filmService: FilmsService, private router: Router) { }

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

      // Ajout des fichiers
      if (this.film.trailer instanceof File) {
        formData.append('trailer', this.film.trailer);
      }
      if (this.film.photoAffiche instanceof File) {
        formData.append('photoAffiche', this.film.photoAffiche);
      }
      if (this.film.film instanceof File) {
        formData.append('film', this.film.film);
      }

      // Vérification du contenu du FormData avant envoi
      console.log('FormData content:');
      formData.forEach((value, key) => {
        console.log(key, value);
      });
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
          this.errorMessage = "Erreur lors de l'ajout du film. Vérifiez que tous les champs sont correctement remplis.";
        }
      });
    } else {
      this.errorMessage = "Veuillez remplir tous les champs requis.";
    }
  }
}
