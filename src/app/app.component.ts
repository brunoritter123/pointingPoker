import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  menus = [
    { label: 'Início', link: '/', icon: 'home' }
  ];

  title = 'Point Poker';
}
