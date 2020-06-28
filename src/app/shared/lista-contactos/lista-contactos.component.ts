import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import { UsuariosBSService } from 'src/app/services/usuarios-bs.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-lista-contactos',
  templateUrl: './lista-contactos.component.html',
  styleUrls: ['./lista-contactos.component.scss'],
})
export class ListaContactosComponent implements OnInit, OnDestroy {
  @Input() listaDeContactosAMostrar: User[];
  @Input() activarFunciones: boolean;
  suscripcion: Subscription;
  usuarioActivo: User;

  constructor(
    private activatedRoute: ActivatedRoute,
    public _usersService: UsuariosBSService
  ) {}

  ngOnInit(): void {
    this.suscripcion = this._usersService
      .obtenerUsuarioActivo$()
      .subscribe((usuarioActivo) => (this.usuarioActivo = usuarioActivo));
  }
  ngOnDestroy() {
    this.suscripcion.unsubscribe();
  }

  seleccionarContacto(contacto: User) {
    this._usersService.seleccionarContacto(contacto, this.usuarioActivo);
  }
}
