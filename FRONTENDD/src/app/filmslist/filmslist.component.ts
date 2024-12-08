import {Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef} from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FilmsService } from '../services/films.service';
import {PaiementService} from '../services/paiement.service';
import {AuthentificationService} from '../services/authentification.service';
import {map, Observable, of , BehaviorSubject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import {catchError} from 'rxjs/operators';


@Component({
  selector: 'app-filmslist',
  templateUrl: './filmslist.component.html',
  styleUrl: './filmslist.component.css'
})
export class FilmslistComponent implements OnInit {
  films: any[] = [];
  categories: any[] = [];
  isModalOpen = false;
  private subscriptionResult: { hasActiveSubscription: boolean, payment: any } | null = null;

  currentVideo: string = '';
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
  // Close Modal Function
  filteredFilms: any[] = []; // Liste filtrée pour la recherche
  randomFilms: any[] = []; // Liste des 4 films aléatoires
  searchQuery: string = '';
  categorie :string ='';
  activeCategory = '';
  isLoggedIn$: Observable<boolean>;
  fullname$: Observable<string>;

  constructor(
    private filmService: FilmsService,
    private sanitizer: DomSanitizer ,
    private paiementService : PaiementService,
    private authService : AuthentificationService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.fullname$ = this.authService.fullname$;
  }

  ngOnInit(): void {
    this.fetchFilms();
    this.generateRandomFilms();
    this.fetchFilmsbycategorie(this.categorie);
    this.getCategories();
    this.paiementService.fetchpaiement().subscribe(
      result => {
        this.subscriptionResult = result;
        console.log('Subscription Result:', this.subscriptionResult);
      }
    );
    this.getSubscriptionResult();
    this.isSubscribed();
  }

  closeModal() {
    this.isModalOpen = false;
    console.log('Modal status:', this.isModalOpen);

    // Force change detection
    this.cdr.detectChanges();

    if (this.videoPlayer && this.videoPlayer.nativeElement) {
      this.videoPlayer.nativeElement.pause();
    }
  }



  fetchFilms(): void {
    this.filmService.getFilms().subscribe({
      next: (data) => {
        console.log('Received films data:', data);
        this.films = data;
      },
      error: (error) => {
        console.error('Error fetching films:', error);
        alert('Error loading films: ' + error.message);
      }
    });
    this.filteredFilms = [...this.films]; // Initialise la liste filtrée
  }

  filterFilms() {
    const query = this.searchQuery.toLowerCase();
    this.filteredFilms = this.films.filter(film =>
      film.nom.toLowerCase().includes(query)
    );
  }

  generateRandomFilms() {
    if (this.films.length >= 4) {
      const shuffled = [...this.films].sort(() => 0.5 - Math.random());
      this.randomFilms = shuffled.slice(0, 4);
    }
  }

  fetchFilmsbycategorie(categorie: string): void {
      // If clicking the same category again, reset
      if (this.activeCategory === categorie) {
      this.activeCategory = '';
      this.fetchFilms();
      return;}

    // Set active category
    this.activeCategory = categorie;

    // Fetch films by category
    this.filmService.getfilmBycat(categorie).subscribe({
      next: (data) => {
        this.films = data;
      },
      error: (error) => {
        console.error('Error fetching films by category:', error);
        alert('Error loading films: ' + error.message);
      }
    });
  }
  getVideoUrl(path: string): SafeUrl {
    // Replace backslashes with forward slashes
    const formattedPath = path.replace(/\\/g, '/');
    const fullUrl = `http://localhost:3001/${formattedPath}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(fullUrl);
  }

  isSubscribed(): boolean{

    return <boolean>this.getSubscriptionResult();
  }
  getSubscriptionResult() {
    return this.subscriptionResult?.hasActiveSubscription;
  }

  playVideo(videoPath: string): void {
    console.log('Playing video:', videoPath); // Debug log
    this.currentVideo = videoPath;
    this.isModalOpen = true;
    document.body.classList.add('modal-open');

    // Give the modal time to render, then play the video
    setTimeout(() => {
      if (this.videoPlayer) {
        this.videoPlayer.nativeElement.load();
        this.videoPlayer.nativeElement.play().catch(err => {
          console.error('Error playing video:', err);
        });
      }
    }, 100);
  }

  // Close Modal Function

  getCategories(){
    this.filmService.getCategories().subscribe(
      (data) => {
        this.categories=data ;
        console.log(data);
      },
      (error) =>{
        console.log(error);
    }
    )
  }
  isAdmin():boolean {
    return this.authService.isAdmin();
  }
  onDeleteFilm(FilmId: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce film ?')) {
      this.filmService.deleteFilm(FilmId).subscribe(() => {
        this.fetchFilms(); // Mettre à jour la liste après la suppression
      }, error => {
        console.error('Erreur lors de la suppression de l\'film', error);
        alert('Une erreur est survenue lors de la suppression.');
      });
    }
  }

  protected readonly console = console;
}
