import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { FacturasService } from 'src/app/services/facturas.service';
import { Factura } from 'src/app/interfaces/factura';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-bills-list',
  templateUrl: './bills-list.component.html',
  styleUrls: ['./bills-list.component.scss'],
})
export class BillsListComponent implements OnInit {
  desplegado: boolean;

  constructor(
    private router: Router,
    private location: Location,
    private toastr: ToastrService,
    public facturasService: FacturasService,
    public userService: UsersService
  ) {}

  ngOnInit(): void {
    this.desplegado = false;
    this.facturasService.obtenerFacturas(this.userService.usuarioActivo.id);
  }

  navegar(cadena?: string) {
    if (!cadena) {
      this.location.back();
    } else {
      this.router.navigate([cadena]);
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

  editarFactura(factura: Factura) {
    // this.facturasService.abrirFacturaParaEdicion(factura);
    // this.router.navigateByUrl(`/facturas/${factura.id}`);

    this.toastr.warning('Avaible on next version. Sorry :(');
  }

  abrirNuevaFactura() {
    this.router.navigateByUrl(`/billscanner`);
  }

  pagarFactura(facturaAPagar: Factura) {
    this.facturasService.pagarFactura(facturaAPagar);
    this.facturasService.obtenerFacturas(this.userService.usuarioActivo.id);
  }

  visualizarFactura(factura: Factura) {
    this.router.navigateByUrl(`/facturas/${factura.id}`);
  }

  elUsuarioActivoHaPagadoLaFactura(factura: Factura) {
    return factura.pagadores.find(
      (pagador) => pagador.usuarioId === this.userService.usuarioActivo.id
    ).estaPagada
      ? true
      : false;
  }
}
