import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AddressService } from '../services/address.service';
import { Address } from '../services/address.model';

@Component({
  selector: 'app-address-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './address-dialog.component.html',
  styleUrl: './address-dialog.component.css'
})
export class AddressDialogComponent {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private service: AddressService,
    private dialogRef: MatDialogRef<AddressDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Address | null
  ) {
    this.form = this.fb.group({
      id: [],
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: [''],
      postalCode: ['', Validators.required],
    });

    if (data) {
      this.form.patchValue(data);
    }
  }

  submit() {
    if (this.form.invalid) {
      return;
    }
    this.service.save(this.form.value as Address).subscribe({
      next: () => this.dialogRef.close(true),
      error: () => this.dialogRef.close(false)
    });
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
