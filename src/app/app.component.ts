import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { PoMenuItem, PoModalComponent, PoModalAction } from '@portinari/portinari-ui';
import { PoToolbarAction, PoToolbarProfile } from '@portinari/portinari-ui/';
import { AuthService } from './app.auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy{
  @ViewChild(PoModalComponent, { static: true }) poModal: PoModalComponent;

  private newAuth;
  private conectarJira;

  public title = 'Scrum Poker';
  private profActLogin: PoToolbarAction = { icon: 'po-icon-user', label: 'Login Jira', action: () => this.authService.openLoginJira() };
  private profActSair: PoToolbarAction =  {
    icon: 'po-icon-exit',
    label: 'Sair',
    type: 'danger',
    separator: true,
    action: () => this.authService.sairJira() };
  public profileActions: Array<PoToolbarAction> = [this.profActLogin];
  public profile: PoToolbarProfile  = {
    avatar: '',
    subtitle: '',
    title: ''
  };

  public opcModal: string;
  public titleModel: string;
  public primaryAction: PoModalAction;


  constructor(
    private authService: AuthService) {}

  ngOnInit() {
    this.newAuth = this.authService.emitirAuth.subscribe( (newProfile) => {
      this.profile = newProfile;
      if (this.profile.title > '') {
        this.profileActions = [this.profActSair];
        this.poModal.close();
      } else {
        this.profileActions = [this.profActLogin];
      }
    });

    this.conectarJira = this.authService.emitirConectarJira.subscribe( () => {
      this.openLogin()
    });
  }

  ngOnDestroy() {
    this.newAuth.unsubscribe();
    this.conectarJira.unsubscribe();
  }


  public menus: Array<PoMenuItem> = [
    { label: 'Início', link: '/', icon: 'home' },
    { label: 'Sobre', action: this.openModal, icon: 'user' }
  ];


  public openModal(): boolean {
    this.opcModal = 'contato';
    this.titleModel = 'Sobre';

    this.primaryAction = {
      action: () => {
        this.poModal.close();
      },
      label: 'Fechar'
    };

    this.poModal.open();
    return true;
  }

  public openLogin(): boolean {
    this.opcModal = 'loginJira';
    this.titleModel = 'Login Jira';

    this.primaryAction = {
      action: () => {
        this.conJira()
      },
      label: 'Conectar'
    };

    this.poModal.open();
    return true;
  }

  private conJira(): void {
    this.authService.conectarJira()
  }

}
