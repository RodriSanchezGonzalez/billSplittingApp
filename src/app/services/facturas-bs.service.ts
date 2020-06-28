import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Factura } from '../interfaces/factura';
import { TipoDeFacturaDTO } from '../lib/servicio/Responses/responses.model';
import { MockApiService } from '../lib/servicio/mock-api.service';
import { User } from '../interfaces/user';
import { Pagador } from '../interfaces/pagador';
import {
  TipoDeFacturaModelo,
  TipoDeReparticionModelo,
} from '../lib/backend/modelos.model';
import { faTable } from '@fortawesome/free-solid-svg-icons';

@Injectable({
  providedIn: 'root',
})
export class FacturasBSService {
  private _facturaSeleccionada$: BehaviorSubject<Factura> = new BehaviorSubject(
    undefined
  );
  // public pagadores: User[] = []; Esto ya está en la factura
  private _creandoFactura$: BehaviorSubject<boolean> = new BehaviorSubject(
    undefined
  );
  private _tiposDeFactura$: BehaviorSubject<
    TipoDeFacturaDTO[]
  > = new BehaviorSubject(undefined);

  constructor(private _mockApiService: MockApiService) {}

  public obtenerFacturaSeleccionada$() {
    return this._facturaSeleccionada$.asObservable();
  }

  public actualizarFacturaSeleccionada(factura: Factura) {
    this._facturaSeleccionada$.next(factura);
  }
  public obtenerCreandoFactura$() {
    return this._creandoFactura$.asObservable();
  }

  public actualizarCreandoFactura(estaCreandoFactura: boolean) {
    this._creandoFactura$.next(estaCreandoFactura);
  }
  public obtenerTiposDeFactura$() {
    return this._tiposDeFactura$.asObservable();
  }

  public actualizarTiposDeFactura(tiposDeFactura: TipoDeFacturaDTO[]) {
    this._tiposDeFactura$.next(tiposDeFactura);
  }

  inicializarNuevaFactura(total: number, usuarioCreador: User) {
    let facturaAEditar: Factura = {
      id: '',
      total: total,
      estaPagada: false,
      tipoDeReparticion: null,
      tipoDeFacturaId: null,
      creadorId: usuarioCreador.id,
      fechaDeCreacion: null,
      desplegado: false,
      pagadores: [],
      usuariosPagadores: [],
      haPagadoElUsuarioActivo: false,
    };

    this.actualizarFacturaSeleccionada(facturaAEditar);
  }

  creaContactosDeFactura(
    contactos: User[],
    usuarioActivo: User,
    factura: Factura
  ) {
    debugger;
    contactos.forEach((contacto) => {
      factura.usuariosPagadores.push({
        id: contacto.id,
        nombre: contacto.nombre,
        apellidos: contacto.apellidos,
        telefono: contacto.telefono,
        avatarURL: contacto.avatarURL,
        fechaDeCreacion: contacto.fechaDeCreacion,
      });
      factura.pagadores.push({
        facturaId: factura.id,
        usuarioId: contacto.id,
        total: 0,
        estaPagada: false,
      });
    });
    factura.usuariosPagadores.push(usuarioActivo);
    factura.pagadores.push({
      facturaId: factura.id,
      usuarioId: usuarioActivo.id,
      total: 0,
      estaPagada: false,
    });
    this.actualizarFacturaSeleccionada(factura);
  }

  pagarFactura(factura: Factura) {
    this._mockApiService
      .pagarFacturaPorId$(factura.id)
      .subscribe(() => console.log('Factura Pagada'));
  }

  obtenerTiposDeFacturas() {
    this._mockApiService
      .obtenerTiposDeFacturas$()
      .subscribe((tiposDeFactura) =>
        this.actualizarTiposDeFactura(tiposDeFactura)
      );
  }

  crearNuevaFactura(factura: Factura, usuarioActivo: User) {
    if (factura.tipoDeReparticion === TipoDeReparticionModelo.Igualitaria) {
      this.pagadoresAPartesIguales(factura);
    }
    this._mockApiService.crearFactura$(factura).subscribe((factura) => {
      this.actualizarCreandoFactura(true);
      this.actualizarFacturaSeleccionada(undefined);
      this.actualizarCreandoFactura(false);
    });
  }

  pagadoresAPartesIguales(factura: Factura) {
    factura.pagadores.forEach(
      (pagador) => (pagador.total = factura.total / factura.pagadores.length)
    );
  }
}
