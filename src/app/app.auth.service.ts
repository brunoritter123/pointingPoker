import {Injectable, EventEmitter, NgZone} from '@angular/core';
import {Router} from '@angular/router';
import { ThfToolbarProfile } from '../../node_modules/@totvs/thf-ui/components/thf-toolbar';
import { interval } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

declare const gapi: any;

@Injectable()
export class AuthService {
  public userAuth = false;
  public idSala: string;
  public isJogador: boolean;
  public id: string;
  public name: string;
  public email: string;
  public imageUrl: string;
  public emitirAuth = new EventEmitter<ThfToolbarProfile>();

  constructor(
   private router: Router,
   private ngZone: NgZone,
   private cookieService: CookieService
  ) {
    this.getConfig()
    /*
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
    */
  }


  public getConfig(): void {
    this.idSala = this.cookieService.get('idSala')
    this.name = this.cookieService.get('nome')
    this.isJogador = this.cookieService.get('isJogador') == 'true'

    if (!!this.idSala){
      if (this.cookieService.check(this.idSala.toUpperCase())) {
        this.id = this.cookieService.get(this.idSala.toUpperCase())
    
      } else {
        this.id = this.idSala.toUpperCase()+this.aleatorio(30)
        this.cookieService.set( this.idSala.toUpperCase(), this.id );
      }
    }
  }

  public saveConfig(idSala: string, nome: string, isJogador: boolean): void {
    this.idSala    = idSala
    this.name      = nome
    this.isJogador = isJogador
    this.cookieService.set( 'idSala', idSala );
    this.cookieService.set( 'nome', nome );
    this.cookieService.set( 'isJogador', isJogador.toString() );

    if (this.cookieService.check(idSala.toUpperCase())) {
      this.id = this.cookieService.get(idSala.toUpperCase())
  
    } else {
      this.id = idSala.toUpperCase()+this.aleatorio(25)
      this.cookieService.set( idSala.toUpperCase(), this.id );
    }
  }

  private aleatorio(txtTam: number): string {
    const letras = '1234567890abcdefghijlkmnopqtuvxywz';
    let txtAleatorio: string;

    for (let i = 0; i < txtTam; i++) {
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
