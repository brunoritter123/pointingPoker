import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ThfModule } from '@totvs/thf-ui';
import { SecaoComponent } from './secao/secao.component';
import { EntrarSecaoComponent } from './entrar-secao/entrar-secao.component';
import { ConfigSecaoComponent } from './config-secao/config-secao.component';
import { JogoComponent } from './jogo/jogo.component';
import { FormsModule } from '@angular/forms';
import { ContatoComponent } from './contato/contato.component';

@NgModule({
  declarations: [
    AppComponent,
    SecaoComponent,
    EntrarSecaoComponent,
    ConfigSecaoComponent,
    JogoComponent,
    ContatoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ThfModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
