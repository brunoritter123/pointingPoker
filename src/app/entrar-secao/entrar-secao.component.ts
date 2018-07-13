import { Component, OnInit } from '@angular/core';
import { ThfSwitchLabelPosition } from '@totvs/thf-ui/components/thf-field';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-entrar-secao',
  templateUrl: './entrar-secao.component.html',
  styleUrls: ['./entrar-secao.component.css']
})
export class EntrarSecaoComponent implements OnInit {

  public jogador = true;
  public nome    = '';

  constructor() { }

  ngOnInit() {
  }

  onSubmit() {  }

}
