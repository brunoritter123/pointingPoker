import { Carta } from './carta.model';
import { AcoesSala } from './acoesSala.model';
import { User } from './user.model';

export class Sala {
  constructor(
    public idSala: string = '',
    public forceFimJogo: number = 0, // 0 ou 1
    public finalizar: string = AcoesSala.getDefFinalizar().value,
    public resetar: string = AcoesSala.getDefResetar().value,
    public removerJogador: string = AcoesSala.getDefRemoveJogador().value,
    public removerAdm: string = AcoesSala.getDefRemoveAdm().value,
    public cartas: Array<Carta> =
      [ {id: 1, value: 1, label: '01', type: 'default' },
        {id: 2, value: 2, label: '02', type: 'default' },
        {id: 3, value: 3, label: '03', type: 'default' },
        {id: 4, value: 5, label: '05', type: 'default' },
        {id: 5, value: 8, label: '08', type: 'default' },
        {id: 6, value: 13, label: '13', type: 'default' },
        {id: 7, value: 21, label: '21', type: 'default' },
        {id: 8, value: 34, label: '34', type: 'default' },
        {id: 9, value: 55, label: '55', type: 'default' },
        {id: 10, value: undefined, label: '?', type: 'default'}
      ]
    
  ) { } 

  

}
