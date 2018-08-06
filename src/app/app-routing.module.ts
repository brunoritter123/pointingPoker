import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SecaoComponent } from './secao/secao.component';
import { EntrarSecaoComponent } from './entrar-secao/entrar-secao.component';
import { JogoComponent } from './jogo/jogo.component';

const routes: Routes = [

  { path: '', component: SecaoComponent },
  { path: 'entrar-sala', component: EntrarSecaoComponent },
  { path: 'entrar-sala/:nameUser', component: EntrarSecaoComponent },
  { path: 'jogo', component: EntrarSecaoComponent },
  { path: 'jogo/:nameUser/:isJogador', component: JogoComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})

export class AppRoutingModule { }
