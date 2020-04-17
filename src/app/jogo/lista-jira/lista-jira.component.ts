import { Component, Input, ViewChild, Output, EventEmitter, ViewEncapsulation, OnInit } from '@angular/core';
import { PoTableColumn, PoTableAction } from '@portinari/portinari-ui';
import { InputLoadComponent } from '../../lib/component/input-load/input-load.component';
import { Subscriber, Subscription, Subject } from 'rxjs';
import { JogoService } from '../jogo.service';
import { Issue } from '../../models/issue.model';
import { Board } from '../../models/board.model';
import { Sprint } from '../../models/sprint.model';
import { debounceTime } from 'rxjs/operators';
import { AuthService } from '../../app.auth.service';

@Component({
  selector: 'app-lista-jira',
  templateUrl: './lista-jira.component.html',
  styleUrls: ['./lista-jira.component.css']
})
export class ListaJiraComponent implements OnInit {
  @ViewChild('projeto', { static: false }) private projeto: InputLoadComponent;
  @Output() private votarIssue: EventEmitter<Issue> = new EventEmitter();

  public isLoadProjeto: boolean = false;
  public isValidProjeto: boolean = true;
  public conNovaPontuacao: Subscription;
  public heightTable: number = 0;
  public sprint: Sprint;
  public opcoesSprint: Array<any> = [];
  public hasSprint: boolean = false;
  public board: string;
  public opcoesBoard: Array<any> = [];
  public hasBoard: boolean = false;
  public isLoadIssues: boolean = false;
  public hasIssue: boolean = false;

  public readonly columnsIssue: Array<PoTableColumn> = [
    { property: 'id', label: 'Issue', color: this.corLinha },
    { property: 'descricao', label: 'Descrição', color: this.corLinha },
    { property: 'ponto', label: 'Pontos', color: this.corLinha },
    {
      property: 'acao', label: 'Ações', type: 'icon', icons: [
        {
          action: this.removeIssue.bind(this),
          color: 'color-07',
          icon: 'po-icon-close',
          tooltip: 'Retirar',
          value: 'remover'
        },
        {
          action: this.abrirIssueUnica.bind(this),
          icon: 'po-icon-edit',
          tooltip: 'Abrir',
          value: 'abrir'
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

  public listaIssue: Array<Issue> = []
  public buscarIssueEvent: Subject<any> = new Subject<any>()
  public buscarSprintEvent: Subject<any> = new Subject<any>()

  constructor(
    public jogoService: JogoService,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    if (!!this.authService.projetoJira) {
      this.buscarBoard(this.authService.projetoJira, this.authService.boardJira)
    }

    this.buscarIssueEvent
      .pipe(
        debounceTime(1000) // executa a ação do switchMap após 1,5 segundo
      ).subscribe(() => {
        this.buscarIssue()
      });

    this.buscarSprintEvent
      .pipe(
        debounceTime(1000) // executa a ação do switchMap após 1,5 segundo
      ).subscribe(() => {
        this.buscarSprint()
      });
  }

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
   * @param projeto Projeto para buscar os boards
   * @param codBoard Código do Board do projeto para buscar as sprints
   */
  public buscarBoard(projeto: string = this.projeto.texto, codBoard: string = ''): void {

    if (!projeto) {
      this.isValidProjeto = true;
      return
    }

    this.isLoadProjeto = true;

    this.jogoService.getBoardJira(projeto)
      .then((boards: Array<Board>) => {
        this.opcoesBoard = boards
        this.board = undefined
        this.hasBoard = this.opcoesBoard.length > 0
        this.isValidProjeto = this.hasBoard
        if (this.isValidProjeto) {
          this.authService.setCookie('projetoJira', projeto)
        }

        if (!!codBoard && this.opcoesBoard.filter(b => b.value == codBoard).length == 1) {
          this.board = codBoard
          this.buscarSprint()

        } else if (this.opcoesBoard.length == 1) {
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

  public buscarSprint(board: string = this.board): void {
    if (!board) {
      return
    }

    this.jogoService.getSprintJira(board)
      .then((listSprint: Array<Sprint>) => {
        this.opcoesSprint = listSprint
        this.hasSprint = this.opcoesSprint.length > 0
        this.sprint = undefined
  
        if (this.hasSprint) {
          this.authService.setCookie('boardJira', board)
        }

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

    this.isLoadIssues = true;

    this.jogoService.listaIssueJira(sprint)
      .then((issues: Array<Issue>) => {
        this.listaIssue = issues
        this.hasIssue = this.listaIssue.length > 0
        if (this.listaIssue.length > 7) {
          this.heightTable = 350
        } else {
          this.heightTable = 0
        }

        this.isLoadIssues = false;
      })
      .catch(() => {
        this.isLoadIssues = false;
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

  /**
   * Abri uma issue no browse
   */
  public abrirIssueUnica(issue: Issue) {
    window.open(this.authService.baseUrlJira + '/browse/' + issue.id, '_blank')
  }

  /**
   * Abri todas a issues da tabela no browse
   */
  public abrirIssue(issues: Array<Issue> = this.listaIssue) {
    issues.forEach(issue => {
      window.open(this.authService.baseUrlJira + '/browse/' + issue.id, '_blank');
    });
  }
}
