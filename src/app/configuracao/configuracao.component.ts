import { Component, OnInit, Input } from '@angular/core';
import { Sala } from '../models/sala.model';
import { ThfPageEditLiterals } from '@totvs/thf-ui';
import { Carta } from '../models/carta.model';


@Component({
  selector: 'app-configuracao',
  templateUrl: './configuracao.component.html',
  styleUrls: ['./configuracao.component.css']
})
export class ConfiguracaoComponent implements OnInit {
  //@Input() configSala: Sala;

  public configSala: Sala =  new Sala();

  public configSalaTmp: Sala =  new Sala();
  public cbAplicar = "Fibonacci";
  public cbResetar = "Default";
  public cbFinalizar = "Default";
  public removeJogador = "Default";
  public removeAdm = "Default";
  public lbAplicar = "Fibonacci";
  public readonlyGrid  = "true"

  public opcoes = [
    {label: 'Ambos', value: 'Ambos' },
    {label: 'Administrador', value: 'Administrador' },
    {label: 'Default', value: 'Default'},
    {label: 'Jogador', value: 'Jogador' }
  ];

  public opcoesCarta = [
    {label: 'Customizado', value: 'Customizado' },
    {label: 'Fibonacci', value: 'Fibonacci' },
    {label: 'Fibonacci 2', value: 'Fibonacci 2' },
    {label: 'Tamanho', value: 'Tamanho'}
  ];

  public cartasEspecias: Array<string> = ['?', '...', 'Café'];

  public opcoesCartasEspecias = [
    { value: '?', label: 'Interrogação' },
    { value: '...', label: 'Infinito' },
    { value: 'Café', label: 'Xícara de café' }
  ];

  public readonly sequencias: Array<object> = [
    { label: 'Customizado', action: () => this.alteraCartas('Customizado') },
    { label: 'Fibonacci'  , action: () => this.alteraCartas('Fibonacci')   },
    { label: 'Fibonacci 2', action: () => this.alteraCartas('Fibonacci 2') }, // 0, ½, 1, 2, 3, 5, 8, 13, 20, 40, 100
    { label: 'Tamanho'    , action: () => this.alteraCartas('Tamanho')     } // XXS, XS, S, M, L, XL, XXL
  ];

  public rowActions = {
    beforeSave: this.onBeforeSave.bind(this) ,
    beforeInsert: this.onBeforeInsert.bind(this),
  };

  public columns = [
    { property: 'id', label: 'Ordem' , width: 20, readonly: this.readonlyGrid},
    { property: 'label', label: 'Nome', width: 80, readonly: this.readonlyGrid},
    { property: 'actions', label: '.', align: 'center', readonly: this.readonlyGrid, action: true },
  ];

  constructor() { }

  ngOnInit() {
    Object.assign(this.configSalaTmp, this.configSala)
  }

  private setReadOnlyGrid(readOnly: boolean) {
    this.columns.forEach(col => {
      readOnly
      col.readonly = (readOnly ? 'true' : 'false')
    });
  }

  public alteraCartas(opcSelecionada: string){
    this.lbAplicar = opcSelecionada;
    this.readonlyGrid = 'false';
    this.setReadOnlyGrid(true);

    switch (this.lbAplicar) {
      case 'Customizado':
        this.setReadOnlyGrid(false);
        debugger;

        break;

      case 'Fibonacci':


        break;
      case 'Fibonacci 2':

        break;
      case 'Tamanho':

        break;

      default:
        break;
    }
  }

  public save() {
    console.log("save");
    debugger;
  }

  public cancel() {
    console.log("cancel");
  }

  public removerCarta() {
    console.log("removerCarta");
  }

  public addCarta() {
    console.log("addCarta");
  }

  alteracaoCartaEspecias() {
    console.log(this.cartasEspecias);
  }

  onBeforeSave(row: any, old: any) {
    console.log('onBeforeSave(new): ', row);
    return true;
  }
  onBeforeInsert(row) {
    row.label = "100";
    row.value = 100;
    console.log('onBeforeInsert: ', row);

    return true;
  }

}
