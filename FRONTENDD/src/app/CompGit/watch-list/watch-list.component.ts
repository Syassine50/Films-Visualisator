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
  @ViewChild('videoPlayer', { static: false }) videoPlayer!: ElementRef<HTMLVideoElement>;

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

  playVideo(videoPath: string): void {
    console.log('Playing video:', videoPath);
    this.currentVideo = videoPath;
    this.isModalOpen = true;
    document.body.classList.add('modal-open');

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

  ngOnDestroy(): void {
    document.body.classList.remove('modal-open');
  }
}
