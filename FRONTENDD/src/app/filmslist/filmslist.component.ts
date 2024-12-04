import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FilmsService } from '../services/films.service';
import {PaiementService} from '../services/paiement.service';
import {AuthentificationService} from '../services/authentification.service';
import {Observable} from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-filmslist',
  templateUrl: './filmslist.component.html',
  styleUrl: './filmslist.component.css'
})
export class FilmslistComponent implements OnInit {
  films: any[] = [];
  categories: any[] = [];
  isModalOpen = false;
  currentVideo: string = '';
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
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
    private route: ActivatedRoute
  ) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.fullname$ = this.authService.fullname$;
  }

  ngOnInit(): void {
    this.fetchFilmsbycategorie(this.categorie);
    this.getCategories();
    console.log(this.categories);
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

    return <boolean>this.paiementService.getSubscriptionResult();
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

  closeModal(): void {
    this.isModalOpen = false;
    document.body.classList.remove('modal-open');
    if (this.videoPlayer) {
      this.videoPlayer.nativeElement.pause();
      this.videoPlayer.nativeElement.currentTime = 0;
    }
  }

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
    document.body.classList.remove('modal-open');
  }

  protected readonly console = console;
}
