import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import {
  ServicioContactosService,
  Contacto,
} from 'src/app/services/servicio-contactos.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
})
export class ContactsComponent implements OnInit {
  listaContactos: Contacto[] = [];
  listaContactosSugerida: Contacto[] = [];
  textoBusqueda: string;
  todosSeleccionados: boolean;

  constructor(
    private route: Router,
    private location: Location,
    private _contactoServicio: ServicioContactosService
  ) {}

  ngOnInit(): void {
    this.todosSeleccionados = false;
    this.listaContactos = this._contactoServicio.getContactos();
    this.listaContactosSugerida = this._contactoServicio.getContactosFiltrado(
      5
    );
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
    for (let index = 0; index < this.listaContactos.length; index++) {
      this.listaContactos[index].esContactoSeleccionado = true;
    }
  }

  revertirSeleccionados() {
    for (
      let indiceContacto = 0;
      indiceContacto < this.listaContactos.length;
      indiceContacto++
    ) {
      this.listaContactos[indiceContacto].esContactoSeleccionado = !this
        .listaContactos[indiceContacto].esContactoSeleccionado;
    }
  }

  todosMismaPropiedadDeSeleccion() {
    return (
      this.calcularNumeroSeleccionados() === this.numeroContactos() ||
      this.calcularNumeroSeleccionados() === 0
    );
  }

  numeroContactos() {
    return this.listaContactos.length;
  }

  calcularNumeroSeleccionados() {
    let seleccionados: number = 0;
    for (
      let indiceContacto = 0;
      indiceContacto < this.listaContactos.length;
      indiceContacto++
    ) {
      if (this.listaContactos[indiceContacto].esContactoSeleccionado) {
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

  seleccionarContacto(contacto: Contacto) {
    contacto.esContactoSeleccionado = !contacto.esContactoSeleccionado;
    this.todosSeleccionados = this.todosMismaPropiedadDeSeleccion();
  }

  seleccionaSugerido(contactoSeleccionado: Contacto) {
    for (let index = 0; index < this.listaContactos.length; index++) {
      if (this.listaContactos[index].nombre === contactoSeleccionado.nombre) {
        this.listaContactos[index].esContactoSeleccionado = !this
          .listaContactos[index].esContactoSeleccionado;
      }
    }
  }

  envioContactosDetalleFactura() {
    let contactoSeleccionados = this.listaContactos.filter(
      (contacto) => contacto.esContactoSeleccionado
    );
    this._contactoServicio.creaContactosDeFactura(contactoSeleccionados);
    this.navegar();
  }

  filtrarContactos() {
    let textoBusqueda: string = this.textoBusqueda;
    if (textoBusqueda === '' || !textoBusqueda) {
      this.listaContactosSugerida = this._contactoServicio.getContactosFiltrado(
        5
      );
    } else {
      this.listaContactosSugerida = this.listaContactos.filter(
        (contacto) =>
          contacto.nombre
            .toLowerCase()
            .indexOf(textoBusqueda.toLowerCase(), 0) > -1
      );
    }
  }
}
