import { Carta } from './carta.model';

export class User {
  public idUser: string;
  public socket: string;
  public status: string;
  public nome: string;
  public isJogador: boolean;
  public voto: Carta;

  static novo(obj: any): User {
    const newUser = new User;

    if (obj.hasOwnProperty('idUser')) {
      newUser.idUser = obj.idUser;
    } else {
      newUser.idUser = undefined;
    }

    if (obj.hasOwnProperty('socket')) {
      newUser.socket = obj.socket;
    } else {
      newUser.socket = undefined;
    }

    if (obj.hasOwnProperty('status')) {
      newUser.status = obj.status;
    } else {
      newUser.status = undefined;
    }

    if (obj.hasOwnProperty('nome')) {
      newUser.nome = obj.nome;
    } else {
      newUser.nome = undefined;
    }

    if (obj.hasOwnProperty('isJogador')) {
      newUser.isJogador = obj.isJogador;
    } else {
      newUser.isJogador = undefined;
    }

    if (obj.hasOwnProperty('voto') && obj.voto !== null && obj.voto !== undefined) {
      newUser.voto = obj.voto;

      if (!newUser.voto.hasOwnProperty('id')) {
        newUser.voto.id = undefined;
      }

      if (!newUser.voto.hasOwnProperty('value')) {
        newUser.voto.value = undefined;
      }

      if (!newUser.voto.hasOwnProperty('label')) {
        newUser.voto.label = undefined;
      }

      if (!newUser.voto.hasOwnProperty('type')) {
        newUser.voto.type = undefined;
      }

    } else {
      newUser.voto = { id: undefined,
                       value: undefined,
                       label: undefined,
                       type: undefined };
    }

    return newUser;
  }

}
