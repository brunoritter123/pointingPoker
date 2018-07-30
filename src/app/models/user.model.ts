import { Carta } from './carta.model';

export class User {
  public id: string;
  public nome: string;
  public isJogador: boolean;
  public voto: Carta;
}
