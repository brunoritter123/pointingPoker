import { Component, OnInit, Input } from '@angular/core';
import { Sala } from '../models/sala.model';
import { ThfDialogService } from '@totvs/thf-ui/services/thf-dialog/thf-dialog.service';


@Component({
  selector: 'app-configuracao',
  templateUrl: './configuracao.component.html',
  styleUrls: ['./configuracao.component.css']
})
export class ConfiguracaoComponent implements OnInit {

  public configSala: Sala =  new Sala();
  public configSalaTmp: Sala =  new Sala();

  public cbResetar = "Default";
  public cbFinalizar = "Default";
  public removeJogador = "Default";
  public removeAdm = "Default";
  public ordemCarta = "";
  public novaCarta = "";
  public isAlterouCartas = false;
  public cartas: Array<object>;

  public opcoes = [
    {label: 'Ambos', value: 'Ambos' },
    {label: 'Administrador', value: 'Administrador' },
    {label: 'Default', value: 'Default'},
    {label: 'Jogador', value: 'Jogador' }
  ];

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
    { label: 'Limpar'     , action: () => this.alteraCartas('Limpar') }
  ];

  constructor( private thfAlert: ThfDialogService ) { }

  ngOnInit() {
    Object.assign(this.configSalaTmp, this.configSala)
    this.alteraCartas('Padrão')
  }

  public alteraCartas(aplicar: string){
    let executar = true;
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

      default:
        break;
    }
    this.isAlterouCartas = false;
  }

  public save() {
    console.log("save");
    debugger;
  }

  public cancel() {
    console.log("cancel");
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

  public alteracaoCartaEspecias() {
    console.log(this.cartasEspecias);
  }
}
