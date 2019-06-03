import { Component, OnInit, OnDestroy, ViewChild, HostListener } from '@angular/core';
import { JogoService } from './jogo.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Carta } from '../models/carta.model';
import { User } from '../models/user.model';
import { interval, Subscription } from 'rxjs';
import { ThfModalComponent } from '@totvs/thf-ui/components/thf-modal/thf-modal.component';
import { ThfModalAction } from '@totvs/thf-ui/components/thf-modal';
import { AuthService } from '../app.auth.service';
import { Sala } from '../models/sala.model';
import { Estatistica } from '../models/estatistica.model';
import { AcoesSala } from '../models/acoesSala.model';

@Component({
  selector: 'app-jogo',
  templateUrl: './jogo.component.html',
  styleUrls: ['./jogo.component.css'],
  providers: [JogoService]
})

export class JogoComponent implements OnInit, OnDestroy {
  @ViewChild(ThfModalComponent) thfModal: ThfModalComponent;

  constructor(
    private authService: AuthService,
    public jogoService: JogoService,
    private activateRoute: ActivatedRoute,
    private route: Router,
  ) { }

  public pontuacao: Array<Estatistica>;
  public maisVotado: string;
  public sincSala = true;
  public configSala: Sala;
  public fimJogo: boolean;
  public descWidget: string;
  public jogadores: Array<User> = [];
  public observadores: Array<User> = [];
  public isConnected = false;
  public isJogador = false;
  public myId: string = this.authService.id;
  public primaryAction: ThfModalAction = {
    action: () => {
      this.thfModal.close();
    },
    label: 'Estou online'
  };

  public secondaryAction: ThfModalAction = {
    action: () => {
        this.route.navigate([`/entrar-sala`], {
          queryParams: { idSala: this.configSala.idSala, nameUser: this.nameUser, isJogador: this.isJogador }});
    },
    label: 'Sair da Sala'
  };

  private nameUser: string;
  private conUsers: Subscription;
  private conConfigSala: Subscription;
  private conRecnnect: any;
  private conRecnnectSub: Subscription;
  private conIsConfig: Subscription;

  @HostListener('window:beforeunload', ['$event']) unloadHandler(event: Event) {
    event.returnValue = false;
  }

  /**
   * ngOnInit
   * Inicializador do componente
   */
  ngOnInit() {
    this.conIsConfig = this.activateRoute.queryParams.subscribe(
      (queryParams: any) => {
        this.jogoService.isConfiguracao = queryParams['config'] == 'true';
      }
    )
  
    let idSala = this.activateRoute.snapshot.params['idSala'];
    this.nameUser = this.activateRoute.snapshot.params['nameUser'];
    this.fimDeJogo(false);
    this.isJogador = this.activateRoute.snapshot.params['isJogador'] === 'true';
    this.jogoService.setUser(idSala, this.nameUser, this.isJogador);

    if (this.myId === undefined) {
      this.route.navigate([`/entrar-sala`], { queryParams:
        { idSala: idSala, nameUser: this.nameUser, isJogador: this.isJogador }});
    }

    // Quando um usuário sai ou entra na seção.
    this.conUsers = this.jogoService.getUsersConnect().subscribe( (users: Array<User>) => {
      this.jogadores = [];
      this.observadores = [];

      // Separa o tipo de usuário
      this.jogadores = users.filter(us => us.isJogador);
      this.observadores = users.filter(us => !us.isJogador);

      // Verifica a carta selecionada
      let existCardSel = false;
      users.forEach(us => {
        if (us.idUser === this.myId && us.voto.id !== undefined) {
          this.setCartaSel(us.voto.id);
          this.isJogador = us.isJogador;
          existCardSel = true;
        }
      });
      if (!existCardSel) {
        this.setCartaSel(undefined);
      }

      this.todosVotaram(users);
      this.GeraEstatistica()
    });

    // Observa recebe a configuração da sala
    this.conConfigSala = this.jogoService.getSala().subscribe( (sala: Sala) => {
      this.configSala = sala;
      this.fimDeJogo(this.configSala.forceFimJogo);
      this.GeraEstatistica();
      if (this.jogoService.cartaSel !== undefined && this.jogoService.cartaSel.id !== undefined) {
        this.setCartaSel(this.jogoService.cartaSel.id);
      }
    });

    // Controle para reconectar
    this.conRecnnect = interval(2000);
    this.conRecnnectSub = this.conRecnnect.subscribe(() => {
      this.sincSala = this.isConnected && this.jogoService.isSincronizando();

      if (navigator.onLine !== this.isConnected && !this.isConnected) {
        this.thfModal.close();
      }

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
    this.conConfigSala.unsubscribe();
    this.conIsConfig.unsubscribe();
  }

  /**
   * fimDeJogo
   * Metodo para alterar o valor da propriedade fimJogo
   */
  private fimDeJogo(acabou: boolean): void {
    this.fimJogo = acabou || (this.configSala !== undefined && this.configSala.forceFimJogo);
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
      this.configSala.forceFimJogo = true;
      this.jogoService.sendUpdateSala(this.configSala);
    }
  }

  /**
   * resetClick()
   * Função para resetar o jogo
   */
  public resetClick(): void {
    if (this.isConnected) {
      this.configSala.forceFimJogo = false;
      this.jogoService.sendReset();
      this.jogoService.sendUpdateSala(this.configSala);
    }
  }

  private openModal(): boolean {
    this.thfModal.open();
    return true;
  }

  public setCartaSel(id: number | undefined) {
    if (id === undefined) {
      this.jogoService.cartaSel = undefined;

    } else {

      this.configSala.cartas.forEach( (carta: Carta) => {
        if (carta.id === id) {
          this.jogoService.cartaSel = carta;
        }
      });
    }
  }

  public isCardSel(id: number): string {
    if (this.jogoService.cartaSel !== undefined && id === this.jogoService.cartaSel.id) {
      return 'danger';

    } else {
      return 'default';

    }
  }

  private todosVotaram(users: Array<User>): void {
    const index = users.findIndex(us => us.voto.id === undefined);

      if (index < 0) {
        this.fimDeJogo(true);
        this.GeraEstatistica()
      } else {
        this.fimDeJogo(false);
      }
  }

  private GeraEstatistica() {
      let existeArray: boolean;
      let novoPonto: Estatistica;

      if (this.fimJogo) {
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

  public isPodeExec(acao: AcoesSala): boolean {
    return this.jogoService.isPodeExcAcao(acao, this.isJogador, this.observadores);
  }
}
