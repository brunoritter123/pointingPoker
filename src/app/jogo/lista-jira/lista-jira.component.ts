import { Component, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { PoTableColumn, PoTableAction } from '@portinari/portinari-ui';
import { InputLoadComponent } from '../../lib/component/input-load/input-load.component';
import { Subscriber, Subscription } from 'rxjs';
import { JogoService } from '../jogo.service';
import { Issue } from '../../models/issue.model';
import { Board } from '../../models/board.model';
import { Sprint } from '../../models/sprint.model';

@Component({
  selector: 'app-lista-jira',
  templateUrl: './lista-jira.component.html',
  styleUrls: ['./lista-jira.component.css']
})
export class ListaJiraComponent {
  @ViewChild('projeto', { static: false }) private projeto: InputLoadComponent;
  @Output() private votarIssue: EventEmitter<Issue> = new EventEmitter();

  public isLoadProjeto: boolean = false;
  public isValidProjeto: boolean = true;
  public conNovaPontuacao: Subscription;
  public heightTable: number = 0;
  public sprint: Sprint;
  public opcoesSprint: Array<any> = [];
  public hasSprint: boolean = false;
  public board: Board;
  public opcoesBoard: Array<any> = [];
  public hasBoard: boolean = false;

  private readonly columnsIssue: Array<PoTableColumn> = [
    //{ property: 'id', label: 'ID' },
    { property: 'descricao', label: 'Descrição', color: this.corLinha },
    { property: 'ponto', label: 'Pontos', color: this.corLinha },
    {
      property: 'acao', label: 'Ações', type: 'icon', icons: [
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
      ]
    }
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

  /**
   * Busca os boards do jira conforme o projeto informado
   */
  public buscarBoard(): void {
    let projeto: string = this.projeto.texto

    if (!projeto) {
      this.isValidProjeto = true;
      return
    }

    this.isLoadProjeto = true;

    this.jogoService.getBoardJira(projeto)
      .then((boards: Array<Board>) => {
        this.opcoesBoard = boards
        this.hasBoard = this.opcoesBoard.length > 0
        this.isValidProjeto = true
        if (this.opcoesBoard.length == 1) {
          this.board = this.opcoesBoard[0].value
          this.buscarSprint()
        }
      })
      .catch(err => {
        this.isValidProjeto = false
      })
      .then(() => {
        this.isLoadProjeto = false
      })
  }

  public buscarSprint(): void {
    let board: string = this.board.toString()

    if (!board) {
      return
    }

    this.jogoService.getSprintJira(board)
      .then((listSprint: Array<Sprint>) => {
        this.opcoesSprint = listSprint
        this.hasSprint = this.opcoesSprint.length > 0
        if (this.opcoesSprint.length == 1) {
          this.sprint = this.opcoesSprint[0].value
          this.buscarIssue()
        }
      })
  }

  public buscarIssue(): void {
    let sprint: string = this.sprint.toString()

    if (!sprint) {
      return
    }

    this.jogoService.listaIssueJira(sprint)
      .then((issues: Array<Issue>) => {
        this.listaIssue = issues
        if (this.listaIssue.length > 15) {
          this.heightTable = 350
        } else {
          this.heightTable = 0
        }
      })
  }


  /**
   * Remove um item da tabela
   * @param issue Objeto Issue do array da tabela
   */
  private removeIssue(issue: Issue): void {
    const rmIndex = this.listaIssue.findIndex(element => issue.id == element.id)
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
