import { Component, Input, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service'
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MovieInfoComponent } from '../movie-info/movie-info.component';

type User = { _id?: string, Username?: string, Password?: string, Email?: string, FavoriteMovies?: [] }

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit {
  userinfo: User = {};
  user: any = {};

  FavoriteMovies: any[] = [];

  @Input() userData = { Username: '', Password: '', Email: '' };
  
  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    public router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    const user = this.getUser();

    if (!user._id) {
      this.router.navigate(['welcome']);
      return;
    }

    this.user = user;
    this.userData = {
      Username: user.Username || "",
      Email: user.Email || "",
      Password: ""
    }

    this.fetchApiData.getAllMovies().subscribe((response: any) => {
      this.FavoriteMovies = response.filter((m: { _id: any; }) => this.user.FavoriteMovies.indexOf(m._id) >= 0);
    });
  }

  getUser(): User {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }

 
/**
   * calls the updateUser API and updates the users information in the database
   * @function updateUser
   */
  updateUser(): void {
    this.fetchApiData.updateUser(this.userData).subscribe((result) => {
      localStorage.setItem('user', JSON.stringify(result))
      this.user = result;
      this.snackBar.open('your settings were updated!', 'OK', {
        duration: 2000
      })
    })
  }
/**
   * calls the deleteUser API and removes the user in the database
   * @function deleteUser
   */
  deleteUser(): void {
    if (confirm('Are you sure you want to delete your account? This action cannnot be undone.')) {
      this.router.navigate(['welcome']).then(() => {
        localStorage.clear();
        this.snackBar.open('Your account has been deleted.', 'OK', {
          duration: 3000
        });
      })}
      this.fetchApiData.deleteUser().subscribe(result =>{
        console.log('Resolution:', result);
      })
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

  isFavorite(id: string): boolean {
    return this.fetchApiData.isFavoriteMovie(id)
  }
  /**
   * calls the removeMovieFavorites API and removes a movie to users favorites 
   * @param id of the movie selected 
   */
  removeFavoriteMovie(id: string): void {
    this.fetchApiData.removeMovieFavorites(id).subscribe(() => {
      this.snackBar.open('removed from favorites', 'OK', {
        duration: 2000
      })
    });
  }
}


