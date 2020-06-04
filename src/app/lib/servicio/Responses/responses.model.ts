import { TipoDeReparticionModelo } from '../../backend/modelos.model';

export interface UsuarioDTO {
  id: string;
  nombre: string;
  apellidos: string;
  telefono: string;
  avatarURL: string;
  fechaDeCreacion: Date;
}

export interface FacturaDTO {
  id: string;
  total: number;
  estaPagada: boolean;
  tipoDeReparticion: TipoDeReparticionModelo;
  tipoDeFacturaId: string;
  creadorId: string;
  fechaDeCreacion: Date;
}

export interface TipoDeFacturaDTO {
  id: string;
  nombre: string;
  imagenURL: string;
}

export interface PagadorDTO {
  facturaId: string;
  usuarioId: string;
  total: number;
  estaPagada: boolean;
}

export interface ContactoDTO {
  usuarioId: string;
  contactoId: string;
}
