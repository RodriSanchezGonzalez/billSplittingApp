import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillscannerComponent } from './billscanner.component';

describe('BillscannerComponent', () => {
  let component: BillscannerComponent;
  let fixture: ComponentFixture<BillscannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillscannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillscannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
