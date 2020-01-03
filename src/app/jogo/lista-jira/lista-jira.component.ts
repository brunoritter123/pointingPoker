import { Component, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { PoTableColumn, PoTableAction } from '@portinari/portinari-ui';
import { InputLoadComponent } from '../../lib/component/input-load/input-load.component';
import { Subscriber, Subscription } from 'rxjs';
import { JogoService } from '../jogo.service';
import { Issue } from '../../models/issue.model';

@Component({
  selector: 'app-lista-jira',
  templateUrl: './lista-jira.component.html',
  styleUrls: ['./lista-jira.component.css']
})
export class ListaJiraComponent {
  @ViewChild('filtro', { static: false }) private filtro: InputLoadComponent;
  @Output() private votarIssue: EventEmitter<Issue> = new EventEmitter();

  public isLoadFiltro: boolean = false;
  public isValidFiltro: boolean = true;
  public conNovaPontuacao: Subscription;

  private readonly columnsIssue: Array<PoTableColumn> = [
    //{ property: 'id', label: 'ID' },
    { property: 'descricao', label: 'Descrição', color: this.corLinha },
    { property: 'ponto', label: 'Pontos', color: this.corLinha },
    { property: 'acao', label: 'Ações', type: 'icon', icons: [
      {
        action: this.removeIssue.bind(this),
        color: 'color-07',
        icon: 'po-icon-delete',
        tooltip: 'Remover',
        value: 'remover'
      },
      {
        action: this.tableVotar.bind(this),
        icon: 'po-icon-export',
        tooltip: 'Votar',
        value: 'votar'
      }
    ]}
  ]

  private listaIssue: Array<Issue> = []

  constructor(
    public jogoService: JogoService
  ) { }

  /**
   * Seta um novo voto em um Issue para não precisar dar um get no JIRA
   *
   * @param idIssue Id da issue que foi votada
   * @param ponto Valor do ponto que foi informado
   */
  public novaPontuacao(idIssue: string, ponto: number): void {
    if (!!idIssue && !!ponto) {
      this.listaIssue.forEach(issue => {
        if (issue.id == idIssue) {
          issue.ponto = ponto
        }
      });
    }
  }

  private tableVotar(issue: Issue): void {
    this.votarIssue.emit(issue)
    issue.votada = true
  }

  public buscarFiltro(): void {
    let filtro: string = this.filtro.texto

    if (!filtro) {
      this.isValidFiltro = true;
      return
    }

    this.isLoadFiltro = true;

    this.jogoService.listaIssueJira(filtro)
      .then((issues: Array<Issue>) => {
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

  /**
   * Remove um item da tabela
   * @param issue Objeto Issue do array da tabela
   */
  private removeIssue(issue: Issue): void {
    const rmIndex = this.listaIssue.findIndex( element => issue.id == element.id)
    this.listaIssue.splice(rmIndex, 1)
  }

  /**
   * Muda a cor da linha
   * @param issue
   */
  private corLinha(issue: Issue): string {
    let cor = ''
    if (issue.votada) {
      cor = 'color-11'
    }
    return cor
  }
}
