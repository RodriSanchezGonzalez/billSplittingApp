import { Component, OnInit } from '@angular/core';
import { MockApiService } from './lib/servicio/mock-api.service';
import { UsersService } from './services/users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'billSplittingApp';

  constructor(
    private _mockApiService: MockApiService,
    public _userService: UsersService
  ) {}

  ngOnInit(): void {
    this._mockApiService.iniciarBackendConDatosDeLocalStorage();
    this._userService.obtenerUsuarioConectado();
  }
}
