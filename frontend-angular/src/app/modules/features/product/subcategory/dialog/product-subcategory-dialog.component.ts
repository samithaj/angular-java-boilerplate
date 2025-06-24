import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { ProductSubCategoryService } from '../../services/product-subcategory.service';
import { ProductCategoryService } from '../../services/product-category.service';
import { ProductSubCategory, ProductCategory } from '../../services/product.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-product-subcategory-dialog',
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
  templateUrl: './product-subcategory-dialog.component.html',
  styleUrl: './product-subcategory-dialog.component.css'
})
export class ProductSubCategoryDialogComponent implements OnInit {
  form: FormGroup;
  categories$!: Observable<ProductCategory[]>;

  constructor(
    private fb: FormBuilder,
    private service: ProductSubCategoryService,
    private categoryService: ProductCategoryService,
    private dialogRef: MatDialogRef<ProductSubCategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProductSubCategory | null
  ) {
    this.form = this.fb.group({
      id: [],
      categoryId: [null, Validators.required],
      name: ['', Validators.required]
    });

    if (data) {
      this.form.patchValue(data);
    }
  }

  ngOnInit(): void {
    this.categories$ = this.categoryService.list();
  }

  submit() {
    if (this.form.invalid) {
      return;
    }
    this.service.save(this.form.value as ProductSubCategory).subscribe({
      next: res => this.dialogRef.close(res),
      error: () => this.dialogRef.close(null)
    });
  }

  cancel() {
    this.dialogRef.close(null);
  }
}
