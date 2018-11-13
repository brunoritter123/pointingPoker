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

  constructor() { }

  ngOnInit() {
  }

}
