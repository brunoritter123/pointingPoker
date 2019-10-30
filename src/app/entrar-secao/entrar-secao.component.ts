import { Component, OnInit } from '@angular/core';
import { Router } from '../../../node_modules/@angular/router';
import { AuthService } from '../app.auth.service';
import { PoNotificationService, PoDialogService, PoSwitchLabelPosition } from '@portinari/portinari-ui';

@Component({
  selector: 'app-entrar-secao',
  templateUrl: './entrar-secao.component.html',
  styleUrls: ['./entrar-secao.component.css'],
  providers: [PoNotificationService, PoDialogService]
})
export class EntrarSecaoComponent implements OnInit {

  public idSala = '';
  public jogador = true;
  public integraJira = false;
  public nome    = '';
  public switchLabelPosition: PoSwitchLabelPosition = PoSwitchLabelPosition.Left;

  constructor(
    private thfNotification: PoNotificationService,
    private router: Router,
    public authService: AuthService,
    private thfAlert: PoDialogService
  ) { }

  ngOnInit() {
    if (!!this.authService.name) {
      this.idSala = this.authService.idSala;
      this.nome = this.authService.name;
      this.jogador = this.authService.isJogador;
      this.integraJira = this.authService.isIntegraJira;
    }
  }

  public confirmLogin(): void {
    this.thfAlert.confirm({
      title: 'Atenção',
      message: 'Não foi possível ler o cookie de identificação.',
      confirm: () => this.authService.saveConfig(this.idSala, this.nome, this.jogador, this.integraJira)
    });
  }

  public entrar(local) {
    const goConfig = local == 'configuracao';
    this.authService.saveConfig(this.idSala, this.nome, this.jogador, this.integraJira)
  
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
