import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Factura } from 'src/app/interfaces/factura';
import { FacturasService } from 'src/app/services/facturas.service';
import { User } from 'src/app/interfaces/user';
import { TipoDeReparticionModelo } from 'src/app/interfaces/tipo-reparticion-modelo.enum';
import { UsersService } from 'src/app/services/users.service';
import { TipoDeFacturaDTO } from 'src/app/lib/servicio/Responses/responses.model';

@Component({
  selector: 'app-billsdetails',
  templateUrl: './billsdetails.component.html',
  styleUrls: ['./billsdetails.component.scss'],
})
export class BillsdetailsComponent implements OnInit {
  cantidadCuenta: number;
  splitSeleccionado: string;
  TipoDeReparticionModelo = TipoDeReparticionModelo;
  mostrarModalDePagadores: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private route: Router,
    private location: Location,
    private toastr: ToastrService,
    public facturaService: FacturasService,
    private userService: UsersService
  ) {}

  ngOnInit(): void {
    let parametroIdFactura = this.activatedRoute.snapshot.paramMap.get(
      'facturaId'
    );
    this.facturaService.obtenerTiposDeFacturas();

    if (parametroIdFactura !== 'idTemporal') {
      this.facturaService.obtenerFacturaPorId(parametroIdFactura);
      this.facturaService.getPagadoresDeFactura(parametroIdFactura);
    } else {
      if (!this.facturaService.facturaAEditar) {
        this.activatedRoute.queryParams.subscribe((queryParams) => {
          this.facturaService.inicializarNuevaFactura(
            +queryParams['cantidad'],
            this.userService.usuarioActivo
          );
        });
      }
    }
    this.mostrarModalDePagadores = false;
  }

  navegar(cadena?: string) {
    if (!cadena) {
      this.facturaService.facturaAEditar = null;
      this.location.back();
    } else {
      this.route.navigate([cadena]);
    }
  }

  mostrarDetalleFinal() {
    if (this.facturaService.pagadores.length == 0) {
      this.toastr.error('You must choose the contacts first');
      return;
    }
    if (this.facturaService.facturaAEditar.tipoDeFacturaId === null) {
      this.toastr.error('You must choose the bill type first');
      return;
    }
    if (this.facturaService.facturaAEditar.tipoDeReparticion === null) {
      this.toastr.error('You must choose the split type first');
      return;
    } else {
      this.toastr.success('Bill created succesfully');
      this.userService.contactosDelUsuario = [];
      this.facturaService.crearNuevaFactura(this.userService.usuarioActivo);
      setTimeout(() => this.route.navigate(['/billsList']), 2000);
    }
  }

  estaDividaAPartesIguales(tipoReparticion: TipoDeReparticionModelo) {
    return tipoReparticion === TipoDeReparticionModelo.Igualitaria;
  }

  seleccionarTipoDeReparticion(tipoDeReparticion: TipoDeReparticionModelo) {
    this.facturaService.facturaAEditar.tipoDeReparticion = tipoDeReparticion;
    this.mostrarModalDePagadores =
      tipoDeReparticion === TipoDeReparticionModelo.Especifica;
  }

  estanCreandoFactura() {
    return (
      this.activatedRoute.snapshot.paramMap.get('facturaId') === 'idTemporal'
    );
  }
  asignarTipoDeFactura(tipoDeFactura: TipoDeFacturaDTO) {
    this.facturaService.facturaAEditar.tipoDeFacturaId = tipoDeFactura.id;
  }
  cancelarModal() {
    this.mostrarModalDePagadores = false;
  }

  guardarImportesDePagadores() {
    console.log('Hemos guardado modal');
    this.mostrarModalDePagadores = false;
  }
}
