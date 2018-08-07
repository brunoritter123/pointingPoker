import { Component, Input } from '@angular/core';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-observador',
  templateUrl: './observador.component.html'
})
export class ObservadorComponent {
  @Input() observadores: Array<User>;

}
