import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BillscannerComponent } from './components/billscanner/billscanner.component';
import { BillsdetailsComponent } from './components/billsdetails/billsdetails.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { LoginComponent } from './components/login/login.component';
import { BillsListComponent } from './components/bills-list/bills-list.component';
import { AuthGuard } from './guards/auth.guard';
import { NotAuthGuard } from './guards/not-auth.guard';

const RUTAS: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  {
    path: 'billscanner',
    component: BillscannerComponent,
    canActivate: [NotAuthGuard],
  },
  {
    path: 'facturas/:facturaId',
    component: BillsdetailsComponent,
    canActivate: [NotAuthGuard],
  },
  {
    path: 'billsList',
    component: BillsListComponent,
    canActivate: [NotAuthGuard],
  },
  {
    path: 'contacts',
    component: ContactsComponent,
    canActivate: [NotAuthGuard],
  },
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(RUTAS)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
