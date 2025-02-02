import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BillscannerComponent } from './components/billscanner/billscanner.component';
import { BillsdetailsComponent } from './components/billsdetails/billsdetails.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { RouterModule } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './components/login/login.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BillsListComponent } from './components/bills-list/bills-list.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RegisterComponent } from './components/register/register.component';
import { PerfilUsuarioComponent } from './components/perfil-usuario/perfil-usuario.component';
import { CrearUsuarioComponent } from './components/crear-usuario/crear-usuario.component';
import { ListaContactosComponent } from './shared/lista-contactos/lista-contactos.component';
import { CartaUsuarioComponent } from './components/perfil-usuario/carta-usuario/carta-usuario.component';
import { ModalPagadoresComponent } from './components/billsdetails/modal-pagadores/modal-pagadores.component';
import { CargandoComponent } from './shared/cargando/cargando.component';
@NgModule({
  declarations: [
    AppComponent,
    BillscannerComponent,
    BillsdetailsComponent,
    ContactsComponent,
    LoginComponent,
    BillsListComponent,
    ProfileComponent,
    RegisterComponent,
    PerfilUsuarioComponent,
    CrearUsuarioComponent,
    ListaContactosComponent,
    CartaUsuarioComponent,
    ModalPagadoresComponent,
    CargandoComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-center-center',
      enableHtml: true,
      timeOut: 1900,
    }),
    FontAwesomeModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
