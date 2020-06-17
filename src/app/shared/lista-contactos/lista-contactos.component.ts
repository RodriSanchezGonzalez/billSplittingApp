import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-lista-contactos',
  templateUrl: './lista-contactos.component.html',
  styleUrls: ['./lista-contactos.component.scss'],
})
export class ListaContactosComponent implements OnInit {
  @Input() listaDeContactosAMostrar: User[];
  @Input() activarFunciones: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    public _usersService: UsersService
  ) {}

  ngOnInit(): void {}
  seleccionarContacto(contacto: User) {
    this._usersService.seleccionarContacto(contacto);
  }
}
