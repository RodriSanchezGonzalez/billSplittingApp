import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-billsdetails',
  templateUrl: './billsdetails.component.html',
  styleUrls: ['./billsdetails.component.scss'],
})
export class BillsdetailsComponent implements OnInit {
  cantidadCuenta: number;
  tipSeleccionado: string;
  splitSeleccionado: string;

  constructor(private activatedRoute: ActivatedRoute, private route: Router) {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.cantidadCuenta = params['cantidad'];
      console.log(this.cantidadCuenta);
    });
  }

  ngOnInit(): void {}

  navegar(cadena: string) {
    this.route.navigate([cadena], { queryParamsHandling: 'preserve' });
  }
}
