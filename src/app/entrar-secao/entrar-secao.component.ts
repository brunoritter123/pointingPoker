import { Component, OnInit } from '@angular/core';
import { ThfSwitchLabelPosition } from '@totvs/thf-ui/components/thf-field';

@Component({
  selector: 'app-entrar-secao',
  templateUrl: './entrar-secao.component.html',
  styleUrls: ['./entrar-secao.component.css']
})
export class EntrarSecaoComponent implements OnInit {

  public jogador = true;

  constructor() { }

  ngOnInit() {
  }

}
