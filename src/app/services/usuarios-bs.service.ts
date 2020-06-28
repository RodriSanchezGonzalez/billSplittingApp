import { Injectable } from '@angular/core';
import { MockApiService } from '../lib/servicio/mock-api.service';
import { Router } from '@angular/router';
import { FacturasService } from './facturas.service';
import { User } from '../interfaces/user';
import { BehaviorSubject } from 'rxjs';
import { Factura } from '../interfaces/factura';
import { Credencial } from '../interfaces/credencial';

@Injectable({
  providedIn: 'root',
})
export class UsuariosBSService {
  // El behavior subject hace que cuando alguien se suscriba y el dato cambie de valor detecte automaticamente las modificaciones a través de un evento
  private _usuarios$: BehaviorSubject<User[]> = new BehaviorSubject(undefined);
  private _usuarioActivo$: BehaviorSubject<User> = new BehaviorSubject(
    undefined
  );
  private _cargandoUsuarioActivo$: BehaviorSubject<
    boolean
  > = new BehaviorSubject(undefined);
  private _todosLosContactoSeleccionados$: BehaviorSubject<
    boolean
  > = new BehaviorSubject(undefined);
  // public perfilUsuario: User;
  // Acceder al array de usuarios

  constructor(
    private _mockApiService: MockApiService,
    private _router: Router,
    private _facturasService: FacturasService
  ) {}

  public obtenerUsuarios$() {
    return this._usuarios$.asObservable();
  }

  public actualizarUsuarios(usuarios: User[]) {
    this._usuarios$.next(usuarios);
  }
  public obtenerUsuarioActivo$() {
    return this._usuarioActivo$.asObservable();
  }

  public actualizarUsuarioActivo(usuarioActivo: User) {
    this._usuarioActivo$.next(usuarioActivo);
  }

  public obtenerCargandoUsuarioActivo$() {
    return this._cargandoUsuarioActivo$.asObservable();
  }

  public actualizarCargandoUsuarioActivo(estaCargando: boolean) {
    this._cargandoUsuarioActivo$.next(estaCargando);
  }
  public obtenerTodosLosContactosSeleccionados$() {
    return this._todosLosContactoSeleccionados$.asObservable();
  }

  public actualizarTodosLosContactosSeleccionados(
    estanTodosSeleccionados: boolean
  ) {
    this._todosLosContactoSeleccionados$.next(estanTodosSeleccionados);
  }

  obtenerUsuarioConectado() {
    this.actualizarCargandoUsuarioActivo(true);
    this._mockApiService
      .obtenerUsuarioConectado$()
      .subscribe((usuario: User) => {
        if (usuario) {
          //Obtener las facturas del usuario activo
          this._mockApiService
            .obtenerFacturasPorUsuarioId$(usuario.id)
            .subscribe((facturas: Factura[]) => {
              usuario.facturas = [...facturas];
              if (facturas?.length > 0) {
                this.obtenerPagadoresDeFacturas(usuario);
              } else {
                this.actualizarUsuarioActivo(usuario);
                this.actualizarCargandoUsuarioActivo(false);
              }
            });
        } else {
          this.actualizarUsuarioActivo(undefined);
          this.actualizarCargandoUsuarioActivo(false);
        }
      });
  }

  public obtenerPagadoresDeFacturas(usuario: User) {
    usuario.facturas.forEach((factura) =>
      this._mockApiService
        .obtenerPagadoresPorFacturaId$(factura.id)
        .subscribe((pagadores) => {
          factura.pagadores = pagadores;
          factura.haPagadoElUsuarioActivo = factura.pagadores.find(
            (pagador) => pagador.usuarioId === usuario.id
          ).estaPagada;
          factura.usuariosPagadores = [];
          factura.pagadores.forEach((pagador) => {
            this._mockApiService
              .obtenerUsuarioPorId$(pagador.usuarioId)
              .subscribe((usuarioPagador) => {
                factura.usuariosPagadores.push(usuarioPagador);
                this.actualizarUsuarioActivo(usuario);
                this.actualizarCargandoUsuarioActivo(false);
              });
          });
        })
    );
  }

  public obtenerTodosLosUsuarios() {
    this._mockApiService.obtenerUsuarios$().subscribe((usuarios: User[]) => {
      this.actualizarUsuarios(usuarios);
    });
  }

  public obtenerLosUsuariosSugeridos(usuarioActivo: User) {
    this._mockApiService
      .obtenerSugeridosPorUsuarioId$(usuarioActivo.id)
      .subscribe((usuariosSugeridos: User[]) => {
        usuarioActivo.sugeridos = usuariosSugeridos;
        this.actualizarUsuarioActivo(usuarioActivo);
      });
  }

  iniciarSesionConUsuarioDemo(credencial: Credencial) {
    this._mockApiService.login$(credencial).subscribe((token) => {
      localStorage.setItem('token', token);
      this.obtenerUsuarioConectado();
      this._router.navigateByUrl('/billsList');
    });
  }

  obtenerContactosDeUsuario(usuario: User) {
    this._mockApiService
      .obtenerContactosPorUsuarioId$(usuario.id)
      .subscribe((contactos) => {
        usuario.contactos = contactos;
        this.actualizarUsuarioActivo(usuario);
      });
  }

  seleccionarContacto(usuario: User, usuarioActivo: User) {
    this.seleccionarUsuarioDeLaLista(usuario, usuarioActivo.contactos);
    this.seleccionarUsuarioDeLaLista(usuario, usuarioActivo.sugeridos);
    this.actualizarUsuarioActivo(usuarioActivo);
    this.actualizarTodosLosContactosSeleccionados(
      this.todosMismaPropiedadDeSeleccion(usuarioActivo)
    );
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
      let usuarioEncontrado = listaUsuarios.find(
        (usuario) => usuario.nombre === contactoSeleccionado.nombre
      );
      usuarioEncontrado.esContactoSeleccionado = usuarioEncontrado.esContactoSeleccionado
        ? false
        : true;
    }
  }

  seleccionarTodos(todosSeleccionados: boolean, usuarioActivo: User) {
    this.actualizarTodosLosContactosSeleccionados(todosSeleccionados);
    if (this.todosMismaPropiedadDeSeleccion(usuarioActivo)) {
      this.revertirSeleccionados(usuarioActivo);
    } else {
      this.rellenarContactosNoSeleccionados(usuarioActivo);
    }
  }

  todosMismaPropiedadDeSeleccion(usuarioActivo: User) {
    return (
      this.numeroSeleccionados(usuarioActivo) ===
      this.numeroContactos(usuarioActivo)
    );
  }

  numeroSeleccionados(usuarioActivo: User) {
    let seleccionados: number = 0;
    usuarioActivo.contactos.forEach((contacto) =>
      contacto.esContactoSeleccionado ? seleccionados++ : contacto
    );
    return seleccionados;
  }

  numeroContactos(usuarioActivo: User) {
    return usuarioActivo.contactos.length;
  }

  rellenarContactosNoSeleccionados(usuarioActivo: User) {
    this.rellenarContactosNoSeleccionadosEnLaLista(usuarioActivo.contactos);
    this.rellenarContactosNoSeleccionadosEnLaLista(usuarioActivo.sugeridos);
    this.actualizarUsuarioActivo(usuarioActivo);
  }

  rellenarContactosNoSeleccionadosEnLaLista(listaARellenar: User[]) {
    for (let index = 0; index < listaARellenar.length; index++) {
      listaARellenar[index].esContactoSeleccionado = true;
    }
  }

  revertirSeleccionados(usuarioActivo: User) {
    this.revertirSeleccionadosDeLaLista(usuarioActivo.contactos);
    this.revertirSeleccionadosDeLaLista(usuarioActivo.sugeridos);
    this.actualizarUsuarioActivo(usuarioActivo);
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

  obtenerFacturaDelUsuarioPorId(facturaID: string, usuario: User) {
    return usuario.facturas.find((factura) => factura.id === facturaID)
      ? usuario.facturas.find((factura) => factura.id === facturaID)
      : undefined;
  }
}
