import {Observable} from 'rxjs/Observable';
import * as io from 'socket.io-client';
import { User } from '../models/user.model';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Carta } from '../models/carta.model';
import { AuthService } from '../app.auth.service';

@Injectable()
export class JogoService {
  public myId = this.authService.id;
  public cartaSel: Carta;
  public iAmOn: boolean = false;

  private readonly url = environment.API;

  private socket = io(this.url, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax : 5000,
    reconnectionAttempts: Infinity
  } );
  private userName: string;
  private isJogador: boolean;
  private conectado = true;
  private idSala = '';
  private timeUltEnvio: number = 0;
  private timeDesconect: number = new Date().getTime();

  constructor( private authService: AuthService) { }

  setUser(idSala: string, userName: string, isJogador: boolean): void {
    this.userName = userName;
    this.isJogador = isJogador;
    this.idSala = idSala;
    let dt
    this.socket.emit('add-user', this.idSala, this.myId, this.userName, this.isJogador, this.cartaSel, new Date().getTime());
  }

  sendVoto(carta: any) {
    this.socket.emit('add-voto', this.myId, carta, new Date().getTime());
  }

  isConnected(): boolean {
    const socketConnected = this.socket.connected;

    if (!socketConnected) {
      this.timeDesconect = new Date().getTime();
    }

    if (!this.conectado && socketConnected) {
      // Reconectou
      this.socket.emit('add-user', this.idSala, this.myId, this.userName, this.isJogador, this.cartaSel, new Date().getTime());
    }

    this.conectado = socketConnected;
    return this.conectado;
  }

  getUsersConnect() {
    let iAmOn: boolean = false;
    const observable = new Observable(observer => {
      this.socket.on('get-user', (ret: any ) => {
        let timeEnvio: number = ret.timeEnvio;
        let data: any = ret.users;

        if (this.timeUltEnvio <= timeEnvio) {
          this.timeUltEnvio = timeEnvio;
          const users: Array < User > = new  Array < User >();

          data.forEach(d => {
            if (this.myId == d.idUser) {
              iAmOn = true;
            }
            users.push( User.novo(d));
          });
          
          this.iAmOn = iAmOn;
          observer.next(users);
        }
      });
      return () => {
        this.socket.emit('remove', this.idSala, this.myId, new Date().getTime());
        this.socket.disconnect();
      };
    });

    return observable;
  }

  sendRemove(idUser: string) {
    this.socket.emit('remove', this.idSala, idUser, new Date().getTime());
  }

  getSala() {
    const observable = new Observable(observer => {
      this.socket.on('get-sala', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }

  getFimJogo() {
    const observable = new Observable(observer => {
      this.socket.on('get-FimJogo', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }

  sendUpdateSala(configSala) {
    this.socket.emit('update-sala', configSala);
  }

  sendReset() {
    this.socket.emit('reset', this.idSala, new Date().getTime());
  }

  isSincronizando(): boolean {
    return !this.isConnected() || !this.iAmOn || this.timeUltEnvio < this.timeDesconect;
  }
}
