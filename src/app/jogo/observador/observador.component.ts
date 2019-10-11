import { Component, Input } from '@angular/core';
import { User } from '../../models/user.model';
import { JogoService } from '../jogo.service';
import { ThfDialogService } from '@totvs/thf-ui';
import { Sala } from '../../models/sala.model';

@Component({
  selector: 'app-observador',
  templateUrl: './observador.component.html',
  providers: []
})
export class ObservadorComponent {
  @Input() observadores: Array<User>;
  @Input() myId: string;
  @Input() isJogador: boolean;
  @Input() configSala: Sala;

  constructor(
    private jogoService: JogoService,
    private thfAlert: ThfDialogService
  ) { }

  public remove(user: User): void {
    if (this.podeRemover(user)) {
      this.confirmRemove(user);
    }
  }

  public confirmRemove(user: User): void {
    this.thfAlert.confirm({
      title: 'Atenção',
      message: `Deseja remover o '${user.nome}' da sala?`,
      confirm: () => this.jogoService.sendRemove(user.idUser)
    });
  }

  public podeRemover(jogador: User):boolean {
    return jogador.status === 'OFF' && this.jogoService.isPodeExcAcao( this.configSala.removerAdm, this.isJogador, this.observadores)
  }
}
