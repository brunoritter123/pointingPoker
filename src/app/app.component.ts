import { Component, ViewChild, NgZone, OnInit, OnDestroy } from '@angular/core';
import { ThfMenuItem } from '@totvs/thf-ui/components/thf-menu';
import { ThfModalComponent } from '@totvs/thf-ui/components/thf-modal/thf-modal.component';
import { ThfModalAction } from '@totvs/thf-ui/components/thf-modal';
import { ThfToolbarAction, ThfToolbarProfile } from '@totvs/thf-ui/components/thf-toolbar';
import { AuthService } from './app.auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild(ThfModalComponent) thfModal: ThfModalComponent;

  constructor(
    private authService: AuthService,
    private ngZone: NgZone) {}

  public newAuth;

  public title = 'Scrum Poker';
  public profile: ThfToolbarProfile  = {
    avatar: this.authService.imageUrl,
    subtitle: this.authService.email,
    title: this.authService.name
  };
  private profActLogin: ThfToolbarAction = { icon: 'thf-icon-login', label: 'Entrar', action: () => this.authService.login() };
  private profActSair: ThfToolbarAction =  {
    icon: 'thf-icon-exit',
    label: 'Sair',
    type: 'danger',
    separator: true,
    action: () => this.authService.sair() };

  public profileActions: Array<ThfToolbarAction> = [this.profActLogin];

  public menus: Array<ThfMenuItem> = [
    { label: 'Início', link: '/', icon: 'home' },
    { label: 'Sobre', action: this.openModal, icon: 'user' }
  ];

  public primaryAction: ThfModalAction = {
    action: () => {
      this.thfModal.close();
    },
    label: 'Fechar'
  };

  public openModal(): boolean {
    this.thfModal.open();
    return true;
  }

  ngOnInit() {
    this.newAuth = this.authService.emitirAuth.subscribe( (newProfile) => {
      this.profile = newProfile;
      if (this.profile.title > '') {
        this.profileActions = [this.profActSair];
      } else {
        this.profileActions = [this.profActLogin];
      }
    });
  }

  ngOnDestroy() {
    this.newAuth.unsubscribe();

  }

}
