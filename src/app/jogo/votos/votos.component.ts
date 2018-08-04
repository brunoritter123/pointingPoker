import { Component, Input} from '@angular/core';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-votos',
  templateUrl: './votos.component.html'
})
export class VotosComponent {
  @Input() jogadores: Array<User>;
  @Input() fimJogo: boolean;

}
