import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BillscannerComponent } from './components/billscanner/billscanner.component';
import { BillsdetailsComponent } from './components/billsdetails/billsdetails.component';
import { ContactsComponent } from './components/contacts/contacts.component';

const RUTAS: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'billscanner' },
  { path: 'billscanner', component: BillscannerComponent },
  { path: 'billdetails', component: BillsdetailsComponent },
  { path: 'contacts', component: ContactsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(RUTAS)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
