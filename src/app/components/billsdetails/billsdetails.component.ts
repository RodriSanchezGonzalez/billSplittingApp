import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import {
  ServicioContactosService,
  Contacto,
} from 'src/app/services/servicio-contactos.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-billsdetails',
  templateUrl: './billsdetails.component.html',
  styleUrls: ['./billsdetails.component.scss'],
})
export class BillsdetailsComponent implements OnInit {
  cantidadCuenta: number;
  tipSeleccionado: string;
  splitSeleccionado: string;
  contactosDeFactura: Contacto[] = [];
  propinaManual: number;

  constructor(
    private activatedRoute: ActivatedRoute,
    private route: Router,
    private location: Location,
    private _servicioContacto: ServicioContactosService,
    private toastr: ToastrService
  ) {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.cantidadCuenta = params['cantidad'];
      console.log(this.cantidadCuenta);
    });
  }

  ngOnInit(): void {
    this.contactosDeFactura = this._servicioContacto.getContactosDeFactura();
  }

  navegar(cadena?: string) {
    if (!cadena) {
      this.location.back();
    } else {
      this.route.navigate([cadena]);
    }
  }

  mostratDetalleFinal() {
    if (this._servicioContacto.getContactosDeFactura().length == 0) {
      this.toastr.error('You must choose the contacts first');
    } else {
      this.toastr.success(this.detalleDeFactura());
      this._servicioContacto.terminaFactura();
      setTimeout(() => this.route.navigate(['/']), 2000);
    }
  }

  detalleDeFactura() {
    let detalleFinal: string;

    return this.contactosDeFactura
      .map(
        (contacto: Contacto) =>
          contacto.nombre +
          ' must pay $' +
          (this.cantidadCuenta / this.contactosDeFactura.length).toFixed(2)
      )
      .join('<br>');
  }
}
