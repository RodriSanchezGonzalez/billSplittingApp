export interface Pagador {
  facturaId: string;
  usuarioId: string;
  total: number;
  estaPagada: boolean;
}
