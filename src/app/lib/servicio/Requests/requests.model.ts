export class CrearFacturaDTO {
  total: number;
  tipoDeReparticion: number;
  tipoDeFacturaId: number;
  pagadores: Array<PagadorDTO>;
  creadorId: string;
}
export class CrearUsuarioDTO {
  nombre: string;
  apellidos: string;
  telefono: string;
  avatarURL: string;
}

export interface PagadorDTO {
  usuarioId: string;
  total: number;
}
