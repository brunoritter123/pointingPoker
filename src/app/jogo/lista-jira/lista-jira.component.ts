import { Component, Input, AfterViewInit, ViewChild } from '@angular/core';
import { PoTableColumn, PoAccordionItemComponent } from '@portinari/portinari-ui';

@Component({
  selector: 'app-lista-jira',
  templateUrl: './lista-jira.component.html',
  styleUrls: ['./lista-jira.component.css']
})
export class ListaJiraComponent implements AfterViewInit {
  @ViewChild(PoAccordionItemComponent, { static: true }) item: PoAccordionItemComponent;

  columnsRegua: Array<PoTableColumn> = [
    { property: 'label', label: 'Ponto' },
    { property: 'nmUltHist', label: 'Última História' },
  ]

  constructor() { }

  ngAfterViewInit(): void {
    this.item.expand()
  }
}
