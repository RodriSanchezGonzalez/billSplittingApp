import { UsuarioDTO, FacturaDTO } from '../servicio/Responses/responses.model';

export class UsuarioModelo {
  id: string;
  nombre: string;
  apellidos: string;
  telefono: string;
  avatarURL: string;
  fechaDeCreacion: Date;

  constructor(usuarioDeBaseDeDatos: any) {
    this.id = usuarioDeBaseDeDatos.id;
    this.nombre = usuarioDeBaseDeDatos.nombre;
    this.apellidos = usuarioDeBaseDeDatos.apellidos;
    this.telefono = usuarioDeBaseDeDatos.telefono;
    this.avatarURL = usuarioDeBaseDeDatos.avatarURL;
    this.fechaDeCreacion = usuarioDeBaseDeDatos.fechaDeCreacion;
  }
}

export class FacturaModelo {
  id: string;
  total: number;
  estaPagada: boolean;
  tipoDeReparticion: TipoDeReparticionModelo;
  tipoDeFacturaId: string;
  creadorId: string;
  fechaDeCreacion: Date;
  constructor(facturaDeBaseDeDatos: any) {
    this.id = facturaDeBaseDeDatos.id;
    this.total = facturaDeBaseDeDatos.total;
    this.estaPagada = facturaDeBaseDeDatos.estaPagada;
    this.tipoDeReparticion = facturaDeBaseDeDatos.tipoDeReparticion;
    this.tipoDeFacturaId = facturaDeBaseDeDatos.tipoDeFacturaId;
    this.fechaDeCreacion = facturaDeBaseDeDatos.fechaDeCreacion;
  }
}

export class TipoDeFacturaModelo {
  id: string;
  nombre: string;
  imagenURL: string;
}

export class PagadorModelo {
  facturaId: string;
  usuarioId: string;
  total: number;
  estaPagada: boolean;

  constructor(pagadorDeBaseDeDatos: any) {
    this.facturaId = pagadorDeBaseDeDatos.facturaId;
    this.usuarioId = pagadorDeBaseDeDatos.usuarioId;
    this.total = pagadorDeBaseDeDatos.total;
    this.estaPagada = pagadorDeBaseDeDatos.estaPagada;
  }
}

export class ContactoModelo {
  usuarioId: string;
  contactoId: string;

  constructor(usuarioId, contactoId) {
    this.usuarioId = usuarioId;
    this.contactoId = contactoId;
  }
}

export enum TipoDeReparticionModelo {
  Igualitaria,
  Especifica,
}
