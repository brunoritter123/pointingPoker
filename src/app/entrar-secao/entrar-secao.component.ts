import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '../../../node_modules/@angular/router';
import { ThfNotificationService } from '@totvs/thf-ui/services/thf-notification/thf-notification.service';

@Component({
  selector: 'app-entrar-secao',
  templateUrl: './entrar-secao.component.html',
  styleUrls: ['./entrar-secao.component.css'],
  providers: [ThfNotificationService]
})
export class EntrarSecaoComponent implements OnInit {

  public idSala = '';
  public jogador = true;
  public nome    = '';

  constructor(
    private activateRoute: ActivatedRoute,
    private thfNotification: ThfNotificationService,
    private router: Router,
  ) { }

  ngOnInit() {
    const nameUser: string = this.activateRoute.snapshot.params['nameUser'];
    const isJogador: boolean = this.activateRoute.snapshot.params['isJogador'] === 'true';

    if (nameUser > '') {
      this.nome = nameUser;
      this.jogador = isJogador;
    }
  }

  entrar() {
    // [routerLink]="['/jogo',nome,jogador]"
    if (this.nome.length < 3 || this.nome.length > 12) {
      this.thfNotification.error('O nome deve ter no mínimo 3 caracteres.');

    } else if (this.idSala.length < 3 || this.idSala.length > 12) {
      this.thfNotification.error('O ID da Sala deve ter no mínimo 3 caracteres.');

    } else {
      this.router.navigate([`/jogo/${this.idSala}/${this.nome}/${this.jogador}`]);
    }
   }

}
