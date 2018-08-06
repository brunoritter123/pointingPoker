import {Observable} from 'rxjs/Observable';
import * as io from 'socket.io-client';

export class JogoService {
  private url = 'http://10.172.14.46:3000';
  // private url = 'http://www.scrumpoker.com.br:80';
  // private url = 'localhost:3000';
  private socket = io(this.url, {reconnection: false});
  private userName: string;

  setUserName(userName: string): void {
    this.userName = userName;
    this.socket.emit('add-user', this.userName, this.socket.id);
  }

  sendVoto(carta: any) {
    this.socket.emit('add-voto', carta);
  }

  isConnected(): boolean {
    return this.socket.connected;
  }

  getUsersConnect() {
    const observable = new Observable(observer => {
      this.socket.on('get-user', (data: Array < any > ) => {
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
