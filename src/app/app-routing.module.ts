import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EntrarSecaoComponent } from './entrar-secao/entrar-secao.component';
import { JogoComponent } from './jogo/jogo.component';
import { ConfiguracaoComponent } from './configuracao/configuracao.component';

const routes: Routes = [

  { path: '', component: EntrarSecaoComponent },
  { path: 'entrar-sala', component: EntrarSecaoComponent },
  { path: 'jogo', component: EntrarSecaoComponent },
  { path: 'jogo/:idSala/:nameUser/:isJogador', component: JogoComponent },
  { path: 'configuracao/:idSala/:nameUser/:isJogador', component: ConfiguracaoComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})

export class AppRoutingModule { }
