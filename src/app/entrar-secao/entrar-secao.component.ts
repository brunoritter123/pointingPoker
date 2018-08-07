import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '../../../node_modules/@angular/router';

@Component({
  selector: 'app-entrar-secao',
  templateUrl: './entrar-secao.component.html',
  styleUrls: ['./entrar-secao.component.css']
})
export class EntrarSecaoComponent implements OnInit {

  public jogador = true;
  public nome    = '';

  constructor(
    private activateRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    const nameUser: string = this.activateRoute.snapshot.params['nameUser'];
    const isJogador: boolean = this.activateRoute.snapshot.params['isJogador'] === 'true';
    if (nameUser > '') {
      this.nome = nameUser;
      this.jogador = isJogador;
    }
  }

  onSubmit() {  }

}
