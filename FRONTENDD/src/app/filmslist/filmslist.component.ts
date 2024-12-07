import {Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef} from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FilmsService } from '../services/films.service';
import {PaiementService} from '../services/paiement.service';
import {AuthentificationService} from '../services/authentification.service';
import {map, Observable, of} from 'rxjs';
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

  categorie :string ='';
  clicked =false;
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

    this.fetchFilmsbycategorie(this.categorie);
    this.getCategories();
    console.log(this.categories);
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


  fetchpaiement(): Observable<{ hasActiveSubscription: boolean, payment: any }> {
    return this.paiementService.getPaiementById().pipe(
      map(result => {
        this.subscriptionResult = result;
        return result;
      }),
      catchError(error => {
        console.error('Erreur lors de la récupération des abonnements', error);
        this.subscriptionResult = {
          hasActiveSubscription: false,
          payment: null
        };
        return of(this.subscriptionResult);
      })
    );
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
  }
  // fetchFilmsbycategorie(categorie :any): void {
  //
  //   if (categorie == "" || this.categorie==categorie){
  //     this.categorie= "";
  //     this.clicked=false ;
  //     this.filmService.getFilms().subscribe({
  //       next: (data) => {
  //         console.log('Received films data:', data);
  //         this.films = data;
  //       },
  //       error: (error) => {
  //         console.error('Error fetching films:', error);
  //         alert('Error loading films: ' + error.message);
  //       }
  //     });
  //   }
  //   else{
  //     this.categorie= categorie;
  //
  //     this.clicked=true;
  //       this.filmService.getfilmBycat(categorie).subscribe(
  //         (data) => {
  //           console.log('Received films data:', data);
  //           this.films = data;
  //         },
  //         (error) => {
  //           console.error('Error fetching films:', error);
  //           alert('Error loading films: ' + error.message);
  //         }
  //       );
  //   }
  //   console.log(this.categorie);
  // }

    fetchFilmsbycategorie(categorie: string): void {
      // If clicking the same category again, reset
      if (this.activeCategory === categorie) {
      this.activeCategory = '';
      this.fetchFilms();
      return;
    }

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
  ngOnDestroy(): void {
    document.body.classList.remove('netflix-modal');
  }

  protected readonly console = console;
}
