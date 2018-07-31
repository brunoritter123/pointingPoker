import { Component, OnInit, OnDestroy } from '@angular/core';
import { JogoService } from './jogo.service';
import { ActivatedRoute } from '@angular/router';
import { Carta } from '../models/carta.model';
import { User } from '../models/user.model';
import { Estatistica } from '../models/estatistica.model';

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
  public maisVotado: string = undefined;
  public pontuacao: Array<Estatistica> = undefined;

  private conUsers;
  private conCartas;
  private conFimJogo;

  ngOnInit() {
    this.fimJogo = false;
    this.pontuacao = undefined;
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
        this.pontuacao = undefined;
        this.maisVotado = undefined;

      } else {
        this.geraEstatistica();
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

  private geraEstatistica(): void {
    let existeArray: boolean;
    let novoPonto: Estatistica;

    this.pontuacao = [];

    this.jogadores.forEach(jogador => {
      existeArray = false;

      this.pontuacao.forEach(ponto => {
        if (ponto.label === jogador.voto.label ) {
          existeArray = true;
          ponto.votos += 1;
        }
      });

      if (!existeArray) {
        novoPonto = new Estatistica(jogador.voto.label, 1);
        this.pontuacao.push(novoPonto);
      }

      this.pontuacao.sort( (a: Estatistica , b: Estatistica) => {
        let ret: number = b.votos - a.votos;
        if (ret === 0) {
          ret = b. - a.votos
        }

        return (b.votos - a.votos);
      });

      this.maisVotado = this.pontuacao[0].label;
    });

  }

}
