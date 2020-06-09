export class CrearFacturaDTO {
  total: number;
  tipoDeReparticion: number;
  tipoDeFacturaId: string;
  pagadores: Array<PagadorDTO>;
  creadorId: string;
}
export class CrearUsuarioDTO {
  nombre: string;
  apellidos: string;
  telefono: string;
}

export interface PagadorDTO {
  usuarioId: string;
  total: number;
}

export interface CredencialesDTO {
  id: string;
}
