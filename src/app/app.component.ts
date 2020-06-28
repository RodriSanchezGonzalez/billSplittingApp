import { Component, OnInit } from '@angular/core';
import { MockApiService } from './lib/servicio/mock-api.service';
import { UsersService } from './services/users.service';
import { UsuariosBSService } from './services/usuarios-bs.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'billSplittingApp';

  constructor(
    public _mockApiService: MockApiService,
    public _userService: UsuariosBSService
  ) {}

  ngOnInit(): void {
    this._mockApiService.iniciarBackendConDatosDeLocalStorage();
    this._userService.obtenerUsuarioConectado();
  }
}
