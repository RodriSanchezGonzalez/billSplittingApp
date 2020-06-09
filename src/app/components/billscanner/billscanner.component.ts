import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-billscanner',
  templateUrl: './billscanner.component.html',
  styleUrls: ['./billscanner.component.scss'],
})
export class BillscannerComponent implements OnInit {
  esCuentaManual: boolean;
  cantidadManual: number;
  escaneandoCuenta: boolean;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.esCuentaManual = false;
    this.escaneandoCuenta = false;
  }

  escaneoCuenta() {
    this.cantidadManual = null;
    if (this.escaneandoCuenta) {
      window.alert('Está escaneando no me toque li botone');
    } else {
      this.escaneandoCuenta = true;
      this.esCuentaManual = false;
      let cuentaRandom: number = Math.random() * 100;
      setTimeout(() => {
        this.escaneandoCuenta = false;
        this.router.navigate(['/facturas/idTemporal'], {
          queryParams: { cantidad: cuentaRandom.toFixed(2) },
        });
      }, 3000);
    }
  }

  generaImporte(evento: any) {
    this.escaneandoCuenta = false;
    this.esCuentaManual = true;
    console.log(evento.target.value);
    this.cantidadManual = evento.target.value;
  }

  navegar(cadena?: string) {
    this.router.navigate([cadena], {
      queryParams: { cantidad: this.cantidadManual },
    });
  }
}
