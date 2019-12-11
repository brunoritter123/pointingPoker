import { Component, Input, AfterViewInit, ViewChild } from '@angular/core';
import { Sala } from '../../models/sala.model';
import { PoTableColumn, PoAccordionItemComponent } from '@portinari/portinari-ui';

@Component({
  selector: 'app-regua',
  templateUrl: './regua.component.html',
  styleUrls: ['./regua.component.css']
})
export class ReguaComponent implements AfterViewInit {
  @ViewChild(PoAccordionItemComponent, { static: true }) item: PoAccordionItemComponent;
  @Input() configSala: Sala;

  columnsRegua: Array<PoTableColumn> = [
    { property: 'label', label: 'Ponto' },
    { property: 'nmUltHist', label: 'Última História' },
  ]

  constructor() { }

  ngAfterViewInit(): void {
    this.item.expand()
  }
}
