import { Component, ViewChild } from '@angular/core';
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
export class AppComponent {
  @ViewChild(ThfModalComponent) thfModal: ThfModalComponent;

  constructor(private authService: AuthService) {}

  public title = 'Scrum Poker';
  public profile: ThfToolbarProfile  = {
    avatar: this.authService.imageUrl,
    subtitle: this.authService.email,
    title: this.authService.name
  };
  private profActLogin: ThfToolbarAction = { icon: 'thf-icon-login', label: 'Entrar', action: () => this.login() };
  private profActSair: ThfToolbarAction =  {
    icon: 'thf-icon-exit',
    label: 'Sair',
    type: 'danger',
    separator: true,
    action: () => this.sair() };

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

  private login(): void {
    this.authService.login( () => {
      const newProfile: ThfToolbarProfile  = {
        avatar: this.authService.imageUrl,
        subtitle: this.authService.email,
        title: this.authService.name
      };

      this.profile = newProfile;
      this.profileActions = [this.profActSair];
    });
  }

  private sair(): void {
    this.authService.sair();
    const newProfile: ThfToolbarProfile  = {
      avatar: '',
      subtitle: '',
      title: ''
    };
    this.profile = newProfile;

    this.profileActions = [this.profActLogin];
  }

}
