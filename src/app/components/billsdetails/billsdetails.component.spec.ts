import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillsdetailsComponent } from './billsdetails.component';

describe('BillsdetailsComponent', () => {
  let component: BillsdetailsComponent;
  let fixture: ComponentFixture<BillsdetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillsdetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillsdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
