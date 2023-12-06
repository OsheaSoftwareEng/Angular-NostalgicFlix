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
 // Making the api call for the user registration endpoint
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
  
  //Making an api call for users to login
  public userLogin(userDetails: any): Observable<any> {
    return this.http.post(apiUrl + 'login', userDetails).pipe(
      catchError(this.handleError)
    );
  };


  //Api call to get all movies
getAllMovies(): Observable<any> {
  const token = localStorage.getItem('token');
  return this.http.get(apiUrl + 'movies', {headers: new HttpHeaders(
    {
      Authorization: 'Bearer ' + token,
    })}).pipe(
      catchError(this.handleError)
  );
}

//Api call to get one movie by title endpoint
getOneMovie(title:string): Observable<any> {
  const token = localStorage.getItem('token');
  return this.http.get(apiUrl + 'movies/' + title, {
    headers: new HttpHeaders({
      Authorization: 'Bearer ' + token,
    })
  }).pipe(catchError(this.handleError));
}

//Api call to get a director 
getDirector(directorName:string): Observable<any> {
  const token = localStorage.getItem('token');
  return this.http.get(apiUrl + 'movies/directors/' + directorName, {
    headers: new HttpHeaders({
      Authorization: 'Bearer ' + token,
    })
  }).pipe(catchError(this.handleError));
}

//Api call to get one genre endpoint 
getGenre(genreName:string): Observable<any> {
  const token = localStorage.getItem('token');
  return this.http.get(apiUrl + 'movies/genres/' + genreName, {
    headers: new HttpHeaders({
      Authorization: 'Bearer ' + token,
    })
  }).pipe(catchError(this.handleError));
}

//Api call to get user by username and the data for the users info and favorite movies the user has.
getUser(userName:string): Observable<any> {
  const token = localStorage.getItem('token');
  return this.http.get(apiUrl + 'users/' + userName, {
    headers: new HttpHeaders({
      Authorization: 'Bearer ' + token,
    })
  }).pipe(catchError(this.handleError));
}

//Api call to add movies to favorites
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

//Api call to remove a movie from favorite
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

//Api call to update users information
updateUser(updatedUser: any): Observable<any> {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return this.http.put(apiUrl + `users/${user.Username}`, updatedUser, {
    headers: new HttpHeaders({
      Authorization: 'Bearer ' + token,
    })
  }).pipe(catchError(this.handleError));
}

//Api call to delete a user
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
