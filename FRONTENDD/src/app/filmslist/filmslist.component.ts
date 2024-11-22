import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FilmsService } from '../services/films.service';

@Component({
  selector: 'app-filmslist',
  templateUrl: './filmslist.component.html',
  styleUrl: './filmslist.component.css'
})
export class FilmslistComponent implements OnInit {
  films: any[] = [];
  isModalOpen = false;
  currentVideo: string = '';
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;

  constructor(
    private filmService: FilmsService,
    private sanitizer: DomSanitizer
  ) { }

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
    // Replace backslashes with forward slashes
    const formattedPath = path.replace(/\\/g, '/');
    const fullUrl = `http://localhost:3001/${formattedPath}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(fullUrl);
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

  ngOnDestroy(): void {
    document.body.classList.remove('modal-open');
  }
}
