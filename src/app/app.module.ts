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
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './app.auth.service';
import { ThfDialogService } from '@totvs/thf-ui/services/thf-dialog/thf-dialog.service';
import { ConfiguracaoComponent } from './jogo/configuracao/configuracao.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    EntrarSecaoComponent,
    JogoComponent,
    ContatoComponent,
    EstatisticaComponent,
    VotosComponent,
    ObservadorComponent,
    ConfiguracaoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ThfModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [AuthService, ThfDialogService],
  bootstrap: [AppComponent]
})
export class AppModule { }
