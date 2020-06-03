import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-bills-list',
  templateUrl: './bills-list.component.html',
  styleUrls: ['./bills-list.component.scss'],
})
export class BillsListComponent implements OnInit {
  desplegado: boolean;
  constructor(
    private route: Router,
    private location: Location,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.desplegado = false;
  }

  navegar(cadena?: string) {
    if (!cadena) {
      this.location.back();
    } else {
      this.route.navigate([cadena]);
    }
  }

  borrarFactura() {
    this.toastr
      .warning(
        "<br /><button type='button' value='yes' class='boton-confirmacion' >Yes</button>",
        'Are you sure you want to delete this item?',
        {
          enableHtml: true,
          closeButton: true,
        }
      )
      .onTap.subscribe(() => console.log('confirmado'));
  }
}
