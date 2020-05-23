import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ServicioContactosService {
  private contactosDeFactura: Contacto[] = [];

  private contactos: Contacto[] = [
    {
      nombre: 'Ana',
      img: 'assets/img/ana.svg',
      telefono: '+91 912898102',
      esContactoSeleccionado: false,
    },
    {
      nombre: 'Carla',
      img: 'assets/img/carla.svg',
      telefono: '+91 912898102',
      esContactoSeleccionado: false,
    },
    {
      nombre: 'Carlos',
      img: 'assets/img/carlos.svg',
      telefono: '+91 912898102',
      esContactoSeleccionado: false,
    },
    {
      nombre: 'Carmen',
      img: 'assets/img/carmen.svg',
      telefono: '+91 912898102',
      esContactoSeleccionado: false,
    },
    {
      nombre: 'lucia',
      img: 'assets/img/lucia.svg',
      telefono: '+91 912898102',
      esContactoSeleccionado: false,
    },
    {
      nombre: 'Maria',
      img: 'assets/img/maria.svg',
      telefono: '+91 912898102',
      esContactoSeleccionado: false,
    },
    {
      nombre: 'Pedro',
      img: 'assets/img/pedro.svg',
      telefono: '+91 912898102',
      esContactoSeleccionado: false,
    },
  ];

  constructor() {}

  getContactosFiltrado(numero: number) {
    let contactos: Contacto[] = [];
    for (let index = 0; index < numero; index++) {
      contactos.push(this.contactos[index]);
    }
    return contactos;
  }

  getContactos = () => {
    return this.contactos;
  };

  getContactosDeFactura = () => {
    return this.contactosDeFactura;
  };

  creaContactosDeFactura(contactos: Contacto[]) {
    this.contactosDeFactura = contactos;
  }
}

export interface Contacto {
  nombre: string;
  img: string;
  telefono: string;
  esContactoSeleccionado?: boolean;
}
