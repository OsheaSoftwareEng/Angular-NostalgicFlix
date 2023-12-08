import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';

//Declaring the api url that will provide data for the client app
const apiUrl = 'https://nostalgic-flix.herokuapp.com/';
@Injectable({
  providedIn: 'root'
})
export class FetchApiDataService {
  // Inject the HttpClient module to the constructor params
 // This will provide HttpClient to the entire class, making it available via this.http
  constructor(private http: HttpClient) {
  }
 
   /**
   * User registration
   * @service POST to the respective endpoint of apiUrl to register a new user
   * @function userRegistration
   * @param {any} userDetails
   * @returns a new user object in json format
   */

  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'users', userDetails).pipe(
    catchError(this.handleError)
    );
  }

private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
    console.error('Some error occurred:', error.error.message);
    } else {
    console.error(
        `Error Status code ${error.status}, ` +
        `Error body is: ${error.error}`);
    }
    return throwError(
    'Something bad happened; please try again later.');
  }
  
   /**
   * User login
   * @service POST to the respective endpoint of apiUrl to log in a new user
   * @function userLogin
   * @param {any} userDetails
   * @returns a user object in json format
   */

  public userLogin(userDetails: any): Observable<any> {
    return this.http.post(apiUrl + 'login', userDetails).pipe(
      catchError(this.handleError)
    );
  };


 
  /**
   * Get all movies
   * @service GET request to the respective endpoint of apiUrl to get all movies
   * @function getAllMovies
   * @returns a object with all the movies in json format
   */

getAllMovies(): Observable<any> {
  const token = localStorage.getItem('token');
  return this.http.get(apiUrl + 'movies', {headers: new HttpHeaders(
    {
      Authorization: 'Bearer ' + token,
    })}).pipe(
      catchError(this.handleError)
  );
}

  /**
   * Get one movies
   * @service GET request to the respective endpoint of apiUrl to get one movie
   * @function getOneMovie
   * @returns a object of one movie in json format
   */

getOneMovie(title:string): Observable<any> {
  const token = localStorage.getItem('token');
  return this.http.get(apiUrl + 'movies/' + title, {
    headers: new HttpHeaders({
      Authorization: 'Bearer ' + token,
    })
  }).pipe(catchError(this.handleError));
}


  /**
   * Get a director
   * @service GET request to the respective endpoint of apiUrl to get one director
   * @function getDirector
   * @returns a single object in JSON format
   */

getDirector(directorName:string): Observable<any> {
  const token = localStorage.getItem('token');
  return this.http.get(apiUrl + 'movies/directors/' + directorName, {
    headers: new HttpHeaders({
      Authorization: 'Bearer ' + token,
    })
  }).pipe(catchError(this.handleError));
}

  /**
   * Get a list of movies by genre
   * @service GET request to the respective endpoint of apiUrl to get a list of movies from the same genre
   * @function getGenre
   * @returns a list of movies with the genre selected in JSON format
   */

getGenre(genreName:string): Observable<any> {
  const token = localStorage.getItem('token');
  return this.http.get(apiUrl + 'movies/genres/' + genreName, {
    headers: new HttpHeaders({
      Authorization: 'Bearer ' + token,
    })
  }).pipe(catchError(this.handleError));
}
  /**
   * Get user info
   * @service GET request to the respective endpoint of apiUrl to get user info
   * @function getUser
   * @returns a user object in JSON format
   */

getUser(userName:string): Observable<any> {
  const token = localStorage.getItem('token');
  return this.http.get(apiUrl + 'users/' + userName, {
    headers: new HttpHeaders({
      Authorization: 'Bearer ' + token,
    })
  }).pipe(catchError(this.handleError));
}

  /**
   * Add movie to favorite list
   * @service POST request to the respective endpoint of apiUrl to add movie 
   * @function addMovieFavorites
   * @param {string} movieID
   * @returns updated user object with added movie in favorite movies array in JSON format
   */

addMovieFavorites(movieID:string): Observable<any> {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  user.FavoriteMovies.push(movieID);
  localStorage.setItem('user', JSON.stringify(user));

  return this.http.post(apiUrl + `users/${user.Username}/movies/${movieID}`, {}, {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    })
  }).pipe(catchError(this.handleError));
}

/**
   * Add movie to favorite list
   * @service DELETE request to the respective endpoint of apiUrl to add movie 
   * @function removeMovieFavorites
   * @param {string} movieID
   * @returns updated user object with removed movie in favorite movies array in JSON format
   */

removeMovieFavorites(movieID:string): Observable<any> {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const index = user.FavoriteMovies.indexOf(movieID);
  if (index >= 0) {
    user.FavoriteMovies.splice(index, 1);
  }
  localStorage.setItem('user', JSON.stringify(user));


  return this.http.delete(apiUrl + `users/${user.Username}/movies/${movieID}`, {
    headers: new HttpHeaders({
      Authorization: 'Bearer ' + token,
    })
  }).pipe(catchError(this.handleError));
}


 /**
   * Update user info
   * @service POST request to the respective endpoint of apiUrl to update user info
   * @function updateUser
   * @param {any} updatedInfo
   * @returns updated user object in JSON format
   */

updateUser(updatedUser: any): Observable<any> {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return this.http.put(apiUrl + `users/${user.Username}`, updatedUser, {
    headers: new HttpHeaders({
      Authorization: 'Bearer ' + token,
    })
  }).pipe(catchError(this.handleError));
}

 /**
   * Delete user
   * @service DELETE request to the respective endpoint of apiUrl to remove user 
   * @function deleteUser
   * @returns success message if user gets deleted from database 
   */

deleteUser(): Observable<any> {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return this.http.delete(apiUrl + `users/${user.Username}`, {
    headers: new HttpHeaders({
      Authorization: 'Bearer ' + token,
    })
  }).pipe(catchError(this.handleError));
}

isFavoriteMovie(movieID: string): boolean {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user.FavoriteMovies.indexOf(movieID) >= 0;

}

// Non-typed response extraction
private extractResponseData(res: Response): any {
  const body = res;
  return body || { };
 }
}
