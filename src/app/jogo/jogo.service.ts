import {Observable} from 'rxjs/Observable';
import * as io from 'socket.io-client';
import { User } from '../models/user.model';

export class JogoService {
  // private url = 'http://192.168.25.47:3000';
  private url = 'http://www.scrumpoker.com.br:80';
  // private url = 'localhost:3000';
  private socket = io(this.url, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax : 5000,
    reconnectionAttempts: Infinity
  } );
  private userName: string;
  private isJogador: boolean;
  private myIp: string;
  private conectado = true;

  setUser(userName: string, isJogador: boolean): void {
    this.userName = userName;
    this.isJogador = isJogador;
    this.socket.emit('add-user', this.userName, this.isJogador);
  }

  sendVoto(carta: any) {
    this.socket.emit('add-voto', carta);
  }

  isConnected(): boolean {
    if (this.conectado !== this.socket.connected) {
      if (this.socket.connected) {
        // Reconectou
        this.socket.emit('add-user', this.userName, this.isJogador);
      }
    }
    this.conectado = this.socket.connected;
    return this.conectado;
  }

  getUsersConnect() {
    const observable = new Observable(observer => {
      this.socket.on('get-user', (data: Array < User > ) => {
        data.forEach(us => {
          if (us.socket === this.socket.id) {
            this.myIp = us.id;
          }
        });
        observer.next(data);
      });
      return () => {
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

}
