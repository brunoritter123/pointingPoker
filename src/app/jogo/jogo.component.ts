import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-jogo',
  templateUrl: './jogo.component.html',
  styleUrls: ['./jogo.component.css']
})
export class JogoComponent implements OnInit {
  public cartas: Array<any> = [
    {value: 1 , label: '1'  , type: 'default'},
    {value: 2 , label: '2'  , type: 'default'},
    {value: 3 , label: '3'  , type: 'default'},
    {value: 5 , label: '5'  , type: 'default'},
    {value: 8 , label: '8'  , type: 'default'},
    {value: 13 , label: '13', type: 'default'},
    {value: 21 , label: '21', type: 'default'},
    {value: 54 , label: '54', type: 'default'},
    {value: undefined   , label: '?'},
  ];

  public pontuacao: Array<any> = [
    {ponto: '1' , votos: 3},
    {ponto: '2' , votos: 2},
    {ponto: '?' , votos: 1}
  ];

  public jogadores: Array<any> = [
    {nome: 'Bruno'   , voto: 3},
    {nome: 'Luciano' , voto: 2},
    {nome: 'Cris'    , voto: 1},
    {nome: 'Jorte'   , voto: 1}
  ];

  public media = 13;

  constructor() { }

  ngOnInit() {
  }

  public cartaClick(value: number): void {
    for (let i = 0; i < this.cartas.length; i++) {
      if (this.cartas[i].value === value) {
        this.cartas[i].type = 'danger';
      } else {
        this.cartas[i].type = 'default';
      }
    }
  }
}
