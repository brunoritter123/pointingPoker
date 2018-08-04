import { Component, Input } from '@angular/core';
import { Estatistica } from '../../models/estatistica.model';

@Component({
  selector: 'app-estatistica',
  templateUrl: './estatistica.component.html'
})
export class EstatisticaComponent {
  @Input() maisVotado: string;
  @Input() pontuacao: Array<Estatistica>;


}
