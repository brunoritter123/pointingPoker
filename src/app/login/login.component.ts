import { Component, AfterViewInit } from '@angular/core';
import { AuthService } from '../app.auth.service';

declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {

  constructor( private authService: AuthService) {
    gapi.load('auth2', function () {
        gapi.auth2.init();
     });
  }

 googleLogin() {
    const googleAuth = gapi.auth2.getAuthInstance();
    console.log('clicou');
    googleAuth.then(() => {
       googleAuth.signIn({scope: 'profile email'}).then(googleUser => {
          console.log(googleUser.getBasicProfile());
       });
    });
 }

}
