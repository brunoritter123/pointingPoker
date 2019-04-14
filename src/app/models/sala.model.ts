import { Carta } from './carta.model';

export class Sala {
  constructor(
    public idSala: string = '',
    public forceFimJogo: boolean = false,
    public jogadorFinaliza: boolean = true,
    public jogadorReseta: boolean = true,
    public cartas: Array<Carta> =
      [ {id: 1, value: 1, label: '1', type: 'default' },
        {id: 2, value: 2, label: '2', type: 'default' },
        {id: 3, value: 3, label: '3', type: 'default' },
        {id: 4, value: 5, label: '5', type: 'default' },
        {id: 5, value: 8, label: '8', type: 'default' },
        {id: 6, value: 13, label: '13', type: 'default' },
        {id: 7, value: 21, label: '21', type: 'default' },
        {id: 8, value: 34, label: '34', type: 'default' },
        {id: 9, value: 54, label: '55', type: 'default' },
        {id: 10, value: undefined, label: '?', type: 'default'}
      ]
  ) { }

  clone(obj: any): any {
    console.log(obj);
    if(typeof(obj) == "object") {
      for (const key in this) {
          console.log(key);
          if (obj.hasOwnProperty(key) && key !== "clone") {
              this[key] = obj[key];                
          }
      }
    }
  }

}
