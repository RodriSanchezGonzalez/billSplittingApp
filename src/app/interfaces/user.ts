import { Factura } from './factura';

export interface User {
  id: string;
  nombre: string;
  apellidos: string;
  telefono: string;
  avatarURL: string;
  fechaDeCreacion: Date;
  demoActivada?: boolean;
  esContactoSeleccionado?: boolean;
  totalAlCrearFactura?: number;
  facturas?: Factura[];
  sugeridos?: User[];
  contactos?: User[];
}
