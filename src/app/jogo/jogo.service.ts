import { Observable } from 'rxjs';
import * as io from 'socket.io-client';
import { User } from '../models/user.model';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Carta } from '../models/carta.model';
import { AuthService } from '../app.auth.service';
import { HttpClient } from '@angular/common/http';
import { PoNotificationService } from '@portinari/portinari-ui';
import { Issue } from '../models/issue.model';
import { Board } from '../models/board.model';
import { Sprint } from '../models/sprint.model';

@Injectable()
export class JogoService {
  public myId = this.authService.id;
  public cartaSel: Carta;
  public iAmOn = false;

  private readonly url = environment.API;

  private socket = io(this.url, {
    transports: ['polling'],
    upgrade: false,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: Infinity
  }, {
    'force new connection': true
  });
  private userName: string;
  private isJogador: boolean;
  private conectado = true;
  private idSala = '';
  private timeUltEnvio = 0;
  private timeDesconect: number = new Date().getTime();
  public isConfiguracao: boolean;

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private poNotification: PoNotificationService) { }

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
      this.socket.on('get-user', (ret: any) => {
        const timeEnvio: number = ret.timeEnvio;
        const data: any = ret.users;

        if (this.timeUltEnvio <= timeEnvio) {
          this.timeUltEnvio = timeEnvio;
        }

        const users: Array<User> = new Array<User>();

        data.forEach(d => {
          if (this.myId === d.idUser) {
            iAmOn = true;
          }
          users.push(User.novo(d));
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

  public isPodeExcAcao(acao: string, isJogador: boolean, adms: Array<User>): boolean {
    let ok: boolean = adms.length == 0 || acao == '3'

    if (!ok) {
      ok = (isJogador && acao == '2') || (!isJogador && acao == '1')
    }

    return ok;
  };

  public getIssueJira(idIssue: string): Promise<any> {
    return this.http.get('/api/jira/rest/api/2/issue/' + idIssue, this.authService.httpOptions)
      .toPromise()
      .then((resp: any) => {
        return resp.fields.summary
      })
      .catch(err => {
        console.error(err)

        if (err.status == 401) {
          this.poNotification.warning("Acesso não autorizado.")
          this.authService.openLoginJira()
        } else if (err.status == 404) {
          this.poNotification.warning(`Issue: '${idIssue}' não encontrada.`)
        } else {
          this.poNotification.error("Sem resposta do servidor.")
        }

        throw err;
      })
  }

  public sendStoryPoints(idIssue: string, point: string): Promise<any> {
    let naoExecutado = { ok: false }

    if (!idIssue || !this.authService.fieldStoryPoints) return Promise.resolve(naoExecutado)

    const pointInt = parseInt(point)
    if (!pointInt && pointInt != 0) return Promise.resolve(naoExecutado)

    const body = `{
      "fields": {
        "${this.authService.fieldStoryPoints}": ${pointInt}
      }
    }`

    return this.http.put('/api/jira/rest/api/2/issue/' + idIssue, JSON.parse(body), this.authService.httpOptions)
      .toPromise()
      .then((resp: any) => {
        this.poNotification.success(`Issue: '${idIssue}' teve sua pontuação alterada para: ${point}`)
        return { ok: true, idIssue: idIssue, voto: pointInt }
      })
      .catch(err => {
        console.error(err)

        if (err.status == 401) {
          this.poNotification.warning("Acesso não autorizado.")
          this.authService.openLoginJira()
        } else if (err.status == 404) {
          this.poNotification.warning(`Issue: '${idIssue}' não foi encontrada.`)
        } else {
          this.poNotification.error("Sem resposta do servidor.")
        }

        return naoExecutado
      })
  }

  public getSprintJira(board: string): Promise<Array<Sprint>> {

    return this.http.get(`/api/jira/rest/agile/1.0/board/${board}/sprint?state=future`, this.authService.httpOptions)
      .toPromise()
      .then((resp: any) => {
        let listaSprint: Array<Sprint> = []

        resp.values.forEach(sprint => {
          listaSprint.push(new Sprint(sprint.id, sprint.name))
        });

        if (listaSprint.length == 0) {
          this.poNotification.warning('Nenhuma Sprint encontrada para o Board selecionado.')
        }
        return listaSprint
      })
      .catch(err => {
        console.error(err)

        if (err.status == 401) {
          this.poNotification.warning("Acesso não autorizado.")
          this.authService.openLoginJira()
        } else if (err.status == 404) {
          this.poNotification.warning('Nenhuma Sprint encontrada para o Board selecionado.')
        } else {
          this.poNotification.error("Sem resposta do servidor.")
        }

        throw err;
      })
  }

  public getBoardJira(projeto: string): Promise<Array<Board>> {
    return this.http.get('/api/jira/rest/agile/1.0/board?type=scrum&projectKeyOrId=' + projeto.toUpperCase(), this.authService.httpOptions)
      .toPromise()
      .then(rest => {
        let boards: Array<Board> = []
        rest['values'].forEach(board => {
          boards.push(new Board(board.id, board.name))
        });

        if (boards.length == 0) {
          this.poNotification.warning('Nenhum Board encontrado para o projeto selecionado.')
        }
        return boards
      })
      .catch(err => {
        console.error(err)

        if (err.status == 401) {
          this.poNotification.warning("Acesso não autorizado.")
          this.authService.openLoginJira()
        } else {
          this.poNotification.warning("Nenhum Board encontrado para o projeto selecionado.")
        }

        throw err;
      })
  }

  public listaIssueJira(sprint: string): Promise<Array<Issue>> {
    let filtro = `Sprint=${sprint} ORDER BY Rank`

    return this.http.get('/api/jira/rest/api/2/search?jql=' + filtro, this.authService.httpOptions)
      .toPromise()
      .then((resp: any) => {
        let listaIssue = []

        resp.issues.forEach(issue => {
          if (!issue.fields.issuetype.subtask) {
            issue = new Issue(issue.key, issue.fields.summary, issue.fields[this.authService.fieldStoryPoints])
            listaIssue.push(issue)
          }
        });

        if (listaIssue.length == 0) {
          this.poNotification.warning('Nenhuma Issue encontra para o filtro.')
        }

        return listaIssue
      })
      .catch(err => {
        console.error(err)

        if (err.status == 401) {
          this.poNotification.warning("Acesso não autorizado.")
          this.authService.openLoginJira()
        } else if (err.status == 404) {
          this.poNotification.warning('Nenhuma Issue encontra para o filtro.')
        } else {
          this.poNotification.error("Sem resposta do servidor.")
        }

        throw err;
      })
  }
}
