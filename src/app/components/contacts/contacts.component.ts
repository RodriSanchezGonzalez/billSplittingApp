import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
})
export class ContactsComponent implements OnInit {
  constructor(private route: Router) {}

  ngOnInit(): void {}

  navegar(cadena: string) {
    this.route.navigate([cadena], { queryParamsHandling: 'preserve' });
  }
}
