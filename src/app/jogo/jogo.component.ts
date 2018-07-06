import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-jogo',
  templateUrl: './jogo.component.html',
  styleUrls: ['./jogo.component.css']
})
export class JogoComponent implements OnInit {
  public cartas: Array<any> = [
    {value: 1 , label: '1 ponto'},
    {value: 2 , label: '2 pontos'},
    {value: 3 , label: '3 pontos'},
    {value: 5 , label: '5 pontos'},
    {value: 8 , label: '8 pontos'},
    {value: 13 , label: '13 pontos'},
    {value: 21 , label: '21 pontos'},
    {value: 54 , label: '54 pontos'},
    {value: undefined   , label: '?'},
  ];

  public pontuacao: Array<any> = [
    {ponto: '1' , votos: 3},
    {ponto: '2' , votos: 2},
    {ponto: '?' , votos: 1}
  ];

  public media = 13;

  constructor() { }

  ngOnInit() {
  }

}
