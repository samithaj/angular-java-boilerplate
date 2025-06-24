import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { OrderService } from '../services/order.service';
import { Order } from '../services/order.model';

@Component({
  selector: 'app-order-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule
  ],
  template: `<form [formGroup]="form" (ngSubmit)="submit()">
    <div formArrayName="lines">
      <div *ngFor="let line of lines.controls; let i=index" [formGroupName]="i">
        <input formControlName="productId" placeholder="Product ID">
        <input formControlName="quantity" placeholder="Qty" type="number">
      </div>
    </div>
    <button mat-button type="button" (click)="addLine()">Add Line</button>
    <button mat-button type="submit">Save</button>
  </form>`,
  styleUrls: []
})
export class OrderDialogComponent {
  form!: FormGroup;

  get lines() {
    return this.form.get('lines') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private service: OrderService,
    private dialogRef: MatDialogRef<OrderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Order | null
  ) {
    this.form = this.fb.group({
      id: [],
      orderDate: ['', Validators.required],
      status: ['NEW'],
      customerId: ['', Validators.required],
      lines: this.fb.array([])
    });

    if (data) {
      this.form.patchValue(data as any);
      data.lines.forEach(line => this.lines.push(this.fb.group({ productId: [line.productId], quantity: [line.quantity] })));
    } else {
      this.addLine();
    }
  }

  addLine() {
    this.lines.push(this.fb.group({ productId: [], quantity: [1] }));
  }

  submit() {
    if (this.form.invalid) return;
    this.service.create(this.form.value as Order).subscribe(res => this.dialogRef.close(res));
  }
}
