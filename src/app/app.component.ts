import { Component, ViewChild } from '@angular/core';
import { PoMenuItem, PoModalComponent, PoModalAction } from '@portinari/portinari-ui';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  @ViewChild(PoModalComponent, { static: true }) poModal: PoModalComponent;

  constructor() {}

  public title = 'Scrum Poker';

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
