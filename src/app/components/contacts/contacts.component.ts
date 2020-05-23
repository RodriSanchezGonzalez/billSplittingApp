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
  }

  navegar(cadena?: string) {
    if (!cadena) {
      this.location.back();
    } else {
      this.route.navigate([cadena], { queryParamsHandling: 'preserve' });
    }
  }

  seleccionaSugerido(contacto: Contacto) {
    for (let index = 0; index < this.listaContactos.length; index++) {
      if (this.listaContactos[index].nombre.indexOf(contacto.nombre, 0) > -1) {
        this.listaContactos[index].esContactoSeleccionado = !this
          .listaContactos[index].esContactoSeleccionado;
      }
    }
  }

  envioContactosDetalleFactura() {
    this._contactoServicio.creaContactosDeFactura(
      this.listaContactos.filter((contacto) => contacto.esContactoSeleccionado)
    );
    console.log(this._contactoServicio.getContactosDeFactura());
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
