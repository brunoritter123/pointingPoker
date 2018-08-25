import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ThfModule } from '@totvs/thf-ui';
import { EntrarSecaoComponent } from './entrar-secao/entrar-secao.component';
import { JogoComponent } from './jogo/jogo.component';
import { FormsModule } from '@angular/forms';
import { ContatoComponent } from './contato/contato.component';
import { EstatisticaComponent } from './jogo/estatistica/estatistica.component';
import { VotosComponent } from './jogo/votos/votos.component';
import { ObservadorComponent } from './jogo/observador/observador.component';
import { HttpModule } from '@angular/http';
import { AuthService } from './app.auth.service';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    EntrarSecaoComponent,
    JogoComponent,
    ContatoComponent,
    EstatisticaComponent,
    VotosComponent,
    ObservadorComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ThfModule,
    FormsModule,
    HttpModule
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
