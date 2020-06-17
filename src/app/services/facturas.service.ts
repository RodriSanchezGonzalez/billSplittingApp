import { Injectable } from '@angular/core';
import { MockApiService } from '../lib/servicio/mock-api.service';
import { Factura } from '../interfaces/factura';
import { User } from '../interfaces/user';
import { Pagador } from '../interfaces/pagador';
import { UsersService } from './users.service';
import { obtenerTiposDeFacturas } from '../lib/backend/backend';
import { TipoDeFacturaDTO } from '../lib/servicio/Responses/responses.model';
import {
  TipoDeFacturaModelo,
  TipoDeReparticionModelo,
} from '../lib/backend/modelos.model';

@Injectable({
  providedIn: 'root',
})
export class FacturasService {
  constructor(private _mockApiService: MockApiService) {}
  public listaFacturasUsuarioActivo: Factura[];
  public facturaAEditar: Factura;
  public pagadores: User[] = [];
  public creandoFactura: boolean = false;
  public tiposDeFactura: TipoDeFacturaDTO[];

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

  limpiarPagadoresDeFacturaAnterior() {
    this.pagadores = [];
  }

  inicializarNuevaFactura(total: number, usuarioCreador: User) {
    this.facturaAEditar = {
      id: '',
      total: total,
      estaPagada: false,
      tipoDeReparticion: null,
      tipoDeFacturaId: null,
      creadorId: usuarioCreador.id,
      fechaDeCreacion: null,
      desplegado: false,
      pagadores: [],
    };
  }

  creaContactosDeFactura(contactos: User[], usuarioActivo: User) {
    contactos.forEach((contacto) => {
      this.pagadores.push({
        id: contacto.id,
        nombre: contacto.nombre,
        apellidos: contacto.apellidos,
        telefono: contacto.telefono,
        avatarURL: contacto.avatarURL,
        fechaDeCreacion: contacto.fechaDeCreacion,
      });
    });
    this.pagadores.push(usuarioActivo);
    this.añadirPagadoresALaFactura(usuarioActivo);
  }

  crearNuevaFactura(usuarioActivo: User) {
    if (
      this.facturaAEditar.tipoDeReparticion ===
      TipoDeReparticionModelo.Especifica
    ) {
      this._mockApiService
        .crearFactura$(this.facturaAEditar)
        .subscribe((factura) => {
          this.creandoFactura = true;
          this.pagadores = [];
          this.facturaAEditar = null;
          this.creandoFactura = false;
        });
    } else {
      this.rellenarTotalesAPartesIguales();
    }
  }
  rellenarTotalesAPartesIguales() {
    this.facturaAEditar.pagadores.forEach(
      (pagador) =>
        (pagador.total =
          this.facturaAEditar.total / this.facturaAEditar.pagadores.length)
    );
  }
  añadirPagadoresALaFactura(usuarioActivo: User) {
    this.facturaAEditar.pagadores = [];
    this.pagadores.forEach((pagadorFactura) => {
      this.facturaAEditar.pagadores.push({
        facturaId: this.facturaAEditar.id,
        usuarioId: pagadorFactura.id,
        total: 0,
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
  obtenerTiposDeFacturas() {
    this._mockApiService
      .obtenerTiposDeFacturas$()
      .subscribe((tiposDeFactura) => (this.tiposDeFactura = tiposDeFactura));
  }

  obtenerNombreDelPagador(pagador: Pagador) {
    return this.pagadores.find(
      (pagadorConNombre) => pagador.usuarioId === pagadorConNombre.id
    );
  }
}
