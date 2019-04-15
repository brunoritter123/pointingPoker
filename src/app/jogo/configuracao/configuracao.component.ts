import { Component, OnInit, Input } from '@angular/core';
import { Sala } from '../../models/sala.model';


@Component({
  selector: 'app-configuracao',
  templateUrl: './configuracao.component.html',
  styleUrls: ['./configuracao.component.css']
})
export class ConfiguracaoComponent implements OnInit {
  @Input() configSala: Sala;

  public configSalaTmp: Sala =  new Sala();
  public cbResetar = "Default";
  public cbFinalizar = "Default";
  public rmJogadores = "Default";
  public rmAdministradores = "Default";

  public opcoes = [
    {label: 'Ambos', value: 'Ambos' },
    {label: 'Administrador', value: 'Administrador' },
    {label: 'Default', value: 'Default'},
    {label: 'Jogador', value: 'Jogador' }
  ];

  rowActions = {
    beforeSave: this.onBeforeSave.bind(this),
    afterSave: this.onAfterSave.bind(this),
    beforeRemove: this.onBeforeRemove.bind(this),
    afterRemove: this.onAfterRemove.bind(this),
    beforeInsert: this.onBeforeInsert.bind(this),
  };

  columns = [
    { property: 'label', label: 'Nome' , width: 50},
    { property: 'value', label: 'Valor', width: 50},
  ];

  onBeforeSave(row: any, old: any) {
    return row.occupation !== 'Engineer';
  }

  onAfterSave(row) {
    // console.log('onAfterSave(new): ', row);
  }

  onBeforeRemove(row) {
    // console.log('onBeforeRemove: ', row);

    return true;
  }

  onAfterRemove(row) {
    // console.log('onAfterRemove: ', row);
  }

  onBeforeInsert(row) {
    // console.log('onBeforeInsert: ', row);

    return true;
  }
  constructor() { }

  ngOnInit() {
    this.configSalaTmp.clone(this.configSala);
  }

}
