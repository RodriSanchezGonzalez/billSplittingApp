export class CrearFacturaDTO {
  total: number;
  tipoDeReparticion: number;
  tipoDeFacturaId: number;
  pagadores: Array<PagadorDTO>;
  creadorId: string;
}

export interface PagadorDTO {
  usuarioId: string;
  total: number;
}
