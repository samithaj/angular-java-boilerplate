import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CustomerService } from '../services/customer.service';
import { Customer } from '../services/customer.model';
import { AddressService } from '../../address/services/address.service';
import { AddressPage } from '../../address/services/address.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-customer-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './customer-dialog.component.html',
  styleUrl: './customer-dialog.component.css'
})
export class CustomerDialogComponent {
  form!: FormGroup;
  addresses$!: Observable<AddressPage>;

  constructor(
    private fb: FormBuilder,
    private service: CustomerService,
    private addressService: AddressService,
    private dialogRef: MatDialogRef<CustomerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Customer | null
  ) {
    this.form = this.fb.group({
      id: [],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      addressId: []
    });

    if (data) {
      this.form.patchValue(data);
    }

    this.addresses$ = this.addressService.getAll();
  }

  submit() {
    if (this.form.invalid) {
      return;
    }
    this.service.save(this.form.value as Customer).subscribe({
      next: res => this.dialogRef.close(res),
      error: () => this.dialogRef.close(null)
    });
  }

  cancel() {
    this.dialogRef.close(null);
  }
}
