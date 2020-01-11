import { Injectable, EventEmitter } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PoToolbarProfile } from '@portinari/portinari-ui';
import { PoNotificationService } from '@portinari/portinari-ui';

@Injectable()
export class AuthService {
  public conectandoJira = false
  public idSala: string = '';
  public isJogador: boolean = true;
  public id: string = '';
  public name: string = '';
  public isIntegraJira: boolean = false;
  public baseUrlJira: string = '';
  public userJira: string = '';
  public passJira: string = '';
  public projetoJira: string = '';
  public jiraLoginOk: boolean = false;
  public httpOptions: any;
  public emitirAuth = new EventEmitter<PoToolbarProfile>();
  public emitirConectarJira = new EventEmitter<void>();
  public fieldStoryPoints: string = "";

  constructor(
    private cookieService: CookieService,
    private http: HttpClient,
    private poNotification: PoNotificationService
  ) {
    this.getConfig()
    this.poNotification.setDefaultDuration(5000)
  }

  public getAuthJiraCookie(): boolean {
    this.baseUrlJira = this.cookieService.get('baseUrlJira')
    this.userJira = this.cookieService.get('userJira')

    return !!this.baseUrlJira && !!this.userJira
  }

  public getConfig(): void {
    this.idSala = this.cookieService.get('idSala')
    this.name = this.cookieService.get('nome')
    this.isJogador = this.cookieService.get('isJogador') == 'true'
    this.isIntegraJira = this.cookieService.get('isIntegraJira') == 'true'
    this.baseUrlJira = this.cookieService.get('baseUrlJira')
    this.userJira = this.cookieService.get('userJira')
    this.projetoJira = this.cookieService.get('projetoJira')

    if (!!this.idSala) {
      if (this.cookieService.check(this.idSala.toUpperCase())) {
        this.id = this.cookieService.get(this.idSala.toUpperCase())

      } else {
        this.id = this.idSala.toUpperCase() + this.aleatorio(30)
        this.cookieService.set(this.idSala.toUpperCase(), this.id);
      }
    }
  }

  private parseBaseUrl() {
    if (!this.baseUrlJira.match(/^http/i)) {
      this.baseUrlJira = 'https://' + this.baseUrlJira
    }
    this.baseUrlJira = this.baseUrlJira.replace(new RegExp("/$", ""), "")
    this.baseUrlJira = this.baseUrlJira.replace(/www./i, "")
  }

  public conectarJira(): Promise<any> {
    this.conectandoJira = true;
    this.parseBaseUrl()

    if (!this.userJira || !this.passJira || !this.baseUrlJira) {
      this.poNotification.warning("Informe todos os campos.")
      return new Promise((resolve, reject) => {
        this.conectandoJira = false;
        return false
      });
    }

    this.httpOptions = {
      headers: new HttpHeaders({
        'Base-Url': this.baseUrlJira,
        'Authorization': `Basic ${btoa(this.userJira + ':' + this.passJira)}`
      })
    };

    return this.http.get('/api/jira/rest/api/2/user?username=' + this.userJira, this.httpOptions)
      .toPromise()
      .then((resp: any) => {

        this.emitirAuth.emit(this.getProfile(
          resp.avatarUrls["32x32"],
          'Conectado no Jira',
          resp.displayName
        ));

        this.cookieService.set('baseUrlJira', this.baseUrlJira, new Date(2100, 1, 1));
        this.cookieService.set('userJira', this.userJira, new Date(2100, 1, 1));
        this.passJira = '';
        this.jiraLoginOk = true;

        this.poNotification.success("Conectado.!")
        this.conectandoJira = false;
        this.getFieldStoryPoints()

        return true
      })
      .catch(err => {
        console.error(err)

        if (err.status == 401) {
          this.poNotification.warning("Acesso não autorizado.")
        } else {
          this.poNotification.error("Erro ao tentar conectar.")
        }

        this.conectandoJira = false;
        return false
      })
  }

  private getFieldStoryPoints() {
    return this.http.get('/api/jira/rest/api/2/field', this.httpOptions)
      .toPromise()
      .then((resp: any) => {
        const fieldStoryPoints = resp.find(field => field.name == 'Story Points')

        if (!!fieldStoryPoints) {
          this.fieldStoryPoints = fieldStoryPoints.id
        }

        return this.fieldStoryPoints
      })
      .catch(err => {
        console.error(err)
        throw err
      })
  }

  public getProfile(imageUrl: string, subtitle: string, name: string): PoToolbarProfile {
    const newProfile: PoToolbarProfile = {
      avatar: imageUrl,
      subtitle: subtitle,
      title: name
    };
    return newProfile;
  }

  public saveConfig(idSala: string, nome: string, isJogador: boolean, isIntegraJira: boolean): void {
    const dtExpires = new Date(2100, 1, 1)
    this.idSala = idSala
    this.name = nome
    this.isJogador = isJogador
    this.isIntegraJira = isIntegraJira
    this.cookieService.set('idSala', idSala, dtExpires);
    this.cookieService.set('nome', nome, dtExpires);
    this.cookieService.set('isJogador', isJogador.toString(), dtExpires);
    this.cookieService.set('isIntegraJira', isIntegraJira.toString(), dtExpires);

    if (this.cookieService.check(idSala.toUpperCase())) {
      this.id = this.cookieService.get(idSala.toUpperCase())

    } else {
      this.id = idSala.toUpperCase() + this.aleatorio(25)
      this.cookieService.set(idSala.toUpperCase(), this.id, dtExpires);
    }
  }

  private aleatorio(txtTam: number): string {
    const letras = '1234567890abcdefghijlkmnopqtuvxywz';
    let txtAleatorio: string = '';

    for (let i = 0; i < txtTam; i++) {
      const pos = Math.floor(Math.random() * letras.length);
      txtAleatorio += letras.substring(pos, pos + 1);
    }

    return txtAleatorio;
  }

  public openLoginJira(): void {
    if (!this.jiraLoginOk) {
      this.emitirConectarJira.emit()
    }
  }

  public sairJira(): void {
    const newProfile: PoToolbarProfile = {
      avatar: '',
      subtitle: '',
      title: ''
    };

    this.jiraLoginOk = false;
    this.httpOptions = {
      headers: new HttpHeaders({
        'Base-Url': '',
        'Authorization': ''
      })
    };
    this.emitirAuth.emit(newProfile)
  }

  public setProjetoCookie(projetoJira: string) {
    this.cookieService.set('projetoJira', projetoJira, new Date(2100, 1, 1))
  }
}
