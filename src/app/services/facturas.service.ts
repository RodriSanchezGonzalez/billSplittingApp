import { Injectable } from '@angular/core';
import { MockApiService } from '../lib/servicio/mock-api.service';
import { Factura } from '../interfaces/factura';

@Injectable({
  providedIn: 'root',
})
export class FacturasService {
  constructor(private mockApiService: MockApiService) {}
  public listaFacturas: Factura[];

  obtenerFacturas(usuarioID: string) {
    this.mockApiService
      .obtenerFacturasPorUsuarioId$(usuarioID)
      .subscribe((facturas: Factura[]) => {
        this.listaFacturas = facturas;
      });
  }
}
