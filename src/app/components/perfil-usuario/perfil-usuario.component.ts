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
    public _userService: UsersService,
    private activatedRoute: ActivatedRoute,
    private route: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this._userService.obtenerUsuario(params['usuarioId']);
      this._userService.obtenerContactosDeUsuario(params['usuarioId']);
    });
  }

  navegar(cadena?: string) {
    if (!cadena) {
      this.usarioPerfil = null;
      this.location.back();
    } else {
      this.route.navigate([cadena]);
    }
  }
}
