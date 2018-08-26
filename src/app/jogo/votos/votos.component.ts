import { Component, Input} from '@angular/core';
import { User } from '../../models/user.model';
import { JogoService } from '../jogo.service';
import { ThfDialogService } from '@totvs/thf-ui/services/thf-dialog/thf-dialog.service';

@Component({
  selector: 'app-votos',
  templateUrl: './votos.component.html',
  styleUrls: ['./votos.component.css'],
  providers: [ThfDialogService]
})
export class VotosComponent {
  @Input() jogadores: Array<User>;
  @Input() fimJogo: boolean;

  constructor(
    private jogoService: JogoService,
    private thfAlert: ThfDialogService) {}

  public remove(jogador: User): void {
    if (jogador.status === 'OFF') {
      this.confirmRemove(jogador);
    }
  }

  public confirmRemove(jogador: User): void {
    this.thfAlert.confirm({
      title: 'Atenção',
      message: 'Deseja remover o usuário da sala?',
      confirm: () => this.jogoService.sendRemove(jogador.idUser)
    });
  }

}
