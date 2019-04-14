import {Injectable, EventEmitter, NgZone} from '@angular/core';
import {Router} from '@angular/router';
import { ThfToolbarProfile } from '../../node_modules/@totvs/thf-ui/components/thf-toolbar';
import { interval } from 'rxjs';

declare const gapi: any;

@Injectable()
export class AuthService {
  public userAuth = false;
  public id: string;
  public name: string;
  public email: string;
  public imageUrl: string;
  public emitirAuth = new EventEmitter<ThfToolbarProfile>();

  constructor(
   private router: Router,
   private ngZone: NgZone
  ) {
    const testGapi = interval(1000);
    const testGapiSub = testGapi.subscribe(() => {
      if (gapi !== undefined) {
          gapi.load('auth2', function () {
          gapi.auth2.init();
          testGapiSub.unsubscribe();
        });
      }
    });

    const testLoad = interval(500);
    const testLoadSub = testLoad.subscribe(() => {
      if (gapi.hasOwnProperty('auth2')) {
        this.load();
        testLoadSub.unsubscribe();
      }
    });
  }

  private aleatorio(): string {
    const letras = '1234567890abcdefghijlkmnopqtuvxywz';
    let txtAleatorio: string;

    for (let i = 0; i < 20; i++) {
      const pos = Math.floor(Math.random() * letras.length);
      txtAleatorio += letras.substring(pos, pos + 1);
    }

    return txtAleatorio;
  }

  public load(): void {
    const googleUser = gapi.auth2.getAuthInstance().currentUser.get();
    googleUser.reloadAuthResponse().then( () => {
      const gbProfile = googleUser.getBasicProfile();
      this.id = 'google' + gbProfile.getId();
      this.name = gbProfile.getName();
      this.email = gbProfile.getEmail();
      this.imageUrl = gbProfile.getImageUrl();

      this.ngZone.run( () => {
        this.emitirAuth.emit(this.getProfile());
      });
    });
  }

  public getProfile(): ThfToolbarProfile {
    const newProfile: ThfToolbarProfile  = {
      avatar: this.imageUrl,
      subtitle: this.email,
      title: this.name
    };

    return newProfile;
  }

  public login(): void {
    const googleAuth = gapi.auth2.getAuthInstance();
    googleAuth.then(() => {
       googleAuth.signIn({scope: 'profile email'}).then(googleUser => {
          const gbProfile = googleUser.getBasicProfile();
          this.id = 'google' + gbProfile.getId();
          this.name = gbProfile.getName();
          this.email = gbProfile.getEmail();
          this.imageUrl = gbProfile.getImageUrl();

          this.ngZone.run( () => {
            this.emitirAuth.emit(this.getProfile());
          });
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
      this.ngZone.run( () => {
        this.emitirAuth.emit(this.getProfile());
      });
    });
  }
}
