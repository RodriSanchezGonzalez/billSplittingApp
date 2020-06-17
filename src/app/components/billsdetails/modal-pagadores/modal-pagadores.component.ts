import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FacturasService } from 'src/app/services/facturas.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modal-pagadores',
  templateUrl: './modal-pagadores.component.html',
  styleUrls: ['./modal-pagadores.component.scss'],
})
export class ModalPagadoresComponent implements OnInit {
  @Output() eventoGuardarImportesDePagadores: EventEmitter<
    null
  > = new EventEmitter();
  @Output() eventoCancelarModal: EventEmitter<null> = new EventEmitter();

  constructor(
    private toastr: ToastrService,
    public _facturaService: FacturasService
  ) {}

  ngOnInit(): void {
    console.log(this._facturaService.facturaAEditar.pagadores);
  }

  emitirEventoCancelar() {
    this.eventoCancelarModal.emit();
  }
  emitirEventoGuardar() {
    let totalFactura: number = 0;

    this._facturaService.facturaAEditar.pagadores.forEach(
      (pagador) => (totalFactura += pagador.total)
    );
    debugger;
    if (this._facturaService.facturaAEditar.total !== totalFactura) {
      this.toastr.error('The total don´t suit with the bill');
    } else {
      this.eventoGuardarImportesDePagadores.emit();
    }
  }
}
