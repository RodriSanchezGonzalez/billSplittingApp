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
    this._userService.obtenerContactosDeUsuario(
      this._userService.usuarioActivo.id
    );
    this._userService.obtenerLosUsuariosSugeridos();
  }

  // todosMismaPropiedadDeSeleccion() {
  //   return (
  //     this.calcularNumeroSeleccionados() === this.numeroContactos() ||
  //     this.calcularNumeroSeleccionados() === 0
  //   );
  // }

  numeroContactos() {
    return this._userService.contactosDelUsuario.length;
  }

  // calcularNumeroSeleccionados() {
  //   let seleccionados: number = 0;
  //   for (
  //     let indiceContacto = 0;
  //     indiceContacto < this._userService.contactosDelUsuario.length;
  //     indiceContacto++
  //   ) {
  //     if (
  //       this._userService.contactosDelUsuario[indiceContacto]
  //         .esContactoSeleccionado
  //     ) {
  //       seleccionados++;
  //     }
  //   }
  //   return seleccionados;
  // }

  navegar(cadena?: string) {
    if (!cadena) {
      this.location.back();
    } else {
      this.route.navigate([cadena], { queryParamsHandling: 'preserve' });
    }
  }

  seleccionarContacto(contacto: User) {
    this._userService.seleccionarContacto(contacto);
    // this.todosSeleccionados = this.todosMismaPropiedadDeSeleccion();
  }

  envioContactosDetalleFactura() {
    let contactosSeleccionados = this._userService.contactosDelUsuario.filter(
      (contacto) => contacto.esContactoSeleccionado
    );
    this._facturaService.creaContactosDeFactura(
      contactosSeleccionados,
      this._userService.usuarioActivo
    );
    this.navegar();
  }

  filtrarContactos() {
    debugger;
    let textoBusqueda: string = this.textoBusqueda;
    if (textoBusqueda === '' || !textoBusqueda) {
      return;
    } else {
      this._userService.usuariosSugeridos = this._userService.contactosDelUsuario.filter(
        (contacto) =>
          contacto.nombre
            .toLowerCase()
            .indexOf(textoBusqueda.toLowerCase(), 0) > -1
      );
    }
  }
}
