import { Component } from '@angular/core';

@Component({
  selector: 'app-contato',
  templateUrl: './contato.component.html',
  styleUrls: ['./contato.component.css']
})
export class ContatoComponent {

  public contact = {
    name: 'Bruno de Lima Ritter',
    email: 'contato@scrumpoker.com.br'
  };

  sendContact(email) {
    window.open(`mailto:${email}`, '_self');
  }

  apoiar() {
    window.open('https://apoia.se/scrum-poker', '_blank');
  }

}
