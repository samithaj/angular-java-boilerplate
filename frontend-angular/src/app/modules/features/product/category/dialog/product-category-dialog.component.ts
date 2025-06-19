import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ProductCategoryService } from '../../services/product-category.service';
import { ProductCategory } from '../../services/product.model';

@Component({
  selector: 'app-product-category-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './product-category-dialog.component.html',
  styleUrl: './product-category-dialog.component.css'
})
export class ProductCategoryDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private service: ProductCategoryService,
    private dialogRef: MatDialogRef<ProductCategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProductCategory | null
  ) {
    this.form = this.fb.group({
      id: [],
      name: ['', Validators.required]
    });

    if (data) {
      this.form.patchValue(data);
    }
  }

  submit() {
    if (this.form.invalid) {
      return;
    }
    this.service.save(this.form.value as ProductCategory).subscribe({
      next: res => this.dialogRef.close(res),
      error: () => this.dialogRef.close(null)
    });
  }

  cancel() {
    this.dialogRef.close(null);
  }
}
