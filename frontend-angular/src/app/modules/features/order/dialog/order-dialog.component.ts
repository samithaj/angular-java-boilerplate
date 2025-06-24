import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { OrderService } from '../services/order.service';
import { Order, OrderLine } from '../services/order.model';
import { CustomerService } from '../../customer/services/customer.service';
import { ProductService } from '../../product/services/product.service';
import { Customer } from '../../customer/services/customer.model';
import { Product } from '../../product/services/product.model';

@Component({
  selector: 'app-order-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule
  ],
  template: `
    <h2 mat-dialog-title>{{isEdit ? 'Edit' : 'Add'}} Order</h2>
    
    <form [formGroup]="form" (ngSubmit)="save()">
      <mat-dialog-content>
        <div fxLayout="row" fxLayoutGap="16px">
          <mat-form-field fxFlex="50">
            <mat-label>Customer</mat-label>
            <mat-select formControlName="customerId" required>
              <mat-option *ngFor="let customer of customers" [value]="customer.id">
                {{customer.firstName}} {{customer.lastName}}
              </mat-option>
            </mat-select>
            <mat-error *ngIf="form.get('customerId')?.hasError('required')">
              Customer is required
            </mat-error>
          </mat-form-field>
          
          <mat-form-field fxFlex="50">
            <mat-label>Order Date</mat-label>
            <input matInput [matDatepicker]="picker" formControlName="orderDate" required>
            <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
            <mat-error *ngIf="form.get('orderDate')?.hasError('required')">
              Order date is required
            </mat-error>
          </mat-form-field>
        </div>
        
        <div fxLayout="row" fxLayoutGap="16px">
          <mat-form-field fxFlex="50">
            <mat-label>Status</mat-label>
            <mat-select formControlName="status" required>
              <mat-option value="NEW">New</mat-option>
              <mat-option value="PAID">Paid</mat-option>
              <mat-option value="SHIPPED">Shipped</mat-option>
              <mat-option value="CANCELLED">Cancelled</mat-option>
            </mat-select>
          </mat-form-field>
        </div>
        
        <h3>Order Lines</h3>
        <div class="lines-section">
          <button type="button" mat-raised-button color="primary" (click)="addLine()">
            <mat-icon>add</mat-icon>
            Add Line
          </button>
          
          <table mat-table [dataSource]="linesDataSource" class="lines-table">
            <ng-container matColumnDef="product">
              <th mat-header-cell *matHeaderCellDef>Product</th>
              <td mat-cell *matCellDef="let line; let i = index">
                <mat-form-field>
                  <mat-select [formControl]="getLineControl(i, 'productId')" (selectionChange)="onProductChange(i, $event.value)">
                    <mat-option *ngFor="let product of products" [value]="product.id">
                      {{product.name}} ({{product.sku}})
                    </mat-option>
                  </mat-select>
                </mat-form-field>
              </td>
            </ng-container>
            
            <ng-container matColumnDef="quantity">
              <th mat-header-cell *matHeaderCellDef>Quantity</th>
              <td mat-cell *matCellDef="let line; let i = index">
                <mat-form-field>
                  <input matInput type="number" [formControl]="getLineControl(i, 'quantity')" (input)="calculateLineTotal(i)" min="1">
                </mat-form-field>
              </td>
            </ng-container>
            
            <ng-container matColumnDef="unitPrice">
              <th mat-header-cell *matHeaderCellDef>Unit Price</th>
              <td mat-cell *matCellDef="let line; let i = index">
                <mat-form-field>
                  <input matInput type="number" [formControl]="getLineControl(i, 'unitPrice')" readonly>
                </mat-form-field>
              </td>
            </ng-container>
            
            <ng-container matColumnDef="lineTotal">
              <th mat-header-cell *matHeaderCellDef>Line Total</th>
              <td mat-cell *matCellDef="let line; let i = index">
                <mat-form-field>
                  <input matInput type="number" [formControl]="getLineControl(i, 'lineTotal')" readonly>
                </mat-form-field>
              </td>
            </ng-container>
            
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let line; let i = index">
                <button type="button" mat-icon-button color="warn" (click)="removeLine(i)">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>
            
            <tr mat-header-row *matHeaderRowDef="lineColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: lineColumns;"></tr>
          </table>
          
          <div class="total-section">
            <strong>Total Amount: {{calculateTotal() | currency}}</strong>
          </div>
        </div>
      </mat-dialog-content>
      
      <mat-dialog-actions align="end">
        <button type="button" mat-button mat-dialog-close>Cancel</button>
        <button type="submit" mat-raised-button color="primary" [disabled]="form.invalid || lines.length === 0">
          {{isEdit ? 'Update' : 'Create'}}
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [`
    .lines-section {
      margin: 16px 0;
    }
    .lines-table {
      width: 100%;
      margin: 16px 0;
    }
    .total-section {
      text-align: right;
      padding: 16px 0;
      font-size: 18px;
    }
    mat-form-field {
      width: 100%;
    }
  `]
})
export class OrderDialogComponent implements OnInit {
  form: FormGroup;
  isEdit: boolean;
  customers: Customer[] = [];
  products: Product[] = [];
  linesDataSource: OrderLine[] = [];
  lineColumns = ['product', 'quantity', 'unitPrice', 'lineTotal', 'actions'];

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private customerService: CustomerService,
    private productService: ProductService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<OrderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Order
  ) {
    this.isEdit = !!data?.id;
    this.form = this.fb.group({
      id: [data?.id],
      customerId: [data?.customerId, Validators.required],
      orderDate: [data?.orderDate ? new Date(data.orderDate) : new Date(), Validators.required],
      status: [data?.status || 'NEW', Validators.required],
      lines: this.fb.array([]),
      totalAmount: [data?.totalAmount || 0]
    });
  }

  ngOnInit(): void {
    this.loadCustomers();
    this.loadProducts();
    
    if (this.data?.lines?.length) {
      this.data.lines.forEach(line => this.addLine(line));
    }
  }

  get lines(): FormArray {
    return this.form.get('lines') as FormArray;
  }

  loadCustomers(): void {
    this.customerService.list().subscribe(response => {
      this.customers = response.content;
    });
  }

  loadProducts(): void {
    this.productService.list().subscribe(response => {
      this.products = response.content;
    });
  }

  addLine(lineData?: OrderLine): void {
    const lineForm = this.fb.group({
      productId: [lineData?.productId, Validators.required],
      quantity: [lineData?.quantity || 1, [Validators.required, Validators.min(1)]],
      unitPrice: [lineData?.unitPrice || 0],
      lineTotal: [lineData?.lineTotal || 0]
    });

    this.lines.push(lineForm);
    this.updateLinesDataSource();
  }

  removeLine(index: number): void {
    this.lines.removeAt(index);
    this.updateLinesDataSource();
  }

  updateLinesDataSource(): void {
    this.linesDataSource = this.lines.controls.map(control => control.value);
  }

  getLineControl(index: number, field: string): FormControl {
    return this.lines.at(index).get(field) as FormControl;
  }

  onProductChange(lineIndex: number, productId: number): void {
    const product = this.products.find(p => p.id === productId);
    if (product) {
      const lineGroup = this.lines.at(lineIndex) as FormGroup;
      lineGroup.patchValue({
        unitPrice: product.price,
        lineTotal: product.price * lineGroup.get('quantity')?.value
      });
    }
  }

  calculateLineTotal(lineIndex: number): void {
    const lineGroup = this.lines.at(lineIndex) as FormGroup;
    const quantity = lineGroup.get('quantity')?.value || 0;
    const unitPrice = lineGroup.get('unitPrice')?.value || 0;
    lineGroup.patchValue({
      lineTotal: quantity * unitPrice
    });
  }

  calculateTotal(): number {
    return this.lines.controls.reduce((total, control) => {
      return total + (control.get('lineTotal')?.value || 0);
    }, 0);
  }

  save(): void {
    if (this.form.valid && this.lines.length > 0) {
      const formValue = this.form.value;
      formValue.totalAmount = this.calculateTotal();
      
      this.orderService.create(formValue).subscribe({
        next: () => {
          this.snackBar.open('Order saved successfully', 'Close', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.snackBar.open('Error saving order: ' + error.message, 'Close', { duration: 5000 });
        }
      });
    }
  }
}
