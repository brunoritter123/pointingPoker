import { Component, OnInit, Input } from '@angular/core';
import { Sala } from '../../models/sala.model';
import { ThfCheckboxGroupOption } from '@totvs/thf-ui/components/thf-field';
import { ThfGridColumn } from '@totvs/thf-kendo/components/thf-grid';


@Component({
  selector: 'app-configuracao',
  templateUrl: './configuracao.component.html',
  styleUrls: ['./configuracao.component.css']
})
export class ConfiguracaoComponent implements OnInit {
  @Input() configSala: Sala;
  
  public opcoes = [{ value: 'Ambos' }, {value: 'Administrador' }, {value: 'Jogador' }];

  rowActions = {
    beforeSave: this.onBeforeSave.bind(this),
    afterSave: this.onAfterSave.bind(this),
    beforeRemove: this.onBeforeRemove.bind(this),
    afterRemove: this.onAfterRemove.bind(this),
    beforeInsert: this.onBeforeInsert.bind(this)
  };

  columns = [
    { property: 'id', label: 'Código', align: 'right', readonly: true, freeze: true, width: 120 },
    { property: 'name', label: 'Nome', width: '200px', required: true },
    { property: 'occupation', label: 'Cargo', width: 150 },
    { property: 'email', label: 'E-mail', width: 100, required: true },
    { property: 'status', label: 'Status', align: 'center', width: 80 },
    { property: 'lastActivity', label: 'Última atividade', align: 'center', width: 140 },
    { property: 'actions', label: '.', align: 'center', readonly: true, action: true },
  ];

  data = [
    { id: 629131, name: 'Jhony Senem', occupation: 'Developer', email: 'jhony.senem@totvs.com.br',
      status: 'Active', lastActivity: '2018-12-12', actions: '...' },
    { id: 78492341, name: 'Rafaelly Gruber', occupation: 'Engineer', email: 'rafaelly.gruber@totvs.com.br',
      status: 'Active', lastActivity: '2018-12-10', actions: '...' },
    { id: 986434, name: 'Nicole Oliveira', occupation: 'Developer', email: 'nicole.oliveira@totvs.com.br',
      status: 'Active', lastActivity: '2018-12-12', actions: '...' },
    { id: 4235652, name: 'Mateus José', occupation: 'Developer', email: 'mateus.jose@totvs.com.br',
      status: 'Active', lastActivity: '2018-11-23', actions: '...' },
    { id: 629131, name: 'Leonardo Leal', occupation: 'Engineer', email: 'leonardo.leal@totvs.com.br',
      status: 'Active', lastActivity: '2018-11-30', actions: '...' },
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
  }

}
