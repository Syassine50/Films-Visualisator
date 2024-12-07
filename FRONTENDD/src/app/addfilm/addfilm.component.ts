import { Component } from '@angular/core';
import { FilmsService } from '../services/films.service';
import { Router } from '@angular/router';
import { MultiSelectModule } from 'primeng/multiselect';

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
    film: null,
    categorie : [''] ,
  };
  i=0 ;
  isLoading = false;
  errorMessage = '';
  categories: any[] = []; // Initialize as an empty array
  category: string[] = [];

  constructor(private filmService: FilmsService, private router: Router) { }

  ngOnInit(): void {
     this.getCategories();
  }
   // Convertit le tableau en chaîne séparée par des virgules

  onFileChange(event: any, type: string) {
    const file = event.target.files[0];
    if (file) {
      this.film[type] = file;
    }
  }
  getCategories() {
    this.filmService.getCategories().subscribe(
      (data) => {
        this.categories = data;
        // Move the iteration to the callback to ensure data is loaded
        this.category = this.categories.map(category => category.name);
        console.log(this.category);
      },
      (error) => {
        console.log(error);
      }
    );
  }
  selectedCategories: string[] = [];
  showSelectedCategories() {
    const selectElement = document.getElementById('multi-select') as HTMLSelectElement;
    const selectedOptions = Array.from(selectElement.selectedOptions).map(
      (option) => option.text
    );
    this.selectedCategories = selectedOptions;
  }
  add(form: any) {
    if (form.valid) {
      this.isLoading = true;
      const formData = new FormData();

      // Ajout des données textuelles
      formData.append('nom', this.film.nom);
      formData.append('description', this.film.description);
      formData.append('dateDeSortie', this.film.dateDeSortie);

      // Ajout des catégories (note: le backend attend un tableau)
      if (this.film.categorie && this.film.categorie.length > 0) {
        // Si les catégories sont un tableau, utilisez JSON.stringify
        // Si c'est une chaîne, vous pouvez la diviser ou la convertir selon votre besoin
        formData.append('categorie', JSON.stringify(this.film.categorie));
      }

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

          // Utiliser le message de succès du backend
          const successMessage = response.message || 'Film ajouté avec succès!';
          alert(successMessage);

          this.router.navigate(['/film/list']);
        },
        error: (error) => {
          console.error('Error details:', error);
          this.isLoading = false;

          // Utiliser le message d'erreur du backend si disponible
          const errorMessage = error.error?.message ||
            "Erreur lors de l'ajout du film. Vérifiez que tous les champs sont correctement remplis.";

          this.errorMessage = errorMessage;

          // Gestion spécifique des erreurs de catégories
          if (error.error?.message?.includes('catégories')) {
            this.errorMessage = "Une ou plusieurs catégories spécifiées n'existent pas.";
          }
        }
      });
    } else {
      this.errorMessage = "Veuillez remplir tous les champs requis.";
    }
  }
}
