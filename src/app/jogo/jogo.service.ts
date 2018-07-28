import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

export class JogoService {
  private url = 'http://localhost:5000';
  private socket;
  private userCon;

  sendVoto(voto: number) {
    this.socket.emit('add-voto', voto);
  }

  getVotos() {
    const observable = new Observable(observer => {
      this.socket = io(this.url);
      this.socket.on('get-votos', (data) => {
        observer.next(data);
      });
    });

    return observable;
  }

  getUsersConnect(user: string) {
    this.userCon = user;
    this.socket.emit('add-user', user);

    const observable = new Observable(observer => {
      this.socket = io(this.url);
      this.socket.on('get-user', (data: Array<any>) => {
        observer.next(data);
      });
      return () => {
        this.socket.emit('disconnect', this.userCon);
      };
    });

    return observable;
  }

}
