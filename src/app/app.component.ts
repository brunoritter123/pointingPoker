import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { PoMenuItem, PoModalComponent, PoModalAction } from '@portinari/portinari-ui';
import { PoToolbarAction, PoToolbarProfile } from '@portinari/portinari-ui/';
import { AuthService } from './app.auth.service';
import { EventEmitter } from 'protractor';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy{
  @ViewChild(PoModalComponent, { static: true }) poModal: PoModalComponent;

  public newAuth;
  public title = 'Scrum Poker';
  private profActLogin: PoToolbarAction = { icon: 'po-icon-user', label: 'Login Jira', action: () => this.authService.conectarJira() };
  private profActSair: PoToolbarAction =  {
    icon: 'po-icon-exit',
    label: 'Sair',
    type: 'danger',
    separator: true,
    action: () => console.log("sair") };
  public profileActions: Array<PoToolbarAction> = [this.profActLogin];
  public profile: PoToolbarProfile  = {
    avatar: '',
    subtitle: '',
    title: ''
  };

  constructor(
    private authService: AuthService) {}

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


  public menus: Array<PoMenuItem> = [
    { label: 'Início', link: '/', icon: 'home' },
    { label: 'Sobre', action: this.openModal, icon: 'user' }
  ];

  public primaryAction: PoModalAction = {
    action: () => {
      this.poModal.close();
    },
    label: 'Fechar'
  };

  public openModal(): boolean {
    this.poModal.open();
    return true;
  }

}
