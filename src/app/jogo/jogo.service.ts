import {Observable} from 'rxjs';
import * as io from 'socket.io-client';
import { User } from '../models/user.model';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Carta } from '../models/carta.model';
import { Sala } from '../models/sala.model';
import { AuthService } from '../app.auth.service';
import { AcoesSala } from '../models/acoesSala.model';

@Injectable()
export class JogoService {
  public myId = this.authService.id;
  public cartaSel: Carta;
  public iAmOn = false;

  private readonly url = environment.API;

  private socket = io(this.url, {
    transports: ['websocket'],
    upgrade: false,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax : 5000,
    reconnectionAttempts: Infinity
  }, {
    'force new connection': true
  } );
  private userName: string;
  private isJogador: boolean;
  private conectado = true;
  private idSala = '';
  private timeUltEnvio = 0;
  private timeDesconect: number = new Date().getTime();
  public isConfiguracao: boolean ;

  constructor( private authService: AuthService) { }

  setUser(idSala: string, userName: string, isJogador: boolean): void {
    this.userName = userName;
    this.isJogador = isJogador;
    this.idSala = idSala;
    this.socket.emit('add-user', this.idSala, this.myId, this.userName, this.isJogador, this.cartaSel, new Date().getTime());
  }

  sendVoto(carta: any) {
    this.socket.emit('add-voto', this.myId, carta, this.idSala, new Date().getTime());
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
    let iAmOn = false;
    const observable = new Observable(observer => {
      this.socket.on('get-user', (ret: any ) => {
        const timeEnvio: number = ret.timeEnvio;
        const data: any = ret.users;

        if (this.timeUltEnvio <= timeEnvio) {
          this.timeUltEnvio = timeEnvio;
        }

        const users: Array < User > = new  Array < User >();

        data.forEach(d => {
          if (this.myId === d.idUser) {
            iAmOn = true;
          }
          users.push( User.novo(d));
        });

        this.iAmOn = iAmOn;
        observer.next(users);
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

  setCarta(carta: Carta): void {
    this.socket.emit('concluir', this.idSala, carta, new Date().getTime());
  }

  setNmHistoria(nmHistoria: string): void {
    this.socket.emit('update-historia', this.idSala, nmHistoria, new Date().getTime());
  }

  getCarta() {
    const observable = new Observable(observer => {
      this.socket.on('get-carta', (data) => {
        observer.next(data);
      });
    });
    return observable;
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

  sendUpdateSala(configSala, isUpdConfig = false) {
    this.socket.emit('update-sala', this.myId, this.userName, isUpdConfig, configSala, new Date().getTime());
  }

  sendReset() {
    this.socket.emit('reset', this.idSala, new Date().getTime());
  }

  isSincronizando(): boolean {
    return !this.isConnected() || !this.iAmOn || this.timeUltEnvio < this.timeDesconect;
  }

  public isPodeExcAcao(acao: string, isJogador: boolean , adms: Array<User>): boolean {
    let ok: boolean = adms.length == 0 || acao == '3'

    if (!ok) {
      ok = (isJogador && acao == '2') || (!isJogador && acao == '1')
    }

    return ok;
  };
}
