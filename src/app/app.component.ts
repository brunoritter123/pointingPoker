import { Component, ViewChild } from '@angular/core';
import { ThfMenuItem, ThfModalComponent, ThfModalAction } from '@totvs/thf-ui';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  @ViewChild(ThfModalComponent, { static: true }) thfModal: ThfModalComponent;

  constructor() {}

  public title = 'Scrum Poker';

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

}
