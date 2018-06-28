import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SecaoComponent } from './secao/secao.component';
import { EntrarSecaoComponent } from './entrar-secao/entrar-secao.component';

const routes: Routes = [

  { path: '', component: SecaoComponent },
  { path: 'entrar-secao', component: EntrarSecaoComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})

export class AppRoutingModule { }
