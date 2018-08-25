import {Observable} from 'rxjs/Observable';
import * as io from 'socket.io-client';
import { User } from '../models/user.model';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable()
export class JogoService {
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

  public myId: string;

  constructor( ) { }


  public setMyId(myId: string): void {
    this.myId = myId;
  }

  setUser(idSala: string, userName: string, isJogador: boolean): void {
    this.userName = userName;
    this.isJogador = isJogador;
    this.idSala = idSala;
    this.socket.emit('add-user', this.idSala, this.myId, this.userName, this.isJogador);
  }

  sendVoto(carta: any) {
    this.socket.emit('add-voto', this.myId, carta);
  }

  isConnected(): string {
    const socketConnected = this.socket.connected;

    if (!this.conectado && socketConnected) {
      // Reconectou
      this.socket.emit('add-user', this.idSala, this.myId, this.userName, this.isJogador, this.myId);
    }

    this.conectado = socketConnected;
    return this.myId;
  }

  getUsersConnect() {
    const observable = new Observable(observer => {
      this.socket.on('get-user', (data: Array < User > ) => {
        observer.next(data);
      });
      return () => {
        this.socket.emit('remove', this.idSala, this.myId);
        this.socket.disconnect();
      };
    });

    return observable;
  }

  getCartas() {
    this.socket.emit('obs-cartas', this.idSala);

    const observable = new Observable(observer => {
      this.socket.on('get-cartas', (data) => {
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

  sendFimJogo() {
    this.socket.emit('fimJogo', this.idSala);
  }

  sendReset() {
    this.socket.emit('reset', this.idSala);
  }
}
