import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Factura } from 'src/app/interfaces/factura';
import { FacturasService } from 'src/app/services/facturas.service';
import { User } from 'src/app/interfaces/user';
import { TipoDeReparticionModelo } from 'src/app/interfaces/tipo-reparticion-modelo.enum';
import { UsersService } from 'src/app/services/users.service';
@Component({
  selector: 'app-billsdetails',
  templateUrl: './billsdetails.component.html',
  styleUrls: ['./billsdetails.component.scss'],
})
export class BillsdetailsComponent implements OnInit {
  cantidadCuenta: number;
  tipSeleccionado: string;
  splitSeleccionado: string;
  propinaManual: number;
  TipoDeReparticionModelo = TipoDeReparticionModelo;

  constructor(
    private activatedRoute: ActivatedRoute,
    private route: Router,
    private location: Location,
    private toastr: ToastrService,
    public facturaService: FacturasService,
    private userService: UsersService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      if (params['facturaId'] !== 'idTemporal') {
        this.facturaService.obtenerFacturaPorId(params['facturaId']);
        this.facturaService.getPagadoresDeFactura(params['facturaId']);
      }
    });

    this.activatedRoute.params.subscribe((params) => {
      if (params['facturaId'] === 'idTemporal') {
        this.activatedRoute.queryParams.subscribe((queryParams) => {
          this.facturaService.inicializarNuevaFactura(
            queryParams['cantidad'],
            this.userService.usuarioActivo
          );
        });
      }
    });
  }

  navegar(cadena?: string) {
    if (!cadena) {
      this.location.back();
    } else {
      this.route.navigate([cadena]);
    }
  }

  mostratDetalleFinal() {
    if (this.facturaService.pagadores.length == 0) {
      this.toastr.error('You must choose the contacts first');
    }

    if (this.facturaService.facturaAEditar.tipoDeReparticion === null) {
      this.toastr.error('You must choose the split type first');
    } else {
      this.toastr.success('Bill created succesfully');
      this.facturaService.crearNuevaFactura(this.userService.usuarioActivo);

      setTimeout(() => this.route.navigate(['/billsList']), 2000);
    }
  }

  estaDividaAPartesIguales(tipoReparticion: TipoDeReparticionModelo) {
    return tipoReparticion === TipoDeReparticionModelo.Igualitaria;
  }

  seleccionarTipoDeReparticion(tipoDeReparticion: TipoDeReparticionModelo) {
    this.facturaService.facturaAEditar.tipoDeReparticion = tipoDeReparticion;
  }

  estanVisualizandoFactura() {
    return this.facturaService.facturaAEditar.fechaDeCreacion;
  }
}
