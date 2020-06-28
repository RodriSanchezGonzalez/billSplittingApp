import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { User } from 'src/app/interfaces/user';
import { UsuariosBSService } from 'src/app/services/usuarios-bs.service';
import { FacturasBSService } from 'src/app/services/facturas-bs.service';
import { Subscription } from 'rxjs';
import { Factura } from 'src/app/interfaces/factura';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
})
export class ContactsComponent implements OnInit, OnDestroy {
  textoBusqueda: string;
  todosSeleccionados: boolean;
  usuario: User;
  factura: Factura;
  suscripcionUsuario: Subscription;
  suscripcionFactura: Subscription;

  constructor(
    private route: Router,
    private location: Location,
    public _userService: UsuariosBSService,
    private _facturaService: FacturasBSService
  ) {}

  ngOnInit(): void {
    this.todosSeleccionados = false;

    this.suscripcionUsuario = this._userService
      .obtenerUsuarioActivo$()
      .subscribe((usuario) => {
        this.usuario = usuario;
        if (!this.usuario.contactos) {
          this._userService.obtenerContactosDeUsuario(this.usuario);
          this._userService.obtenerLosUsuariosSugeridos(this.usuario);
        }
        this.suscripcionFactura = this._facturaService
          .obtenerFacturaSeleccionada$()
          .subscribe((factura) => (this.factura = factura));
      });
  }

  ngOnDestroy() {
    this.suscripcionUsuario.unsubscribe();
    this.suscripcionFactura.unsubscribe();
  }

  navegar(cadena?: string) {
    if (!cadena) {
      this.location.back();
    } else {
      this.route.navigate([cadena], { queryParamsHandling: 'preserve' });
    }
  }

  seleccionarContacto(contacto: User) {
    this._userService.seleccionarContacto(contacto, this.usuario);

    // this.todosSeleccionados = this.todosMismaPropiedadDeSeleccion();
  }

  envioContactosDetalleFactura() {
    let contactosSeleccionados = this.usuario.contactos.filter(
      (contacto) => contacto.esContactoSeleccionado
    );
    this._facturaService.creaContactosDeFactura(
      contactosSeleccionados,
      this.usuario,
      this.factura
    );
    this.navegar();
  }

  filtrarContactos() {
    debugger;
    let textoBusqueda: string = this.textoBusqueda;
    if (textoBusqueda === '' || !textoBusqueda) {
      return;
    } else {
      this.usuario.sugeridos = this.usuario.contactos.filter(
        (contacto) =>
          contacto.nombre
            .toLowerCase()
            .indexOf(textoBusqueda.toLowerCase(), 0) > -1
      );
    }
  }
}
