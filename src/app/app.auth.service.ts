import {Injectable} from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class AuthService {
  public userAuth = false;
  public idSala: string;
  public isJogador: boolean;
  public id: string;
  public name: string;
  public email: string;
  public imageUrl: string;

  constructor(
   private cookieService: CookieService
  ) {
    this.getConfig()
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
    let txtAleatorio: string = '';

    for (let i = 0; i < txtTam; i++) {
      const pos = Math.floor(Math.random() * letras.length);
      txtAleatorio += letras.substring(pos, pos + 1);
    }

    return txtAleatorio;
  }
}
