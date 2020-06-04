import { Injectable } from '@angular/core';
import { MockApiService } from '../lib/servicio/mock-api.service';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  public usuarios: User[];

  constructor(private mockApiService: MockApiService) {}

  getUsuarios() {
    this.mockApiService.obtenerUsuarios$().subscribe((usuarios: User[]) => {
      this.usuarios = usuarios;
      console.log(this.usuarios);
    });
  }

  demoLogin(usuario: User) {
    this.mockApiService;
  }
}
