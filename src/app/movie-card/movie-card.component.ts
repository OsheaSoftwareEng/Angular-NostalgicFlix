import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MovieInfoComponent } from '../movie-info/movie-info.component';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  constructor(public fetchApiData: FetchApiDataService, 
    public router: Router,
    public dialog: MatDialog,
    public snackBar: MatSnackBar, )
  { }

ngOnInit(): void {
  this.getMovies();

  const user = localStorage.getItem('user');

if (!user) {
  this.router.navigate(['welcome']);
  return;
}
}



getMovies(): void {
  this.fetchApiData.getAllMovies().subscribe((response: any) => {
      this.movies = response;
      return this.movies;
    });
  }

  openGenreInfo(genre: any): void {
    this.dialog.open(MovieInfoComponent,{
      data: {
        title: genre.Name,
        content: genre.Description
      }
    })
  }

  openDirectorInfo(director: any): void {
    this.dialog.open(MovieInfoComponent,{
      data: {
        title: director.Name,
        content: director.Bio
      }
    })
  }

  openMovieDescription(description: string): void {
    this.dialog.open(MovieInfoComponent,{
      data: {
        title: 'Description',
        content: description
      }
    })
  }

  openMoviePreview(movie: any): void {
    this.dialog.open(MovieInfoComponent,{
      data: {
        title: movie.name,
        content: movie.MovieEmbed
      }
    })
  }

 

  addFavoriteMovie(id: string): void {
    this.fetchApiData.addMovieFavorites(id).subscribe(() => {
      this.snackBar.open('Movie added to favorites!', 'OK', {
        duration: 2000
      })
    });
  }

  removeFavoriteMovie(id: string): void {
    this.fetchApiData.removeMovieFavorites(id).subscribe(() => {
      this.snackBar.open('removed from favorites', 'OK', {
        duration: 2000
      })
    });
  }


  isFavorite(id: string): boolean {
    return this.fetchApiData.isFavoriteMovie(id)
  }
}


