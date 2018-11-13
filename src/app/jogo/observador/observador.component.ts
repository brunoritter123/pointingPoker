import { Component, Input } from '@angular/core';
import { User } from '../../models/user.model';
import { JogoService } from '../jogo.service';
import { ThfDialogService } from '@totvs/thf-ui/services/thf-dialog/thf-dialog.service';

@Component({
  selector: 'app-observador',
  templateUrl: './observador.component.html',
  providers: []
})
export class ObservadorComponent {
  @Input() observadores: Array<User>;
  @Input() myId: string;

  constructor(
    private jogoService: JogoService,
    private thfAlert: ThfDialogService
  ) { }

  public remove(user: User): void {
    if (user.status === 'OFF') {
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
}
