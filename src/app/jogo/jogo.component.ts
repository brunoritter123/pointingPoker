import { Component, OnInit, OnDestroy } from '@angular/core';
import { JogoService } from './jogo.service';
import { ActivatedRoute } from '@angular/router';
import { Carta } from '../models/carta.model';
import { User } from '../models/user.model';

@Component({
  selector: 'app-jogo',
  templateUrl: './jogo.component.html',
  styleUrls: ['./jogo.component.css'],
  providers: [JogoService]
})
export class JogoComponent implements OnInit, OnDestroy {

  constructor(
    private jogoService: JogoService,
    private route: ActivatedRoute
  ) { }

  public fimJogo: boolean;
  public cartas: Array<Carta> = [];
  public jogadores: Array<User> = [];
  public media = 13;
  public pontuacao: Array<any> = [
    {ponto: '1' , votos: 3},
    {ponto: '2' , votos: 2},
    {ponto: '?' , votos: 1}
  ];

  private conUsers;
  private conCartas;
  private conFimJogo;

  ngOnInit() {
    this.fimJogo = false;
    const nomeUser = this.route.snapshot.params['nomeUser'];

    this.conUsers = this.jogoService.getUsersConnect(nomeUser).subscribe( (users: Array<User>) => {
      this.jogadores = users;
    });

    this.conCartas = this.jogoService.getCartas().subscribe( (cartas: Array<Carta>) => {
      this.cartas = cartas;
    });

    this.conFimJogo = this.jogoService.getFimJogo().subscribe( (fimJogo: boolean) => {
      this.fimJogo = fimJogo;
      if (!fimJogo) {
        for (let i = 0; i < this.cartas.length; i++) {
          this.cartas[i].type = 'default';
        }
      }
    });

  }

  ngOnDestroy() {
    this.conUsers.unsubscribe();
    this.conCartas.unsubscribe();
  }

  public cartaClick(carta: Carta): void {

    if (!this.fimJogo) {
      for (let i = 0; i < this.cartas.length; i++) {
        if (this.cartas[i].value === carta.value) {
          this.cartas[i].type = 'danger';
        } else {
          this.cartas[i].type = 'default';
        }
      }
      this.jogoService.sendVoto(carta);
    }
  }

  public fimClick(): void {
    this.jogoService.sendFimJogo();
  }

  public resetClick(): void {
    this.jogoService.sendReset();
  }
}
