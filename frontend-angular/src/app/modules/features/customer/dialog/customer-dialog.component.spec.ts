import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CustomerDialogComponent } from './customer-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { AddressService } from '../../address/services/address.service';

describe('CustomerDialogComponent', () => {
  let component: CustomerDialogComponent;
  let fixture: ComponentFixture<CustomerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CustomerDialogComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: null },
        { provide: MatDialogRef, useValue: { close: () => {} } },
        AddressService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerDialogComponent);
    component = fixture.componentInstance;
    spyOn(component['addressService'], 'getAll').and.returnValue(of({ content: [], totalElements: 0 }));
    fixture.detectChanges();
  });

  it('form invalid when empty', () => {
    expect(component.form.valid).toBeFalse();
  });
});
