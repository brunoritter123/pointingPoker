import { Http, Response } from '@angular/http';
import {Observable} from 'rxjs/Observable';
import * as io from 'socket.io-client';
import { User } from '../models/user.model';
import { Injectable } from '@angular/core';

@Injectable()
export class JogoService {
  // private url = 'http://192.168.25.47:3000';
  // private url = 'http://10.172.14.46:3000';
  // private url = 'http://www.scrumpoker.com.br:80';
  private url = 'localhost:3005';

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

  constructor(
    private _http: Http
  ) { }

  setUser(idSala: string, userName: string, isJogador: boolean): void {
    this._http.get('https://api.ipify.org?format=json')
    .toPromise()
    .then( (res: Response) => {
      this.myId = res.json().ip;
      this.userName = userName;
      this.isJogador = isJogador;
      this.idSala = idSala;
      this.socket.emit('add-user', this.idSala, this.myId, this.userName, this.isJogador);
      console.log(this.myId);
    });
  }

  sendVoto(carta: any) {
    this.socket.emit('add-voto', carta);
  }

  isConnected(): string {
    const socketConnected = this.socket.connected;

    if (!this.conectado && socketConnected) {
      // Reconectou
      this.socket.emit('add-user', this.idSala, this.myId, this.userName, this.isJogador, this.myId);
    }

    if (socketConnected) {
      this.myId = this.socket.io.engine.id;
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
        this.socket.emit('remove');
        this.socket.disconnect();
      };
    });

    return observable;
  }

  getCartas() {
    this.socket.emit('obs-cartas');

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
    this.socket.emit('add-FimJogo', true);
  }

  sendReset() {
    this.socket.emit('add-FimJogo', false);
  }

  getIp() {
    let idUser: string;
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', 'https://api.ipify.org?format=json');
    xmlhttp.send();
    xmlhttp.onload = function(e) {
      idUser = JSON.parse(xmlhttp.response);
      console.log(idUser);
    };
    console.log(idUser);
    return idUser;
  }
}
