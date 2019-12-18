import { Component, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { PoTableColumn, PoTableAction } from '@portinari/portinari-ui';
import { InputLoadComponent } from '../../lib/component/input-load/input-load.component';
import { Subscriber, Subscription } from 'rxjs';

@Component({
  selector: 'app-lista-jira',
  templateUrl: './lista-jira.component.html',
  styleUrls: ['./lista-jira.component.css']
})
export class ListaJiraComponent {
  @ViewChild('filtro', { static: false }) private filtro: InputLoadComponent;
  @Output() private votarIssue: EventEmitter<any> = new EventEmitter();

  private isLoadFiltro: boolean = false;
  private isValidFiltro: boolean = true;
  private conNovaPontuacao: Subscription;

  private columnsIssue: Array<PoTableColumn> = [
    //{ property: 'id', label: 'ID' },
    { property: 'descricao', label: 'Descrição' },
    { property: 'voto', label: 'Pontos' }
  ]

  private listaIssue: Array<any> = [
    { descricao: 'teste issue nova texto', id: 'djurfat1-1001' },
    { descricao: 'teste issue nova texto maior', id: 'djurfat1-1002' },
    { descricao: 'teste issue nova texto maior ainda para ficar', id: 'djurfat1-1003', voto: 13 },
    { descricao: 'teste issue nova texto maior ainda para ficar bem grande e quebra a linha', id: 'djurfat1-1004' }
  ]

  private actions: Array<PoTableAction> = [
    { action: this.tableVotar.bind(this), icon: 'po-icon-export', label: 'Votar' }
  ];

  constructor() { }

  /**
   * Seta um novo voto em um Issue para não precisar dar um get no JIRA
   *
   * @param idIssue Id da issue que foi votada
   * @param voto Valor do voto que foi informado
   */
  public novaPontuacao(idIssue: string, voto: number): void {
    if (!!idIssue && !!voto) {
      this.listaIssue.forEach(issue => {
        if (issue.id == idIssue) {
          issue.voto = voto
        }
      });
    }
  }

  private tableVotar(issue): void {
    this.votarIssue.emit(issue.id)
  }

  private filtroKeyUp(filtro): void {
    if (!filtro) {
      this.isValidFiltro = true;
      return
    }

    this.isLoadFiltro = true;

    setTimeout(() => {
      this.isValidFiltro = false;
      this.isLoadFiltro = false;
    }, 3000);

  }
}
