import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { faSignature } from '@fortawesome/free-solid-svg-icons';
import { UsersService } from 'src/app/services/users.service';
import { User } from 'src/app/interfaces/user';
import { UsuariosBSService } from 'src/app/services/usuarios-bs.service';
import { Subscription } from 'rxjs';
import { Credencial } from 'src/app/interfaces/credencial';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  email: string;
  password: string;
  loginForm: FormGroup;
  faSignature = faSignature;
  clickEnDemo: boolean;
  usuariosDemo: User[];
  usuarios: User[];
  suscripcion: Subscription;
  constructor(
    private formbuilder: FormBuilder,
    private _userService: UsuariosBSService
  ) {}

  ngOnInit(): void {
    this.usuarios = [];

    this._userService.obtenerTodosLosUsuarios();
    this.suscripcion = this._userService
      .obtenerUsuarios$()
      .subscribe((usuarios) => (this.usuarios = usuarios));
    this.loginForm = this.formbuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
    this.clickEnDemo = false;
  }

  ngOnDestroy() {
    this.suscripcion.unsubscribe();
  }

  login() {
    let usuarioDemo: User;
    usuarioDemo = this.usuariosDemo.find((usuario) => usuario.demoActivada);

    let credenciales: Credencial;
    credenciales = {
      id: usuarioDemo.id,
    };
    this._userService.iniciarSesionConUsuarioDemo(credenciales);
  }

  mostrarUsuariosDemo() {
    this.clickEnDemo = !this.clickEnDemo;
    this.obtenerTresUsuarios();
  }

  obtenerTextoDemo() {
    return this.clickEnDemo ? 'Exit' : 'User Demo';
  }

  obtenerTresUsuarios() {
    this.usuariosDemo = this.usuarios.slice(0, 3);
  }
}
