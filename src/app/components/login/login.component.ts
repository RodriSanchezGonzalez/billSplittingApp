import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { faSignature } from '@fortawesome/free-solid-svg-icons';
import { UsersService } from 'src/app/services/users.service';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;
  loginForm: FormGroup;
  faSignature = faSignature;
  clickEnDemo: boolean;
  usuariosDemo: User[] = [];

  constructor(
    private formbuilder: FormBuilder,
    private userService: UsersService
  ) {
    this.userService.getUsuarios();
  }

  ngOnInit(): void {
    this.loginForm = this.formbuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
    this.clickEnDemo = false;
  }

  login() {
    console.log(this.loginForm);
  }

  mostrarUsuariosDemo() {
    this.usuariosDemo = [];
    this.clickEnDemo = !this.clickEnDemo;
    this.obtenerTresUsuarios();
  }

  obtenerTextoDemo() {
    return this.clickEnDemo ? 'Exit' : 'User Demo';
  }

  obtenerTresUsuarios() {
    for (let index = 0; index < 3; index++) {
      this.usuariosDemo.push(this.userService.usuarios[index]);
      console.log(this.usuariosDemo);
    }
  }
}
