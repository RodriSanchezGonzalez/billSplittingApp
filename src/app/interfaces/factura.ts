import { TipoDeReparticionModelo } from './tipo-reparticion-modelo.enum';

export interface Factura {
  id: string;
  total: number;
  estaPagada: boolean;
  tipoDeReparticion: TipoDeReparticionModelo;
  tipoDeFacturaId: string;
  creadorId: string;
  fechaDeCreacion: Date;
  desplegado: boolean;
}
