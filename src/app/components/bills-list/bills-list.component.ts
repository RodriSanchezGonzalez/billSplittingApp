import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { FacturasService } from 'src/app/services/facturas.service';
import { Factura } from 'src/app/interfaces/factura';
import { UsersService } from 'src/app/services/users.service';
import { UsuariosBSService } from 'src/app/services/usuarios-bs.service';
import { Subscription } from 'rxjs';
import { User } from 'src/app/interfaces/user';
import { FacturasBSService } from 'src/app/services/facturas-bs.service';

@Component({
  selector: 'app-bills-list',
  templateUrl: './bills-list.component.html',
  styleUrls: ['./bills-list.component.scss'],
})
export class BillsListComponent implements OnInit, OnDestroy {
  desplegado: boolean;
  usuario: User;
  suscripcion: Subscription;

  constructor(
    private router: Router,
    private location: Location,
    private toastr: ToastrService,
    public facturasService: FacturasBSService,
    public userService: UsuariosBSService
  ) {}

  ngOnInit(): void {
    this.desplegado = false;
    this.suscripcion = this.userService
      .obtenerUsuarioActivo$()
      .subscribe((usuarioActivo) => (this.usuario = usuarioActivo));
  }

  ngOnDestroy() {}

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
    this.toastr.warning('Avaible on next version. Sorry :(');
  }

  abrirNuevaFactura() {
    this.router.navigateByUrl(`/billscanner`);
  }

  pagarFactura(facturaAPagar: Factura) {
    this.facturasService.pagarFactura(facturaAPagar);
    this.userService.obtenerUsuarioConectado();
  }

  visualizarFactura(factura: Factura) {
    this.router.navigateByUrl(`/facturas/${factura.id}`);
  }
}
