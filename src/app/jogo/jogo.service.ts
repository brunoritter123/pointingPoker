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

  constructor( private authService: AuthService) { }

  setUser(idSala: string, userName: string, isJogador: boolean): void {
    this.userName = userName;
    this.isJogador = isJogador;
    this.idSala = idSala;
    this.socket.emit('add-user', this.idSala, this.myId, this.userName, this.isJogador, this.cartaSel);
  }

  sendVoto(carta: any) {
    this.socket.emit('add-voto', this.myId, carta);
  }

  isConnected(): string {
    const socketConnected = this.socket.connected;

    if (!this.conectado && socketConnected) {
      // Reconectou
      this.socket.emit('add-user', this.idSala, this.myId, this.userName, this.isJogador, this.cartaSel);
    }

    this.conectado = socketConnected;
    return this.myId;
  }

  getUsersConnect() {
    const observable = new Observable(observer => {
      this.socket.on('get-user', (data: Array < any > ) => {
        const users: Array < User > = new  Array < User >();

        data.forEach(d => {
          users.push( User.novo(d));
        });

        observer.next(users);
      });
      return () => {
        this.socket.emit('remove', this.idSala, this.myId);
        this.socket.disconnect();
      };
    });

    return observable;
  }

  sendRemove(idUser: string) {
    this.socket.emit('remove', this.idSala, idUser);
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
    this.socket.emit('reset', this.idSala);
  }
}
