import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

export class JogoService {
  private url = 'http://www.scrumpoker.com.br:80';
  private socket = io(this.url);

  sendVoto(carta: any) {
    this.socket.emit('add-voto', carta);
  }

  getUsersConnect(user: string) {
    this.socket.emit('add-user', user);

    const observable = new Observable(observer => {
      this.socket.on('get-user', (data: Array<any>) => {
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