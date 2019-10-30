import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CookieService } from 'ngx-cookie-service';
import { PoModule, PoDialogService } from '@portinari/portinari-ui';

import { EntrarSecaoComponent } from './entrar-secao/entrar-secao.component';
import { JogoComponent } from './jogo/jogo.component';
import { FormsModule } from '@angular/forms';
import { ContatoComponent } from './contato/contato.component';
import { VotosComponent } from './jogo/votos/votos.component';
import { ObservadorComponent } from './jogo/observador/observador.component';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './app.auth.service';
import { ConfiguracaoComponent } from './configuracao/configuracao.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    EntrarSecaoComponent,
    JogoComponent,
    ContatoComponent,
    VotosComponent,
    ObservadorComponent,
    ConfiguracaoComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PoModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [
    AuthService,
    PoDialogService,
    CookieService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
