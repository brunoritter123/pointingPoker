import { Component, OnInit, Input } from '@angular/core';
import { Sala } from '../models/sala.model';
import { AcoesSala } from '../models/acoesSala.model';
import { JogoService } from '../jogo/jogo.service';
import { PoDialogService } from '@portinari/portinari-ui';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-configuracao',
  templateUrl: './configuracao.component.html',
  styleUrls: ['./configuracao.component.css']
})
export class ConfiguracaoComponent implements OnInit {
  @Input() configSala: Sala;

  public cbResetar       = ""
  public cbFinalizar     = ""
  public removeJogador   = ""
  public removeAdm       = ""
  public ordemCarta      = "";
  public novaCarta       = "";
  public isAlterouCartas = false;
  public cartas: Array<any> = [];

  public opcoes: Array<AcoesSala> = AcoesSala.getOpcoes();

  public cartasEspecias: Array<string> = ['?', '...', 'Café'];

  public opcoesCartasEspecias = [
    { value: '?', label: 'Interrogação' },
    { value: '...', label: 'Infinito' },
    { value: 'Café', label: 'Xícara de café' }
  ];

  public readonly sequencias: Array<object> = [
    { label: 'Padrão'     , action: () => this.alteraCartas('Padrão') },
    { label: 'Fibonacci'  , action: () => this.alteraCartas('Fibonacci')   },
    { label: 'Tamanho'    , action: () => this.alteraCartas('Tamanho')     },
    { label: 'Salvo'      , action: () => this.alteraCartas('Salvo') },
    { label: 'Limpar'     , action: () => this.alteraCartas('Limpar') }
  ];

  constructor(
    private jogoService: JogoService,
    private thfAlert: PoDialogService,
    private router: Router,
    private activatedRoute: ActivatedRoute, ) { }

  ngOnInit() {
    this.cbResetar     = this.configSala.resetar;
    this.cbFinalizar   = this.configSala.finalizar;
    this.removeJogador = this.configSala.removerJogador;
    this.removeAdm     = this.configSala.removerAdm;
    this.alteraCartas('Salvo')
  }


  public alteraCartas(aplicar: string){
    if(this.isAlterouCartas){
      this.thfAlert.confirm({
        title: 'Atenção',
        message: `Deseja limpar as alteração realizadas nas cartas e aplicar a sequência selecionada?`,
        confirm: () => this.execteAlteraCartas(aplicar)
      });
    } else {
      this.execteAlteraCartas(aplicar);
    }
  }

  private execteAlteraCartas(aplicar: string) {
    switch (aplicar) {
      case 'Fibonacci':
        this.cartas = [ {value: ' 0'}, {value: ' ½'}, {value: '01'},
                        {value: '02'}, {value: '03'}, {value: '05'},
                        {value: '08'}, {value: '13'}, {value: '21'},
                        {value: '34'}, {value: '55'}
        ]
        break;

      case 'Padrão':
        this.cartas = [ {value: ' 0'}, {value: ' ½'}, {value: '01'},
                        {value: '02'}, {value: '03'}, {value: '05'},
                        {value: '08'}, {value: '13'}, {value: '20'},
                        {value: '40'}, {value: '100'}
        ]
        break;

      case 'Tamanho':
        this.cartas = [ {value: 'XXS'}, {value: 'XS'}, {value: 'S'},
                        {value: 'M'}, {value: 'L'},  {value: 'XL'},
                        {value: 'XXL'}
        ]
        break;

      case 'Limpar':
        this.cartas = [];
        break;

      case 'Salvo':
        this.cartasEspecias = [];
        this.configSala.cartas.forEach( (carta) => {
          if (typeof carta.value == 'number'){
            this.cartas.push({value: carta.label});
          } else {
            this.cartasEspecias.push(carta.label)
          }
        })


      default:
        break;
    }
    this.isAlterouCartas = false;
  }

  public save() {
    let cartasNew: Array<any> = [];
    this.cartas.forEach( (carta, id) => {
      cartasNew.push({
        idSala: this.configSala.idSala,
        value: id,
        label: carta.value,
        type: 'default' });
    });

    this.cartasEspecias.forEach( (carta, id) => {
      cartasNew.push( {
        idSala: this.configSala.idSala,
        value: undefined,
        label: carta,
        type: 'default'
      });
    });

    this.configSala.finalizar = this.cbFinalizar;
    this.configSala.removerAdm = this.removeAdm;
    this.configSala.removerJogador = this.removeJogador;
    this.configSala.resetar = this.cbResetar;
    this.configSala.cartas = cartasNew;

    this.jogoService.sendUpdateSala(this.configSala, true);

    this.cancel()
  }

  public cancel() {
    this.jogoService.isConfiguracao = false;
    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams: { config: 'false' },
        queryParamsHandling: "merge"
      });
  }

  public addCarta() {
    let cartaTmp : Array<object> = [];
    const ordemCarta = parseInt(this.ordemCarta)
    const novaCarta = {value: this.novaCarta}

    if (this.novaCarta.length > 0) {
      if (ordemCarta <= 0) {
        this.cartas.unshift(novaCarta);

      } else if (ordemCarta > this.cartas.length || isNaN(ordemCarta)) {
        this.cartas.push(novaCarta);

      } else {
        this.cartas.forEach( carta => {
          if( (cartaTmp.length + 1) == ordemCarta) {
            cartaTmp.push(novaCarta);
          }
          cartaTmp.push(carta);
        });
        this.cartas = cartaTmp.slice();
      }

      this.novaCarta = '';
      this.isAlterouCartas = true;
    }
  }

  public proximaOrdem(){
    this.ordemCarta = (this.cartas.length + 1).toString();
  }
}
