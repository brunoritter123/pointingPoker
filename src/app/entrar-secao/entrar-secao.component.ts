import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '../../../node_modules/@angular/router';
import { AuthService } from '../app.auth.service';
import { PoNotificationService, PoDialogService } from '@portinari/portinari-ui';

@Component({
  selector: 'app-entrar-secao',
  templateUrl: './entrar-secao.component.html',
  styleUrls: ['./entrar-secao.component.css'],
  providers: [PoNotificationService, PoDialogService]
})
export class EntrarSecaoComponent implements OnInit {

  public idSala = '';
  public jogador = true;
  public nome    = '';

  constructor(
    private activateRoute: ActivatedRoute,
    private thfNotification: PoNotificationService,
    private router: Router,
    public authService: AuthService,
    private thfAlert: PoDialogService
  ) { }

  ngOnInit() {
    const sala: string       = this.authService.idSala
    const nameUser: string   = this.authService.name
    const isJogador: boolean = this.authService.isJogador

    if (nameUser > '') {
      this.idSala = sala;
      this.nome = nameUser;
      this.jogador = isJogador;
    }
  }

  public confirmLogin(): void {
    this.thfAlert.confirm({
      title: 'Atenção',
      message: 'Não foi possível ler o cookie de identificação.',
      confirm: () => this.authService.saveConfig(this.idSala, this.nome, this.jogador)
    });
  }

  public entrar(local) {
    const goConfig = local == 'configuracao';
    this.authService.saveConfig(this.idSala, this.nome, this.jogador)
  
    if (this.authService.id === undefined) {
      this.confirmLogin();

    } else if (this.nome.trim().length < 3 || this.nome.trim().length > 12) {
      this.thfNotification.error('O nome deve ter no mínimo 3 caracteres.');

    } else if (this.idSala.trim().length < 3 || this.idSala.trim().length > 12) {
      this.thfNotification.error('O ID da Sala deve ter no mínimo 3 caracteres.');

    } else {
      this.router.navigate(
          [`/jogo/${this.idSala.trim().toUpperCase()}/${this.nome.trim()}/${this.jogador}`], 
          { queryParams: { config: goConfig } }
        );
    }
   }

   changeEvent(event: string) {
    console.log(event);
  }
}
