import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { UsersService } from 'src/app/services/users.service';
import { User } from 'src/app/interfaces/user';
import { FacturasService } from 'src/app/services/facturas.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
})
export class ContactsComponent implements OnInit {
  textoBusqueda: string;
  todosSeleccionados: boolean;

  constructor(
    private route: Router,
    private location: Location,
    public _userService: UsersService,
    private _facturaService: FacturasService
  ) {}

  ngOnInit(): void {
    this.todosSeleccionados = false;
    this._userService.obtenerTodosLosUsuarios();
    this._userService.obtenerLosUsuariosSugeridos();
  }

  seleccionarTodos() {
    this.todosSeleccionados = !this.todosSeleccionados;
    if (this.todosMismaPropiedadDeSeleccion()) {
      this.revertirSeleccionados();
    } else {
      this.rellenarContactosNoSeleccionados();
    }
  }

  rellenarContactosNoSeleccionados() {
    for (let index = 0; index < this._userService.usuarios.length; index++) {
      this._userService.usuarios[index].esContactoSeleccionado = true;
    }
    for (
      let index = 0;
      index < this._userService.usuariosSugeridos.length;
      index++
    ) {
      this._userService.usuariosSugeridos[index].esContactoSeleccionado = true;
    }
  }

  revertirSeleccionados() {
    for (
      let indiceContacto = 0;
      indiceContacto < this._userService.usuarios.length;
      indiceContacto++
    ) {
      this._userService.usuarios[indiceContacto].esContactoSeleccionado = !this
        ._userService.usuarios[indiceContacto].esContactoSeleccionado;
    }
    for (
      let indiceContacto = 0;
      indiceContacto < this._userService.usuariosSugeridos.length;
      indiceContacto++
    ) {
      this._userService.usuariosSugeridos[
        indiceContacto
      ].esContactoSeleccionado = !this._userService.usuariosSugeridos[
        indiceContacto
      ].esContactoSeleccionado;
    }
  }

  todosMismaPropiedadDeSeleccion() {
    return (
      this.calcularNumeroSeleccionados() === this.numeroContactos() ||
      this.calcularNumeroSeleccionados() === 0
    );
  }

  numeroContactos() {
    return this._userService.usuarios.length;
  }

  calcularNumeroSeleccionados() {
    let seleccionados: number = 0;
    for (
      let indiceContacto = 0;
      indiceContacto < this._userService.usuarios.length;
      indiceContacto++
    ) {
      if (this._userService.usuarios[indiceContacto].esContactoSeleccionado) {
        seleccionados++;
      }
    }
    return seleccionados;
  }

  navegar(cadena?: string) {
    if (!cadena) {
      this.location.back();
    } else {
      this.route.navigate([cadena], { queryParamsHandling: 'preserve' });
    }
  }

  seleccionarContacto(contacto: User) {
    this.seleccionaConctactoEnListaDeContactos(contacto);
    this.seleccionaConctactoEnListaDeSugeridos(contacto);
    this.todosSeleccionados = this.todosMismaPropiedadDeSeleccion();
  }

  seleccionaConctactoEnListaDeContactos(contactoSeleccionado: User) {
    this.seleccionarUsuarioDeLaLista(
      contactoSeleccionado,
      this._userService.usuarios
    );
  }
  seleccionaConctactoEnListaDeSugeridos(contactoSeleccionado: User) {
    if (this._userService.usuariosSugeridos.length > 0) {
      this.seleccionarUsuarioDeLaLista(
        contactoSeleccionado,
        this._userService.usuariosSugeridos
      );
    }
  }

  seleccionarUsuarioDeLaLista(
    contactoSeleccionado: User,
    listaUsuarios: User[]
  ) {
    listaUsuarios.find(
      (usuario) => usuario.nombre === contactoSeleccionado.nombre
    ).esContactoSeleccionado = !contactoSeleccionado.esContactoSeleccionado;
  }

  envioContactosDetalleFactura() {
    let contactoSeleccionados = this._userService.usuarios.filter(
      (contacto) => contacto.esContactoSeleccionado
    );
    this._facturaService.creaContactosDeFactura(contactoSeleccionados);
    this.navegar();
  }

  filtrarContactos() {
    let textoBusqueda: string = this.textoBusqueda;
    if (textoBusqueda === '' || !textoBusqueda) {
      return;
    } else {
      this._userService.usuariosSugeridos = this._userService.usuarios.filter(
        (contacto) =>
          contacto.nombre
            .toLowerCase()
            .indexOf(textoBusqueda.toLowerCase(), 0) > -1
      );
    }
  }
}
