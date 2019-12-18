import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';

@Component({
  selector: 'app-input-load',
  templateUrl: './input-load.component.html',
  styleUrls: ['./input-load.component.css']
})
export class InputLoadComponent implements OnInit {
  @Input() pMaxlength: Number = 9999;
  @Input() isLoad: Boolean = false;
  @Input() pPlaceholder: string = '';
  @Input() isValid: Boolean = true;
  @Output() execKeyUp: EventEmitter<any> = new EventEmitter();
  public texto: string = '';

  private subjectEvent: Subject<any> = new Subject<any>()

  constructor() {
  }

  ngOnInit(): void {
    this.subjectEvent
      .pipe(
        debounceTime(1500) // executa a ação do switchMap após 1,5 segundo
      ).subscribe(async function (arg) {
        const texto: string = arg['texto']
        const execKeyUp: EventEmitter<any> = arg['exec']
        execKeyUp.emit(texto)
      });
  }

  public setValue(texto: string) {
    this.texto = texto
    this.execKeyUp.emit(texto)
  }

  public emitTexto() {
    this.subjectEvent.next({ texto: this.texto, exec: this.execKeyUp });
  }
}
