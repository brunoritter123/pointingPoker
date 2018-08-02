import { Component, OnInit } from '@angular/core';
import { ThfSwitchLabelPosition } from '@totvs/thf-ui/components/thf-field';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '../../../node_modules/@angular/router';

@Component({
  selector: 'app-entrar-secao',
  templateUrl: './entrar-secao.component.html',
  styleUrls: ['./entrar-secao.component.css']
})
export class EntrarSecaoComponent implements OnInit {

  public jogador = true;
  public nome    = '';

  constructor(
    private activateRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    const nameUser = this.activateRoute.snapshot.params['nameUser'];
    this.nome = nameUser;
  }

  onSubmit() {  }

}
