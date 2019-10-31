import { Component, OnInit, OnDestroy, ViewChild, HostListener } from '@angular/core';
import { JogoService } from './jogo.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Carta } from '../models/carta.model';
import { User } from '../models/user.model';
import { interval, Subscription, Subject } from 'rxjs';
import { PoModalAction, PoModalComponent, PoTableColumn } from '@portinari/portinari-ui';
import { AuthService } from '../app.auth.service';
import { Sala } from '../models/sala.model';
import { Estatistica } from '../models/estatistica.model';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
	selector: 'app-jogo',
	templateUrl: './jogo.component.html',
	styleUrls: ['./jogo.component.css'],
	providers: [JogoService]
})

export class JogoComponent implements OnInit, OnDestroy {
	@ViewChild(PoModalComponent, { static: true }) poModal: PoModalComponent;

	constructor(
		private authService: AuthService,
		public jogoService: JogoService,
		private activateRoute: ActivatedRoute,
		private route: Router,
	) { }

	public columnsRegua: Array<PoTableColumn>;
	public nmHistoria: string = "";
	public pontuacao: Array<Estatistica>;
	public cartaMaisVotada: Carta;
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
	public isIntegraJira: boolean = this.authService.isIntegraJira;
	public opcModal: string;
	public titleModel: string;
	public primaryAction: PoModalAction;
	public secondaryAction: PoModalAction;

	public content: string = 'teste';

	private subjectDescHist: Subject<string> = new Subject<string>()
	private nameUser: string;
	private conUsers: Subscription;
	private conCarta: Subscription;
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
		if (this.isIntegraJira) {
			this.openLogin()
		}

		this.columnsRegua = [
			{ property: 'label', label: 'Carta' },
			{ property: 'nmUltHist', label: 'Última História'},
		]
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

		this.subjectDescHist
			.pipe(
				debounceTime(1500), // executa a ação do switchMap após 1,5 segundo
				distinctUntilChanged() // não repetir o mesmo nome da história anterior.
			).subscribe((nmHistoria: string) => {
				this.jogoService.setNmHistoria(nmHistoria);
			});

		// Quando uma carta é alterada
		this.conCarta = this.jogoService.getCarta().subscribe( (carta: any) => {

			this.configSala.cartas.forEach(cartaCfg => {
				if (cartaCfg.id == carta.id) {
					cartaCfg = carta
				}
			})
		});

		// Quando um usuário sai ou entra na seção.
		this.conUsers = this.jogoService.getUsersConnect().subscribe( (users: Array<User>) => {
			this.jogadores = [];
			this.observadores = [];

			// Verifica a carta selecionada
			let existCardSel = false;
			users.forEach(us => {
				if (us.idCarta) {
					this.configSala.cartas.forEach( (carta: Carta) => {
						if (carta.id === us.idCarta) {
							us.voto = carta;
						}
					});

					if (us.idUser === this.myId) {
						this.setCartaSel(us.idCarta);
						this.isJogador = us.isJogador;
						existCardSel = true;
					}
				}
			});

			if (!existCardSel) {
				this.setCartaSel(undefined);
			}

			// Separa o tipo de usuário
			this.jogadores = users.filter(us => us.isJogador);
			this.observadores = users.filter(us => !us.isJogador);

			this.todosVotaram(users);
			this.GeraEstatistica()
		});

		// Observa recebe a configuração da sala
		this.conConfigSala = this.jogoService.getSala().subscribe( (data: any) => {
			const sala: Sala = data.sala;
			const nmHistoria: string = data.nmHistoria;

			if (!!sala) {
				this.configSala = sala;
				this.fimDeJogo(this.configSala.forceFimJogo == 1);
				this.GeraEstatistica();
				if (this.jogoService.cartaSel !== undefined && this.jogoService.cartaSel.id !== undefined) {
					this.setCartaSel(this.jogoService.cartaSel.id);
				}
				this.nmHistoria = sala.nmHistoria;
			}

			if (!!nmHistoria) {
				this.configSala.nmHistoria = nmHistoria;
				this.nmHistoria = nmHistoria;
			}
		});

		// Controle para reconectar
		this.conRecnnect = interval(2000);
		this.conRecnnectSub = this.conRecnnect.subscribe(() => {
			this.sincSala = this.isConnected && this.jogoService.isSincronizando();

			if (navigator.onLine !== this.isConnected && !this.isConnected && this.opcModal == 'offline') {
				this.poModal.close();
			}

			this.isConnected = navigator.onLine;

			if (!this.isConnected) {
				this.openModalOffline();
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
		this.conCarta.unsubscribe();
		this.conConfigSala.unsubscribe();
		this.conIsConfig.unsubscribe();
	}

	/**
	 * emitNomeHistoria()
	 * Metodo para emitir nome da historia
	 */
	public emitNomeHistoria() {
		this.subjectDescHist.next(this.nmHistoria);
	}

	/**
	 * fimDeJogo
	 * Metodo para alterar o valor da propriedade fimJogo
	 */
	private fimDeJogo(acabou: boolean): void {
		this.fimJogo = acabou || (this.configSala !== undefined && this.configSala.forceFimJogo == 1);
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
		if (!this.fimJogo && !!carta && this.isConnected) {
			if (!!this.jogoService.cartaSel && this.jogoService.cartaSel.id == carta.id) {
				this.setCartaSel(undefined);
				this.jogoService.sendVoto(undefined);
			} else {
				this.setCartaSel(carta.id);
				this.jogoService.sendVoto(carta);
			}
		}
	}

	/**
	 * fimClick()
	 * Função para força a finalização do jogo
	 */
	public fimClick(): void {
		if (this.isConnected) {
			this.configSala.forceFimJogo = 1;
			this.jogoService.sendUpdateSala(this.configSala);
		}
	}

	/**
	 * resetClick()
	 * Função para resetar o jogo
	 */
	public resetClick(): void {
		if (this.isConnected) {
			this.configSala.forceFimJogo = 0;
			this.jogoService.sendReset();
			this.jogoService.sendUpdateSala(this.configSala);
		}
	}

	/**
	 * resetClick()
	 * Função para resetar o jogo
	 */
	public concluirClick() {
		if (!!this.nmHistoria && !!this.cartaMaisVotada && this.cartaMaisVotada.hasOwnProperty('id') && !!this.cartaMaisVotada.id) {
			this.cartaMaisVotada.nmUltHist = this.nmHistoria;
			this.jogoService.setCarta(this.cartaMaisVotada)
		}

		this.resetClick();
	}

	
	public setCartaSel(id: number | undefined) {
		if (id) {
			this.configSala.cartas.forEach( (carta: Carta) => {
				if (carta.id === id) {
					this.jogoService.cartaSel = carta;
				}
			});
			
		} else {
			this.jogoService.cartaSel = undefined;
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
				this.cartaMaisVotada = this.pontuacao[0].carta;
			});
		}
	}
	
	public isPodeExec(acao: string): boolean {
		return this.jogoService.isPodeExcAcao(acao, this.isJogador, this.observadores);
	}

	private openModalOffline(): boolean {
		this.opcModal == 'offline'
		this.titleModel = 'Desconectado';

		this.primaryAction = {
			action: () => {
				this.poModal.close();
			},
			label: 'Estou online'
		};

		this.secondaryAction = {
			action: () => {
				this.route.navigate([`/entrar-sala`]);
			},
			label: 'Sair da Sala'
		};

		this.poModal.open();
		return true;
	}

	public openLogin(): boolean {
		this.opcModal = 'loginJira';
		this.titleModel = 'Login Jira';

		this.primaryAction = {
			action: () => {
				this.conJira()
			},
			label: 'Conectar'
		};

		this.secondaryAction = {
			action: () => {
				this.poModal.close();
			},
			label: 'Cancelar'
		};

		this.poModal.open();
		return true;
	}

	private conJira(): void {
		this.authService.testConJira()
		.subscribe(resp => {
			//const keys = resp.headers.keys();
			console.log(resp);
		});
	}
}
