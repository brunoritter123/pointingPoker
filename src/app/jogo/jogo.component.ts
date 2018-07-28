import { Component, OnInit, OnDestroy } from '@angular/core';
import { JogoService } from './jogo.service';

@Component({
  selector: 'app-jogo',
  templateUrl: './jogo.component.html',
  styleUrls: ['./jogo.component.css'],
  providers: [JogoService]
})
export class JogoComponent implements OnInit, OnDestroy {
  constructor(
    private jogoService: JogoService
  ) { }

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

  public jogadores: Array<any> = [];

  public media = 13;

  private conVotos;
  private conUsers;

  ngOnInit() {
    this.conVotos = this.jogoService.getVotos().subscribe( (voto: number) => {
      console.log(voto);
    });

    this.conUsers = this.jogoService.getUsersConnect('Bruno').subscribe( (users: Array<any>) => {
      this.jogadores = users;
      console.log(users);
    });
  }

  ngOnDestroy() {
    this.conVotos.unsubscribe();
    this.conUsers.unsubscribe();
  }

  public cartaClick(value: number): void {
    for (let i = 0; i < this.cartas.length; i++) {
      if (this.cartas[i].value === value) {
        this.cartas[i].type = 'danger';
      } else {
        this.cartas[i].type = 'default';
      }
    }

    this.jogoService.sendVoto(value);

  }
}
