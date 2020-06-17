import { Component, OnInit } from '@angular/core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-cargando',
  templateUrl: './cargando.component.html',
  styleUrls: ['./cargando.component.scss'],
})
export class CargandoComponent implements OnInit {
  faSpinner = faSpinner;

  constructor() {}

  ngOnInit(): void {}
}
