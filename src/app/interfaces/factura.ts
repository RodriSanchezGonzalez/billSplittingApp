import { TipoDeReparticionModelo } from './tipo-reparticion-modelo.enum';
import { Pagador } from './pagador';
import { User } from './user';

export interface Factura {
  id: string;
  total: number;
  estaPagada: boolean;
  tipoDeReparticion: TipoDeReparticionModelo;
  tipoDeFacturaId: string;
  creadorId: string;
  fechaDeCreacion: Date;
  desplegado: boolean;
  pagadores: Pagador[];
  usuariosPagadores: User[];
  haPagadoElUsuarioActivo: boolean;
}
