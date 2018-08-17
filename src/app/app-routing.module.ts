import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EntrarSecaoComponent } from './entrar-secao/entrar-secao.component';
import { JogoComponent } from './jogo/jogo.component';

const routes: Routes = [

  { path: '', component: EntrarSecaoComponent },
  { path: 'entrar-sala', component: EntrarSecaoComponent },
  { path: 'entrar-sala/:nameUser/:isJogador', component: EntrarSecaoComponent },
  { path: 'jogo', component: EntrarSecaoComponent },
  { path: 'jogo/:nameUser/:isJogador', component: JogoComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})

export class AppRoutingModule { }
