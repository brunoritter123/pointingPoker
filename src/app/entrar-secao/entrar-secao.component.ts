import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '../../../node_modules/@angular/router';
import { ThfNotificationService } from '@totvs/thf-ui/services/thf-notification/thf-notification.service';
import { AuthService } from '../app.auth.service';
import { ThfDialogService } from '@totvs/thf-ui/services/thf-dialog/thf-dialog.service';

@Component({
  selector: 'app-entrar-secao',
  templateUrl: './entrar-secao.component.html',
  styleUrls: ['./entrar-secao.component.css'],
  providers: [ThfNotificationService, ThfDialogService]
})
export class EntrarSecaoComponent implements OnInit {

  public idSala = '';
  public jogador = true;
  public nome    = '';

  constructor(
    private activateRoute: ActivatedRoute,
    private thfNotification: ThfNotificationService,
    private router: Router,
    public authService: AuthService,
    private thfAlert: ThfDialogService
  ) { }

  ngOnInit() {
    const sala: string = this.activateRoute.snapshot.queryParams['idSala'];
    const nameUser: string = this.activateRoute.snapshot.queryParams['nameUser'];
    const isJogador: boolean = this.activateRoute.snapshot.queryParams['isJogador'] === 'true';

    if (nameUser > '') {
      this.idSala = sala;
      this.nome = nameUser;
      this.jogador = isJogador;
    }
  }

  public confirmLogin(): void {
    this.thfAlert.confirm({
      title: 'Atenção',
      message: 'Para continuar é necessário fazer o login.',
      confirm: () => this.authService.login()
    });
  }

  public entrar() {
    if (this.authService.id === undefined) {
      this.confirmLogin();

    } else if (this.nome.trim().length < 3 || this.nome.trim().length > 12) {
      this.thfNotification.error('O nome deve ter no mínimo 3 caracteres.');

    } else if (this.idSala.trim().length < 3 || this.idSala.trim().length > 12) {
      this.thfNotification.error('O ID da Sala deve ter no mínimo 3 caracteres.');

    } else {
      this.router.navigate([`/jogo/${this.idSala.toUpperCase()}/${this.nome}/${this.jogador}`]);
    }
   }
}
