import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../app.auth.service';
import { PoPasswordComponent } from '@portinari/portinari-ui';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @Output() conectar: EventEmitter<any> = new EventEmitter()
  @ViewChild(PoPasswordComponent, { static: true }) senha: PoPasswordComponent;

  constructor(public authService: AuthService) { }

  ngOnInit() {
    if (this.authService.getAuthJiraCookie()) {
      this.senha.focus()
    }
  }

  public keyUpPass() {
    this.conectar.emit()
  }

}
