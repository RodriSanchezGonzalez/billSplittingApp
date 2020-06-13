import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UsersService } from 'src/app/services/users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/interfaces/user';
import { Location } from '@angular/common';

@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.component.html',
  styleUrls: ['./perfil-usuario.component.scss'],
})
export class PerfilUsuarioComponent implements OnInit {
  formPerfil: FormGroup;
  usarioPerfil: User;
  avatarUrl: string;

  constructor(
    private formbuilder: FormBuilder,
    private _userService: UsersService,
    private activatedRoute: ActivatedRoute,
    private route: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this._userService
        .obtenerUsuario(params['usuarioId'])
        .subscribe((datosDeUsuario: User) => {
          this.avatarUrl = datosDeUsuario.avatarURL;
          this.formPerfil = this.formbuilder.group({
            nombre: [datosDeUsuario.nombre],
            apellidos: [datosDeUsuario.apellidos],
            telefono: [datosDeUsuario.telefono],
            fechaAlta: [datosDeUsuario.fechaDeCreacion],
          });
        });
    });
  }

  navegar(cadena?: string) {
    if (!cadena) {
      this.location.back();
    } else {
      this.route.navigate([cadena]);
    }
  }
}
