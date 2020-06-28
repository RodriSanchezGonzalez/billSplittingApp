import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Factura } from 'src/app/interfaces/factura';
import { FacturasService } from 'src/app/services/facturas.service';
import { User } from 'src/app/interfaces/user';
import { TipoDeReparticionModelo } from 'src/app/interfaces/tipo-reparticion-modelo.enum';
import { UsersService } from 'src/app/services/users.service';
import { TipoDeFacturaDTO } from 'src/app/lib/servicio/Responses/responses.model';
import { FacturasBSService } from 'src/app/services/facturas-bs.service';
import { UsuariosBSService } from 'src/app/services/usuarios-bs.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-billsdetails',
  templateUrl: './billsdetails.component.html',
  styleUrls: ['./billsdetails.component.scss'],
})
export class BillsdetailsComponent implements OnInit, OnDestroy {
  cantidadCuenta: number;
  splitSeleccionado: string;
  TipoDeReparticionModelo = TipoDeReparticionModelo;
  mostrarModalDePagadores: boolean;
  usuario: User;
  factura: Factura;
  suscripcionUsuario: Subscription;
  suscripcionFactura: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private route: Router,
    private location: Location,
    private toastr: ToastrService,
    public facturaService: FacturasBSService,
    private userService: UsuariosBSService
  ) {}

  ngOnInit(): void {
    this.facturaService.obtenerTiposDeFacturas();
    this.suscripcionUsuario = this.userService
      .obtenerUsuarioActivo$()
      .subscribe((usuario) => {
        this.usuario = usuario;
        let parametroIdFactura = this.activatedRoute.snapshot.paramMap.get(
          'facturaId'
        );
        if (parametroIdFactura !== 'idTemporal') {
          this.factura = this.userService.obtenerFacturaDelUsuarioPorId(
            parametroIdFactura,
            this.usuario
          );
        } else {
          this.suscripcionFactura = this.facturaService
            .obtenerFacturaSeleccionada$()
            .subscribe((factura) => {
              this.factura = factura;
              if (!factura) {
                this.activatedRoute.queryParams.subscribe((queryParams) => {
                  this.facturaService.inicializarNuevaFactura(
                    +queryParams['cantidad'],
                    usuario
                  );
                });
              }
            });
        }
        this.mostrarModalDePagadores = false;
      });
  }

  ngOnDestroy() {
    if (this.suscripcionFactura) {
      this.suscripcionFactura.unsubscribe();
    }
    this.suscripcionUsuario.unsubscribe();
  }

  navegar(cadena?: string) {
    if (!cadena) {
      this.facturaService.actualizarFacturaSeleccionada(undefined);
      this.location.back();
    } else {
      this.route.navigate([cadena]);
    }
  }

  mostrarDetalleFinal() {
    if (this.factura.pagadores.length == 0) {
      this.toastr.error('You must choose the contacts first');
      return;
    }
    if (this.factura.tipoDeFacturaId === null) {
      this.toastr.error('You must choose the bill type first');
      return;
    }
    if (this.factura.tipoDeReparticion === null) {
      this.toastr.error('You must choose the split type first');
      return;
    } else {
      this.toastr.success('Bill created succesfully');
      debugger;
      this.facturaService.crearNuevaFactura(this.factura, this.usuario);
      this.userService.obtenerUsuarioConectado();
      setTimeout(() => this.route.navigate(['/billsList']), 2000);
    }
  }

  estaDividaAPartesIguales(tipoReparticion: TipoDeReparticionModelo) {
    return tipoReparticion === TipoDeReparticionModelo.Igualitaria;
  }

  seleccionarTipoDeReparticion(tipoDeReparticion: TipoDeReparticionModelo) {
    this.factura.tipoDeReparticion = tipoDeReparticion;
    this.mostrarModalDePagadores =
      tipoDeReparticion === TipoDeReparticionModelo.Especifica;
    this.facturaService.actualizarFacturaSeleccionada(this.factura);
  }

  estanCreandoFactura() {
    return (
      this.activatedRoute.snapshot.paramMap.get('facturaId') === 'idTemporal'
    );
  }
  asignarTipoDeFactura(tipoDeFactura: TipoDeFacturaDTO) {
    this.factura.tipoDeFacturaId = tipoDeFactura.id;
    this.facturaService.actualizarFacturaSeleccionada(this.factura);
  }
  cancelarModal() {
    this.mostrarModalDePagadores = false;
  }

  guardarImportesDePagadores() {
    console.log('Hemos guardado modal');
    this.mostrarModalDePagadores = false;
  }
}
