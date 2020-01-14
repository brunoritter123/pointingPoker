import { Component, Input } from '@angular/core';
import { Sala } from '../../models/sala.model';
import { PoTableColumn } from '@portinari/portinari-ui';

@Component({
  selector: 'app-regua',
  templateUrl: './regua.component.html',
  styleUrls: ['./regua.component.css']
})
export class ReguaComponent {
  public regua: Array<any> = []

  @Input()
  set configSala(configSala: Sala){
    this.regua = configSala.cartas.filter((carta) => !!carta.nmUltHist)
  }

  columnsRegua: Array<PoTableColumn> = [
    { property: 'label', label: 'Ponto' },
    { property: 'nmUltHist', label: 'Última História' },
  ]

  constructor() { }
}
