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
  public perfilUsuario: User;
  public contactosDelUsuario: User[];
  public todosSeleccionados: boolean;

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
      .subscribe(
        (usuariosSugeridos: User[]) =>
          (this.usuariosSugeridos = usuariosSugeridos)
      );
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

  public obtenerUsuario(usuarioID: string) {
    this.mockApiService.obtenerUsuarioPorId$(usuarioID).subscribe((perfil) => {
      this.perfilUsuario = {
        id: perfil.id,
        nombre: perfil.nombre,
        apellidos: perfil.apellidos,
        telefono: perfil.telefono,
        avatarURL: perfil.avatarURL,
        fechaDeCreacion: perfil.fechaDeCreacion,
      };
    });
  }

  obtenerContactosDeUsuario(usuarioID: string) {
    this.contactosDelUsuario = [];
    this.mockApiService
      .obtenerContactosPorUsuarioId$(usuarioID)
      .subscribe((contactos) => (this.contactosDelUsuario = contactos));
  }

  seleccionarContacto(contacto: User) {
    this.seleccionarUsuarioDeLaLista(contacto, this.contactosDelUsuario);
    this.seleccionarUsuarioDeLaLista(contacto, this.usuariosSugeridos);
    this.todosSeleccionados = this.todosMismaPropiedadDeSeleccion();
  }

  seleccionarUsuarioDeLaLista(
    contactoSeleccionado: User,
    listaUsuarios: User[]
  ) {
    if (
      listaUsuarios.find(
        (usuario) => usuario.nombre === contactoSeleccionado.nombre
      )
    ) {
      let usuarioEcontrado = listaUsuarios.find(
        (usuario) => usuario.nombre === contactoSeleccionado.nombre
      );
      usuarioEcontrado.esContactoSeleccionado
        ? (usuarioEcontrado.esContactoSeleccionado = false)
        : (usuarioEcontrado.esContactoSeleccionado = true);
    }
  }

  seleccionarTodos() {
    this.todosSeleccionados = !this.todosSeleccionados;
    if (this.todosMismaPropiedadDeSeleccion()) {
      this.revertirSeleccionados();
    } else {
      this.rellenarContactosNoSeleccionados();
    }
  }

  todosMismaPropiedadDeSeleccion() {
    return this.calcularNumeroSeleccionados() === this.numeroContactos();
  }

  calcularNumeroSeleccionados() {
    let seleccionados: number = 0;
    this.contactosDelUsuario.forEach((contacto) =>
      contacto.esContactoSeleccionado ? seleccionados++ : contacto
    );
    return seleccionados;
  }

  numeroContactos() {
    return this.contactosDelUsuario.length;
  }

  rellenarContactosNoSeleccionados() {
    this.rellenarContactosNoSeleccionadosEnLaLista(this.contactosDelUsuario);
    this.rellenarContactosNoSeleccionadosEnLaLista(this.usuariosSugeridos);
  }

  rellenarContactosNoSeleccionadosEnLaLista(listaARellenar: User[]) {
    for (let index = 0; index < listaARellenar.length; index++) {
      listaARellenar[index].esContactoSeleccionado = true;
    }
  }

  revertirSeleccionados() {
    this.revertirSeleccionadosDeLaLista(this.contactosDelUsuario);
    this.revertirSeleccionadosDeLaLista(this.usuariosSugeridos);
  }

  revertirSeleccionadosDeLaLista(lista: User[]) {
    for (
      let indiceContacto = 0;
      indiceContacto < lista.length;
      indiceContacto++
    ) {
      lista[indiceContacto].esContactoSeleccionado
        ? (lista[indiceContacto].esContactoSeleccionado = false)
        : (lista[indiceContacto].esContactoSeleccionado = true);
    }
  }
}
