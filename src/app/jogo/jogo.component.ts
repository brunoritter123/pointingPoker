import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-jogo',
  templateUrl: './jogo.component.html',
  styleUrls: ['./jogo.component.css']
})
export class JogoComponent implements OnInit {
  public pontos(): Array<any> { 
    let val =  [
    {class: "thf-md-12" , label: "0"},
    {class: "thf-md-12" , label: "0"},
    {class: "thf-md-12" , label: "0"},
    {class: "thf-md-12" , label: "0"}
  ];

  return val
}

  constructor() { }

  ngOnInit() {
    console.log(this.pontos());
  }

}
