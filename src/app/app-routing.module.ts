import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BillscannerComponent } from './components/billscanner/billscanner.component';
import { BillsdetailsComponent } from './components/billsdetails/billsdetails.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { LoginComponent } from './components/login/login.component';

const RUTAS: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'billscanner', component: BillscannerComponent },
  { path: 'billdetails', component: BillsdetailsComponent },
  { path: 'contacts', component: ContactsComponent },
  { path: 'login', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(RUTAS)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
