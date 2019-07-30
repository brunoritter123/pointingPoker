import { Component } from '@angular/core';

@Component({
  selector: 'app-contato',
  templateUrl: './contato.component.html',
  styleUrls: ['./contato.component.css']
})
export class ContatoComponent {

  public contact = {
    name: 'Bruno de Lima Ritter',
    email: 'brunolritter123@gmail.com'
  };

  sendContact(email) {
    window.open(`mailto:${email}`, '_self');
  }

  apoiar() {
    window.open('https://github.com/brunoritter123/pointingPoker', '_blank');
  }

}
