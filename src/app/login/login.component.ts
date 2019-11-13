import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../app.auth.service';
import { PoPasswordComponent } from '@portinari/portinari-ui';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @ViewChild(PoPasswordComponent, { static: true }) senha: PoPasswordComponent;

  constructor(public authService: AuthService) { }

  ngOnInit() {
    if (this.authService.getAuthJiraCookie()) {
      this.senha.focus()
    }
  }

}
