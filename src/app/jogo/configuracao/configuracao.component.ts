import { Component, OnInit, Input } from '@angular/core';
import { Sala } from '../../models/sala.model';
import { ThfGridColumn } from '@totvs/thf-ui/components/thf-grid';

@Component({
  selector: 'app-configuracao',
  templateUrl: './configuracao.component.html',
  styleUrls: ['./configuracao.component.css']
})
export class ConfiguracaoComponent implements OnInit {
  @Input() configSala: Sala;

  public columns: Array<ThfGridColumn> = this.getColumns();

  public data: Array<Object> = [
    { id: 1, value: '1', label: '1', type: 'teste' },
    { id: 2, value: '2', label: '2', type: 'teste' },
    { id: 3, value: '3', label: '3', type: 'teste' }
  ];

  constructor() { }

  ngOnInit() {
  }

  private getColumns(): Array<ThfGridColumn> {
     const columns: Array<ThfGridColumn> = [
      { column: 'value', label: 'Peso', width: 50},   // editable: true, type: 'number', required: false },
      { column: 'label', label: 'Descr.', width: 50} // editable: true, required: true }
    ];

    console.log(columns);
    return columns;
  }

}
