import { Component, OnInit } from '@angular/core';
import { MockApiService } from './lib/servicio/mock-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'billSplittingApp';
  bbdd: any;

  constructor(private mockApiService: MockApiService) {}

  ngOnInit(): void {
    this.mockApiService.obtenerTodaLaBaseDeDatos$().subscribe((datos) => {
      console.log(datos);
      let objeto = {
        nombre: 'Rodrigo',
        email: 'email.com',
      };
      this.mockApiService
        .sobreescribirBaseDeDatos$(objeto)
        .subscribe((nuevosDatos) => console.log(nuevosDatos));
    });
  }
}
