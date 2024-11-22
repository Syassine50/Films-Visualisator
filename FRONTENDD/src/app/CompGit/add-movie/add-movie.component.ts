import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Movies} from '../../movies';
import { MoviesService } from '../../services/movies.service'
import { uuid } from 'uuidv4';
@Component({
  selector: 'app-add-movie',
  templateUrl: './add-movie.component.html',
  styleUrls: ['./add-movie.component.scss']
})
export class AddMovieComponent implements OnInit {
  movieTitle: string = '';
  image: string = '';
  isWatched: boolean = false;
  isFav: boolean = false;

  constructor(
    private moviesService: MoviesService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.movieTitle && this.image) {
      const newMovie: Movies = {
        isFav: this.isFav,
        isWatched: this.isWatched,
        image: this.image,
        title: this.movieTitle,
        id: Math.round(Math.random() * 100000),
      }
      this.moviesService.addMovie(newMovie).subscribe((movie) => this.router.navigate(['/']));
    }
  }
}
