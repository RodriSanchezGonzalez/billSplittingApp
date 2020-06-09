import { Injectable } from '@angular/core';
import { MockApiService } from '../lib/servicio/mock-api.service';
import { User } from '../interfaces/user';
import { Router } from '@angular/router';
import { Credencial } from '../interfaces/credencial';
import { FacturasService } from './facturas.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  public usuarios: User[];
  public usuariosSugeridos: User[];
  public usuarioActivo: User;
  public cargandoUsuarioActivo: boolean;

  constructor(
    private mockApiService: MockApiService,
    private router: Router,
    private facturasService: FacturasService
  ) {}

  obtenerUsuarioConectado() {
    this.cargandoUsuarioActivo = true;
    this.mockApiService
      .obtenerUsuarioConectado$()
      .subscribe((usuario: User) => {
        this.usuarioActivo = usuario;
        this.cargandoUsuarioActivo = false;
        if (this.usuarioActivo) {
          this.facturasService.obtenerFacturas(this.usuarioActivo.id);
        }
      });
  }

  public obtenerTodosLosUsuarios() {
    this.usuarios = [];
    this.mockApiService.obtenerUsuarios$().subscribe((usuarios: User[]) => {
      this.usuarios = usuarios;
    });
  }

  public obtenerLosUsuariosSugeridos() {
    this.usuariosSugeridos = [];
    this.mockApiService
      .obtenerSugeridosPorUsuarioId$(this.usuarioActivo.id)
      .subscribe((usuariosSugeridos: User[]) => {
        this.usuariosSugeridos = usuariosSugeridos;
      });
  }

  iniciarSesionConUsuarioDemo(usuario: User) {
    let credenciales: Credencial;
    credenciales = {
      id: usuario.id,
    };

    this.mockApiService.login$(credenciales).subscribe((token) => {
      localStorage.setItem('token', token);
      this.obtenerUsuarioConectado();
      this.router.navigateByUrl('/billsList');
    });
  }
}
