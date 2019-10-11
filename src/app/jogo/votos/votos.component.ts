import { Component, Input} from '@angular/core';
import { User } from '../../models/user.model';
import { JogoService } from '../jogo.service';
import { PoDialogService } from '@portinari/portinari-ui';
import { Sala } from '../../models/sala.model';

@Component({
  selector: 'app-votos',
  templateUrl: './votos.component.html',
  styleUrls: ['./votos.component.css'],
  providers: []
})
export class VotosComponent {
  @Input() jogadores: Array<User>;
  @Input() observadores: Array<User>;
  @Input() fimJogo: boolean;
  @Input() isJogador: boolean;
  @Input() myId: string;
  @Input() configSala: Sala;

  constructor(
    private jogoService: JogoService,
    private thfAlert: PoDialogService) {}

  public remove(jogador: User): void {
    if (this.podeRemover(jogador)) {
      this.confirmRemove(jogador);
    }
  }

  public confirmRemove(jogador: User): void {
    this.thfAlert.confirm({
      title: 'Atenção',
      message: `Deseja remover o '${jogador.nome}' da sala?`,
      confirm: () => this.jogoService.sendRemove(jogador.idUser)
    });
  }

  public podeRemover(jogador: User):boolean {
    return jogador.status === 'OFF' && this.jogoService.isPodeExcAcao( this.configSala.removerJogador, this.isJogador, this.observadores)
  }

}
