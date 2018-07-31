import { Carta } from './carta.model';

export class Estatistica {
  constructor(
    public carta: Carta,
    public votos: number = 0,
  ) {}
}
