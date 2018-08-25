import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

declare const gapi: any;

@Injectable()
export class AuthService {
  public userAuth = false;
  public id: string;
  public name: string;
  public email: string;
  public imageUrl: string;
  public token: string;

  constructor(
   private router: Router
  ) {
    gapi.load('auth2', function () {
      gapi.auth2.init();
   });

  }

  public login( callback: Function): void {
    const googleAuth = gapi.auth2.getAuthInstance();
    googleAuth.then(() => {
       googleAuth.signIn({scope: 'profile email'}).then(googleUser => {
          const gbProfile = googleUser.getBasicProfile();
          this.id = 'google' + gbProfile.getId();
          this.name = gbProfile.getName();
          this.email = gbProfile.getEmail();
          this.imageUrl = gbProfile.getImageUrl();

          callback();
       });
    });
  }

  public sair() {
    const googleAuth = gapi.auth2.getAuthInstance();
    googleAuth.then( () => {
    googleAuth.disconnect();
    this.id = undefined;
    this.name = undefined;
    this.email = undefined;
    this.imageUrl = undefined;
    this.router.navigate(['/']);
    });
  }
}
