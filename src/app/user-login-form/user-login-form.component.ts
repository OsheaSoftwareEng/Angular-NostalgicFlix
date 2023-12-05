
// src/app/user-registration-form/user-registration-form.component.ts
import { Component, OnInit, Input } from '@angular/core';

// You'll use this import to close the dialog on success
import { MatDialogRef } from '@angular/material/dialog';

// This import brings in the API calls
import { FetchApiDataService } from '../fetch-api-data.service';

// This import is used to display notifications back to the user
import { MatSnackBar } from '@angular/material/snack-bar';

import { Router } from '@angular/router';


@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss']
})


export class UserLoginFormComponent implements OnInit {
  @Input() userData = { Username: '', Password: '' };

  

  constructor(
      public fetchApiData: FetchApiDataService,
      public dialogRef: MatDialogRef<UserLoginFormComponent>,
      public router: Router,
      public snackBar: MatSnackBar) { }
  
  ngOnInit(): void {
  }

  // This is the function responsible for sending the form inputs to the backend
loginUser(): void {
  this.fetchApiData.userLogin(this.userData).subscribe((result) => {
// Logic for a successful user registration goes here! (To be implemented)
   this.dialogRef.close(); // This will close the modal on success!
   console.log(result);
   this.snackBar.open('You were successfully logged in!', 'OK', {
      duration: 2000
   });

   //storing the users information to the local storage 
   localStorage.setItem('user', JSON.stringify(result.user));
   localStorage.setItem('token', result.token);
   this.router.navigate(['movies']);
   console.log(localStorage);


  }, (result) => {
    console.log(result);
    this.snackBar.open(result, 'OK', {
      duration: 2000
    });
  });
 }
}
