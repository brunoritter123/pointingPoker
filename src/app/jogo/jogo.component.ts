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
  public observadores: Array<User> = [];
  public maisVotado: string = undefined;
  public isConnected = false;
  public isJogador = false;

  private conUsers;
  private conCartas;
  private conFimJogo;
  private conRecnnect;
  private conRecnnectSub;
  private vlCartaSelecionada: number;

  constructor(
    private jogoService: JogoService,
    private activateRoute: ActivatedRoute,
    private route: Router,
    private thfNotification: ThfNotificationService
  ) { }


  /**
   * ngOnInit
   * Inicializador do componente
   */
  ngOnInit() {
    const nameUser = this.activateRoute.snapshot.params['nameUser'];
    this.fimDeJogo(false);
    this.isJogador = this.activateRoute.snapshot.params['isJogador'] === 'true';
    this.vlCartaSelecionada = Number(this.activateRoute.snapshot.queryParams['vlCarta']);
    this.jogoService.setUser( nameUser, this.isJogador );

    // Quando um usuário sai ou entra na seção.
    this.conUsers = this.jogoService.getUsersConnect().subscribe( (users: Array<User>) => {
      this.jogadores = [];
      this.observadores = [];
      this.fimDeJogo(false);

      users.forEach((us: User) => {
        if (us.isJogador) {
          this.jogadores.push(us);
        } else {
          this.observadores.push(us);
        }
      });

    });

    // Observa recebe a configuração das cartas
    this.conCartas = this.jogoService.getCartas().subscribe( (cartas: Array<Carta>) => {
      this.cartas = cartas;

      if (this.vlCartaSelecionada !== undefined) {
        const cartaSelecionada: Carta = this.cartas.find(ct => {
          return ct.value === this.vlCartaSelecionada;
        });

        if (cartaSelecionada !== undefined) {
          this.cartaClick(cartaSelecionada);
        }
      }
    });

    // Observa se acabou o jogo
    this.conFimJogo = this.jogoService.getFimJogo().subscribe( (fimJogo: boolean) => {
      this.fimDeJogo(fimJogo);
      if (!fimJogo) {
        for (let i = 0; i < this.cartas.length; i++) {
          this.cartas[i].type = 'default';
        }
        this.maisVotado = undefined;
        this.vlCartaSelecionada = undefined;
      }
    });

    this.conRecnnect = interval(2000);
    this.conRecnnectSub = this.conRecnnect.subscribe(() => {
      if (!this.jogoService.isConnected()) {
        this.thfNotification.error('Xiiiii... Você foi desconectado! :(');
        this.route.navigate([`/entrar-sala/${nameUser}/${this.isJogador}`], { queryParams: { vlCarta: this.vlCartaSelecionada }});
      }
    });
  }

  /**
   * fimDeJogo
   * Metodo para alterar o valor da propriedade fimJogo
   */
  private fimDeJogo(acabou: boolean): void {
    this.fimJogo = acabou;
    this.descWidget = this.fimJogo ? 'Estatísticas' : 'Pontos';
  }

  /**
   * ngOnDestroy()
   * Metodo para executar ao destruir o componente.
   */
  ngOnDestroy() {
    this.conRecnnectSub.unsubscribe();
    this.conUsers.unsubscribe();
    this.conCartas.unsubscribe();
    this.conFimJogo.unsubscribe();
  }

  /**
   * cartaClick()
   * Função para executar ao clicar em uma carta
   */
  public cartaClick(carta: Carta): void {
    if (!this.fimJogo && carta !== undefined) {

      this.cartas.forEach( ct => {

        if (ct.value === carta.value) {
          ct.type = 'danger';
          this.vlCartaSelecionada = ct.value;
        } else {
          ct.type = 'default';
        }
      });

      this.jogoService.sendVoto(carta);
    }
  }

  /**
   * fimClick()
   * Função para força a finalização do jogo
   */
  public fimClick(): void {
    this.jogoService.sendFimJogo();
  }

  /**
   * resetClick()
   * Função para resetar o jogo
   */
  public resetClick(): void {
    this.jogoService.sendReset();
  }
}
