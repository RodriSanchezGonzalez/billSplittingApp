import { Observable, of } from 'rxjs';
import * as customHttp from '../backend/backend';
import { Injectable } from '@angular/core';
import {
  UsuarioDTO,
  FacturaDTO,
  PagadorDTO,
  TipoDeFacturaDTO,
} from './Responses/responses.model';

@Injectable({
  providedIn: 'root',
})
export class MockApiService {
  constructor() {}

  obtenerTodaLaBaseDeDatos$() {
    return customHttp.obtenerTodaLaBBDD();
  }

  /* GET */

  obtenerUsuarios$(): Observable<Array<UsuarioDTO>> {
    return customHttp.obtenerUsuarios();
  }

  obtenerUsuarioPorId$(usuarioId: string): Observable<UsuarioDTO> {
    return customHttp.obtenerUsuarioPorId(usuarioId);
  }

  obtenerFacturaPorId(facturaId: string): Observable<FacturaDTO> {
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

  /* POST */
  crearUsuario$(usuarioACrear): Observable<UsuarioDTO> {
    return customHttp.crearUsuario(usuarioACrear);
  }

  anadirContacto$(usuarioId, contactoId): Observable<UsuarioDTO> {
    return customHttp.anadirContacto(usuarioId, contactoId);
  }

  crearFactura$(facturaACrear): Observable<FacturaDTO> {
    return customHttp.crearFactura(facturaACrear);
  }

  sobreescribirBaseDeDatos$(baseDeDatos): Observable<Array<UsuarioDTO>> {
    return customHttp.sobreescribirBaseDeDatos(baseDeDatos);
  }
  /* DELETE */

  eliminarContacto$(usuarioId, contactoId) {
    return customHttp.eliminarContacto(usuarioId, contactoId);
  }
}
