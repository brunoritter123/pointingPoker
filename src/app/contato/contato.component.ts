import { Component } from '@angular/core';

@Component({
  selector: 'app-contato',
  templateUrl: './contato.component.html',
  styleUrls: ['./contato.component.css']
})
export class ContatoComponent {

  public contact = {
    name: 'Bruno de Lima Ritter',
    email: 'bruno@scrumpoker.com.br',
    phone: '11980875041'
  };

  callContact(phone) {
    window.open(`tel:${phone}`, '_self');
  }

  sendContact(email) {
    window.open(`mailto:${email}`, '_self');
  }

  formatPhoneNumber(phone) {
    return `(${phone.substring(0, 2)}) ${phone.substring(2, 7)}-${phone.substring(7)}`;
  }

}
