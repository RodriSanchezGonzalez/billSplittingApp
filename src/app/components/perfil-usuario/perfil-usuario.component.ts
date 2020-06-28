import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UsersService } from 'src/app/services/users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/interfaces/user';
import { Location } from '@angular/common';
import { UsuariosBSService } from 'src/app/services/usuarios-bs.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.component.html',
  styleUrls: ['./perfil-usuario.component.scss'],
})
export class PerfilUsuarioComponent implements OnInit, OnDestroy {
  formPerfil: FormGroup;
  usuarioPerfil: User;
  suscripciones: Subscription[];

  constructor(
    public _userService: UsuariosBSService,
    private activatedRoute: ActivatedRoute,
    private route: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.suscripciones = [];
    let usuarioIdURL = this.activatedRoute.snapshot.paramMap.get('usuarioId');
    this.suscripciones.push(
      this._userService.obtenerUsuarioActivo$().subscribe((usuarioActivo) => {
        if (usuarioActivo.id === usuarioIdURL) {
          if (!usuarioActivo.contactos) {
            this._userService.obtenerContactosDeUsuario(usuarioActivo);
          }
          this.usuarioPerfil = usuarioActivo;
        } else {
          this._userService.obtenerTodosLosUsuarios();
          this.suscripciones.push(
            this._userService.obtenerUsuarios$().subscribe((usuarios) => {
              if (usuarios) {
                this.usuarioPerfil = usuarios.find(
                  (usuario) => usuario.id === usuarioIdURL
                );
                this._userService.obtenerContactosDeUsuario(this.usuarioPerfil);
              }
            })
          );
        }
      })
    );
  }

  ngOnDestroy() {
    this.suscripciones.forEach((suscripcion) => suscripcion.unsubscribe());
  }

  navegar(cadena?: string) {
    if (!cadena) {
      this.usuarioPerfil = null;
      this.location.back();
    } else {
      this.route.navigate([cadena]);
    }
  }

  rellenarPerfilDelUsuario() {}
}
