import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { PoMenuItem, PoModalComponent, PoModalAction } from '@portinari/portinari-ui';
import { PoToolbarAction, PoToolbarProfile } from '@portinari/portinari-ui/';
import { AuthService } from './app.auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('modalJira', { static: true }) modalJira: PoModalComponent;
  @ViewChild('modalSobre', { static: true }) modalSobre: PoModalComponent;

  private newAuth;
  private conectarJira;

  public title = 'Scrum Poker';
  private profActLogin: PoToolbarAction = { icon: 'po-icon-user', label: 'Login Jira', action: () => this.authService.openLoginJira() };
  private profActSair: PoToolbarAction = {
    icon: 'po-icon-exit',
    label: 'Sair',
    type: 'danger',
    separator: true,
    action: () => this.authService.sairJira()
  };
  public profileActions: Array<PoToolbarAction> = [this.profActLogin];
  public profile: PoToolbarProfile = {
    avatar: '',
    subtitle: '',
    title: ''
  };

  public primaryActionJira: PoModalAction = {
    action: () => {
      this.conJira()
    },
    label: 'Conectar'
  };

  public primaryActionSobre: PoModalAction = {
    action: () => {
      this.modalSobre.close()
    },
    label: 'Fechar'
  };

  public secondaryActionJira: PoModalAction = {
    action: () => {
      this.modalJira.close()
    },
    label: 'Cancelar'
  }


  constructor(
    private authService: AuthService) { }

  ngOnInit() {
    this.newAuth = this.authService.emitirAuth.subscribe((newProfile) => {
      this.profile = newProfile;
      if (this.profile.title > '') {
        this.profileActions = [this.profActSair];
        this.modalJira.close();
      } else {
        this.profileActions = [this.profActLogin];
      }
    });

    this.conectarJira = this.authService.emitirConectarJira.subscribe(() => {
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
    this.modalSobre.open();
    return true;
  }

  public openLogin(): boolean {
    this.modalJira.open();
    return true;
  }

  private conJira(): void {
    this.authService.conectarJira()
  }

}
