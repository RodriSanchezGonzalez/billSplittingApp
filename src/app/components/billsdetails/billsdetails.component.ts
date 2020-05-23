import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import {
  ServicioContactosService,
  Contacto,
} from 'src/app/services/servicio-contactos.service';
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

  constructor(
    private activatedRoute: ActivatedRoute,
    private route: Router,
    private location: Location,
    private _servicioContacto: ServicioContactosService
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
}
