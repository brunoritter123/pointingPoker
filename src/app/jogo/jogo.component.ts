import { Component, OnInit, OnDestroy } from '@angular/core';
import { JogoService } from './jogo.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Carta } from '../models/carta.model';
import { User } from '../models/user.model';
import { Estatistica } from '../models/estatistica.model';
import { interval } from 'rxjs/observable/interval';
import { ThfNotificationService } from '@totvs/thf-ui/services/thf-notification/thf-notification.service';

@Component({
  selector: 'app-jogo',
  templateUrl: './jogo.component.html',
  styleUrls: ['./jogo.component.css'],
  providers: [JogoService, ThfNotificationService]
})
export class JogoComponent implements OnInit, OnDestroy {
  public fimJogo: boolean;
  public descWidget: string;
  public cartas: Array<Carta> = [];
  public jogadores: Array<User> = [];
  public maisVotado: string = undefined;
  public pontuacao: Array<Estatistica> = undefined;
  public isConnected = false;
  public isJogador = false;

  private conUsers;
  private conCartas;
  private conFimJogo;
  private conRecnnect;
  private conRecnnectSub;

  constructor(
    private jogoService: JogoService,
    private activateRoute: ActivatedRoute,
    private route: Router,
    private thfNotification: ThfNotificationService
  ) { }


  ngOnInit() {
    this.fimDeJogo(false);
    this.pontuacao = undefined;
    const nameUser = this.activateRoute.snapshot.params['nameUser'];
    this.isJogador = this.activateRoute.snapshot.params['isJogador'];
    this.jogoService.setUserName( nameUser );

    this.conUsers = this.jogoService.getUsersConnect().subscribe( (users: Array<User>) => {
      this.jogadores = users;
    });

    this.conCartas = this.jogoService.getCartas().subscribe( (cartas: Array<Carta>) => {
      this.cartas = cartas;
    });

    this.conFimJogo = this.jogoService.getFimJogo().subscribe( (fimJogo: boolean) => {
      this.fimDeJogo(fimJogo);
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

    this.conRecnnect = interval(2000);
    this.conRecnnectSub = this.conRecnnect.subscribe(() => {
      if (!this.jogoService.isConnected()) {
        this.thfNotification.error('Xiiiii... Você foi desconectado! :(');
        this.route.navigate(['/entrar-sala/' + nameUser]);
      }
    });
  }

  private fimDeJogo(acabou: boolean): void {
    this.fimJogo = acabou;
    this.descWidget = this.fimJogo ? 'Estatísticas' : 'Pontos';
  }

  ngOnDestroy() {
    this.conRecnnectSub.unsubscribe();
    this.conUsers.unsubscribe();
    this.conCartas.unsubscribe();
    this.conFimJogo.unsubscribe();
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
        if (ponto.carta.label === jogador.voto.label ) {
          existeArray = true;
          ponto.votos += 1;
        }
      });

      if (!existeArray) {
        novoPonto = new Estatistica(jogador.voto, 1);
        this.pontuacao.push(novoPonto);
      }

      this.pontuacao.sort( (a: Estatistica , b: Estatistica) => {
        let ret: number = b.votos - a.votos;
        if (ret === 0) {
          ret = b.carta.value - a.carta.value;
        }

        return ret;
      });

      this.maisVotado = this.pontuacao[0].carta.label;
    });

  }

}
