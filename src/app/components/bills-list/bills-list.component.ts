import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { FacturasService } from 'src/app/services/facturas.service';
import { Factura } from 'src/app/interfaces/factura';
@Component({
  selector: 'app-bills-list',
  templateUrl: './bills-list.component.html',
  styleUrls: ['./bills-list.component.scss'],
})
export class BillsListComponent implements OnInit {
  desplegado: boolean;

  constructor(
    private route: Router,
    private location: Location,
    private toastr: ToastrService,
    public facturasService: FacturasService
  ) {}

  ngOnInit(): void {
    this.desplegado = false;
    this.facturasService.obtenerFacturas(
      '77baf3f2-e2d1-42c5-b5fd-57ac681b4554'
    );
  }

  navegar(cadena?: string) {
    if (!cadena) {
      this.location.back();
    } else {
      this.route.navigate([cadena]);
    }
  }

  borrarFactura() {
    this.toastr
      .warning(
        "<br /><button type='button' value='yes' class='boton-confirmacion' >Yes</button>",
        'Are you sure you want to delete this item?',
        {
          enableHtml: true,
          closeButton: true,
        }
      )
      .onTap.subscribe(() => console.log('confirmado'));
  }

  desplegarFactura(factura: Factura) {
    factura.desplegado = !factura.desplegado;
  }
}
