import { TestBed } from '@angular/core/testing';

import { ServicioContactosService } from './servicio-contactos.service';

describe('ServicioContactosService', () => {
  let service: ServicioContactosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicioContactosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
