import { Injectable } from '@angular/core';
import { MockApiService } from '../lib/servicio/mock-api.service';
import { Factura } from '../interfaces/factura';
import { User } from '../interfaces/user';
import { Pagador } from '../interfaces/pagador';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root',
})
export class FacturasService {
  constructor(private _mockApiService: MockApiService) {}
  public listaFacturasUsuarioActivo: Factura[];
  public facturaAEditar: Factura;
  public pagadores: User[] = [];
  public creandoFactura: boolean = false;

  obtenerFacturas(usuarioID: string) {
    this._mockApiService
      .obtenerFacturasPorUsuarioId$(usuarioID)
      .subscribe((facturas: Factura[]) => {
        facturas.forEach((factura) => {
          this.rellenarPagadoresDeFactura(factura);
        });
        this.listaFacturasUsuarioActivo = facturas;
      });
  }

  abrirFacturaParaEdicion(factura: Factura) {
    this.facturaAEditar = factura;
  }

  obtenerFacturaPorId(facturaID: string) {
    this._mockApiService
      .obtenerFacturaPorId$(facturaID)
      .subscribe((factura: Factura) => (this.facturaAEditar = factura));
  }

  inicializarNuevaFactura(total: number, usuarioCreador: User) {
    this.facturaAEditar = {
      id: '',
      total: total,
      estaPagada: false,
      tipoDeReparticion: null,
      tipoDeFacturaId: '215a3785-65fe-4ba0-8477-5d3050fc46a0',
      creadorId: usuarioCreador.id,
      fechaDeCreacion: null,
      desplegado: false,
      pagadores: [],
    };
    console.log(this.facturaAEditar);
  }

  creaContactosDeFactura(contactos: User[]) {
    this.pagadores = contactos;
  }

  crearNuevaFactura(usuarioActivo: User) {
    this.añadirPagadoresALaFactura(usuarioActivo);

    this._mockApiService
      .crearFactura$(this.facturaAEditar)
      .subscribe((factura) => {
        this.creandoFactura = true;
        this.pagadores = [];
        this.facturaAEditar = null;
        this.creandoFactura = false;
      });
  }

  añadirPagadoresALaFactura(usuarioActivo: User) {
    this.facturaAEditar.pagadores.push({
      facturaId: this.facturaAEditar.id,
      usuarioId: usuarioActivo.id,
      total: this.facturaAEditar.total / this.pagadores.length + 1,
      estaPagada: false,
    });

    this.pagadores.forEach((pagadorFactura) => {
      this.facturaAEditar.pagadores.push({
        facturaId: this.facturaAEditar.id,
        usuarioId: pagadorFactura.id,
        total: this.facturaAEditar.total / this.pagadores.length + 1,
        estaPagada: false,
      });
    });
  }

  pagarFactura(factura: Factura) {
    this._mockApiService
      .pagarFacturaPorId$(factura.id)
      .subscribe(() => console.log('Factura Pagada'));
  }

  rellenarPagadoresDeFactura(factura: Factura) {
    this._mockApiService
      .obtenerPagadoresPorFacturaId$(factura.id)
      .subscribe((pagadores: Pagador[]) => {
        factura.pagadores = pagadores;
      });
  }

  getPagadoresDeFactura(facturaId: string) {
    this.pagadores = [];

    this._mockApiService
      .obtenerPagadoresPorFacturaId$(facturaId)
      .subscribe((pagadores: Pagador[]) => {
        pagadores.forEach((pagador) => {
          this._mockApiService
            .obtenerUsuarioPorId$(pagador.usuarioId)
            .subscribe((usuarioPagador: User) => {
              this.pagadores.push(usuarioPagador);
            });
        });
      });
  }
}
