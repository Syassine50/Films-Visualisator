import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Films } from '../../models/films.model';
import { FilmsService } from '../../services/films.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-watch-list',
  templateUrl: './watch-list.component.html',
  styleUrls: ['./watch-list.component.scss']
})
export class WatchListComponent implements OnInit, OnDestroy {
  films: Films[] = [];
  isModalOpen = false;
  currentVideo: string = '';
  // @ViewChild('videoPlayer', { static: false }) videoPlayer!: ElementRef<HTMLVideoElement>;

  constructor(
    private filmService: FilmsService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.fetchFilms();
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

  getVideoUrl(path: string): SafeUrl {
    const formattedPath = path.replace(/\\/g, '/');
    const fullUrl = `http://localhost:3001/${formattedPath}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(fullUrl);
  }


  ngOnDestroy(): void {
    document.body.classList.remove('modal-open');
  }
}
