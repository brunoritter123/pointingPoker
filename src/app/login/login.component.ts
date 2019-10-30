import { Component, OnInit } from '@angular/core';
import { AuthService } from '../app.auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public baseUrl: string;
  public userLogin: string;
  public userPassword: string;

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  public keyUpBaseUrl(): void {
    this.authService.baseUrlJira = this.baseUrl;
  }

  public keyUpLogin(): void {
    this.authService.userJira = this.userLogin;
  }

  public keyUpPassword(): void {
    this.authService.passJira = this.userPassword;
  }

}
