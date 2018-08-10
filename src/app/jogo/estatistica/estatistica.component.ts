import { Component, OnInit, Input } from '@angular/core';
import { Estatistica } from '../../models/estatistica.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-estatistica',
  templateUrl: './estatistica.component.html'
})
export class EstatisticaComponent implements OnInit {
  @Input() jogadores: Array<User>;

  public pontuacao: Array<Estatistica>;
  public maisVotado: string;

  ngOnInit() {
    let existeArray: boolean;
    let novoPonto: Estatistica;

    this.pontuacao = [];

    this.jogadores.forEach(jogador => {
      existeArray = false;

      this.pontuacao.forEach(ponto => {
        if (ponto.carta.label === jogador.voto.label ) {
          existeArray = true;
          ponto.votos += 1;
        }
      });

      if (!existeArray) {
        novoPonto = new Estatistica(jogador.voto, 1);
        this.pontuacao.push(novoPonto);
      }

      this.pontuacao.sort( (a: Estatistica , b: Estatistica) => {
        let ret: number = b.votos - a.votos;
        if (ret === 0) {
          ret = b.carta.value - a.carta.value;
        }

        return ret;
      });

      this.maisVotado = this.pontuacao[0].carta.label;
    });
  }
}
