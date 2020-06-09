import { Observable, of } from 'rxjs';
import * as customHttp from '../backend/backend';
import { Injectable } from '@angular/core';
import {
  UsuarioDTO,
  FacturaDTO,
  PagadorDTO,
  TipoDeFacturaDTO,
} from './Responses/responses.model';
import { CrearUsuarioDTO, CredencialesDTO } from './Requests/requests.model';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MockApiService {
  constructor() {}

  iniciarBackendConDatosDeLocalStorage(): void {
    customHttp.iniciarBackendConDatosDeLocalStorage();
  }

  obtenerUsuarioConectado$(): Observable<UsuarioDTO> {
    return customHttp.obtenerUsuarioConectado();
  }

  login$(credenciales: CredencialesDTO): Observable<string> {
    return customHttp.login(credenciales);
  }

  /* GET */

  obtenerUsuarios$(): Observable<Array<UsuarioDTO>> {
    return customHttp.obtenerUsuarios();
  }

  obtenerUsuarioPorId$(usuarioId: string): Observable<UsuarioDTO> {
    return customHttp.obtenerUsuarioPorId(usuarioId);
  }

  obtenerFacturaPorId$(facturaId: string): Observable<FacturaDTO> {
    return customHttp.obtenerFacturaPorId(facturaId);
  }

  obtenerFacturasPorUsuarioId$(
    usuarioId: string
  ): Observable<Array<FacturaDTO>> {
    return customHttp.obtenerFacturasPorUsuarioId(usuarioId);
  }

  obtenerPagadoresPorFacturaId$(
    facturaId: string
  ): Observable<Array<PagadorDTO>> {
    return customHttp.obtenerPagadoresPorFacturaId(facturaId);
  }

  obtenerSugeridosPorUsuarioId$(
    usuarioId: string
  ): Observable<Array<UsuarioDTO>> {
    return customHttp.obtenerSugeridosPorUsuarioId(usuarioId);
  }

  obtenerContactosPorUsuarioId$(
    usuarioId: string
  ): Observable<Array<UsuarioDTO>> {
    return customHttp.obtenerContactosPorUsuarioId(usuarioId);
  }

  obtenerTiposDeFacturas$(): Observable<Array<TipoDeFacturaDTO>> {
    return customHttp.obtenerTiposDeFacturas();
  }
  /* PUT */

  pagarFacturaPorId$(facturaId: string): Observable<null> {
    return customHttp.pagarFacturaPorId(facturaId);
  }

  /* POST */
  crearUsuario$(usuarioACrear: CrearUsuarioDTO): Observable<UsuarioDTO> {
    return customHttp.crearUsuario(usuarioACrear);
  }

  anadirContacto$(
    usuarioId: string,
    contactoId: string
  ): Observable<UsuarioDTO> {
    return customHttp.anadirContacto(usuarioId, contactoId);
  }

  crearFactura$(facturaACrear): Observable<FacturaDTO> {
    return customHttp.crearFactura(facturaACrear);
  }

  /* DELETE */

  eliminarContacto$(usuarioId, contactoId): Observable<null> {
    return customHttp.eliminarContacto(usuarioId, contactoId);
  }
}
