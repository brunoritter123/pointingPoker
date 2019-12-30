import { Component, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { PoTableColumn, PoTableAction } from '@portinari/portinari-ui';
import { InputLoadComponent } from '../../lib/component/input-load/input-load.component';
import { Subscriber, Subscription } from 'rxjs';
import { JogoService } from '../jogo.service';

@Component({
  selector: 'app-lista-jira',
  templateUrl: './lista-jira.component.html',
  styleUrls: ['./lista-jira.component.css']
})
export class ListaJiraComponent {
  @ViewChild('filtro', { static: false }) private filtro: InputLoadComponent;
  @Output() private votarIssue: EventEmitter<any> = new EventEmitter();

  public isLoadFiltro: boolean = false;
  public isValidFiltro: boolean = true;
  public conNovaPontuacao: Subscription;

  private columnsIssue: Array<PoTableColumn> = [
    //{ property: 'id', label: 'ID' },
    { property: 'descricao', label: 'Descrição' },
    { property: 'voto', label: 'Pontos' }
  ]

  private listaIssue: Array<any> = []

  private actions: Array<PoTableAction> = [
    { action: this.tableVotar.bind(this), icon: 'po-icon-export', label: 'Votar' }
  ];

  constructor(
    public jogoService: JogoService
  ) { }

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

  public buscarFiltro(): void {
    let filtro: string = this.filtro.texto

    if (!filtro) {
      this.isValidFiltro = true;
      return
    }

    this.isLoadFiltro = true;

    this.jogoService.listaIssueJira(filtro)
      .then((issues: Array<any>) => {
        this.listaIssue = issues
        this.isValidFiltro = true
      })
      .catch(err => {
        this.isValidFiltro = false
      })
      .then(() => {
        this.isLoadFiltro = false
      })
  }
}
