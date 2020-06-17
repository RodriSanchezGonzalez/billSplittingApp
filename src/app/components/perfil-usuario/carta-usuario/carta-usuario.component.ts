import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-carta-usuario',
  templateUrl: './carta-usuario.component.html',
  styleUrls: ['./carta-usuario.component.scss'],
})
export class CartaUsuarioComponent implements OnInit {
  @Input() usuario: User;

  constructor() {}

  ngOnInit(): void {}
}
