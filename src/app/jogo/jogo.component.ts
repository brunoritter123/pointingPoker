import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { JogoService } from './jogo.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Carta } from '../models/carta.model';
import { User } from '../models/user.model';
import { interval } from 'rxjs/observable/interval';
import { ThfNotificationService } from '@totvs/thf-ui/services/thf-notification/thf-notification.service';
import { ThfModalComponent } from '@totvs/thf-ui/components/thf-modal/thf-modal.component';
import { ThfModalAction } from '@totvs/thf-ui/components/thf-modal';
import { AuthService } from '../app.auth.service';
import { routerNgProbeToken } from '@angular/router/src/router_module';

@Component({
  selector: 'app-jogo',
  templateUrl: './jogo.component.html',
  styleUrls: ['./jogo.component.css'],
  providers: [JogoService, ThfNotificationService]
})

export class JogoComponent implements OnInit, OnDestroy {
  @ViewChild(ThfModalComponent) thfModal: ThfModalComponent;

  constructor(
    private authService: AuthService,
    private jogoService: JogoService,
    private activateRoute: ActivatedRoute,
    private thfNotification: ThfNotificationService,
    private route: Router,
  ) {
    jogoService.setMyId(authService.id);
  }

  public idSala: string;
  public fimJogo: boolean;
  public descWidget: string;
  public cartas: Array<Carta> = [];
  public jogadores: Array<User> = [];
  public observadores: Array<User> = [];
  public maisVotado: string = undefined;
  public isConnected = false;
  public isJogador = false;
  public myId: string = this.authService.id;
  public idCartaSelecionada: number;
  public primaryAction: ThfModalAction = {
    action: () => {
      this.thfModal.close();
    },
    label: 'Estou online'
  };

  public secondaryAction: ThfModalAction = {
    action: () => {
        this.route.navigate([`/entrar-sala/${this.nameUser}/${this.isJogador}`], { queryParams: { vlCarta: this.idCartaSelecionada }});
    },
    label: 'Sair da Sala'
  };

  private forceFimJogo: boolean;
  private nameUser: string;
  private conUsers;
  private conCartas;
  private conFimJogo;
  private conRecnnect;
  private conRecnnectSub;

  /**
   * ngOnInit
   * Inicializador do componente
   */
  ngOnInit() {
    this.idSala = this.activateRoute.snapshot.params['idSala'];
    this.nameUser = this.activateRoute.snapshot.params['nameUser'];
    this.fimDeJogo(false);
    this.forceFimJogo = false;
    this.isJogador = this.activateRoute.snapshot.params['isJogador'] === 'true';
    this.jogoService.setUser(this.idSala, this.nameUser, this.isJogador );

    if (this.myId === undefined) {
      this.route.navigate(['/']);
    }

    // Quando um usuário sai ou entra na seção.
    this.conUsers = this.jogoService.getUsersConnect().subscribe( (users: Array<User>) => {
      this.jogadores = [];
      this.observadores = [];

      // Separa o tipo de usuário
      this.jogadores = users.filter(us => us.isJogador);
      this.observadores = users.filter(us => !us.isJogador);

      // Verifica a carta selecionada
      users.forEach(us => {
        if (us.idUser === this.myId) {
          this.setCartaSel(us.voto.id);
        }
      });

      this.todosVotaram(users);
    });

    // Observa recebe a configuração das cartas
    this.conCartas = this.jogoService.getCartas().subscribe( (cartas: Array<Carta>) => {
      this.cartas = cartas;
    });

    // Observa se acabou o jogo
    this.conFimJogo = this.jogoService.getFimJogo().subscribe( (fimJogo: boolean) => {
      this.forceFimJogo = fimJogo;
      this.fimDeJogo(fimJogo);
    });

    // Controle para reconectar
    this.conRecnnect = interval(2000);
    this.conRecnnectSub = this.conRecnnect.subscribe(() => {
      this.jogoService.isConnected();
      this.isConnected = navigator.onLine;

      if (!this.isConnected) {
        this.openModal();
      }
    });
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
   * fimDeJogo
   * Metodo para alterar o valor da propriedade fimJogo
   */
  private fimDeJogo(acabou: boolean): void {
    this.fimJogo = acabou || this.forceFimJogo;
    if (this.fimJogo) {
      this.descWidget = 'Estatísticas';
    } else {
      if (this.isJogador) {
        this.descWidget = 'Pontos';
      } else {
        this.descWidget = 'Ações';
      }
    }
  }

  /**
   * cartaClick()
   * Função para executar ao clicar em uma carta
   */
  public cartaClick(carta: Carta): void {
    if (!this.fimJogo && carta !== undefined && this.isConnected) {
      this.setCartaSel(carta.id);
      this.jogoService.sendVoto(carta);
    }
  }

  /**
   * fimClick()
   * Função para força a finalização do jogo
   */
  public fimClick(): void {
    if (this.isConnected) {
      this.jogoService.sendFimJogo();
    }
  }

  /**
   * resetClick()
   * Função para resetar o jogo
   */
  public resetClick(): void {
    if (this.isConnected) {
      this.jogoService.sendReset();
    }
  }

  private openModal(): boolean {
    this.thfModal.open();
    return true;
  }

  public setCartaSel(valor: number) {
    this.idCartaSelecionada = valor;

    this.cartas.forEach( (carta: Carta) => {
      if (carta.id === this.idCartaSelecionada) {
        carta.type = 'danger';
      } else {
        carta.type = 'default';
      }
    });
  }

  private todosVotaram(users: Array<User>): void {
    const index = users.findIndex(us => us.voto.id === undefined);

      if (index < 0) {
        this.fimDeJogo(true);
      } else {
        this.fimDeJogo(false);
      }
  }
}
