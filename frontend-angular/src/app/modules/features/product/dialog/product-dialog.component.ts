import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { ProductService } from '../services/product.service';
import { Product, ProductCategory, ProductSubCategory } from '../services/product.model';
import { ProductCategoryService } from '../services/product-category.service';
import { ProductSubCategoryService } from '../services/product-subcategory.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-product-dialog',
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
  templateUrl: './product-dialog.component.html',
  styleUrl: './product-dialog.component.css'
})
export class ProductDialogComponent implements OnInit {
  form!: FormGroup;
  categories$!: Observable<ProductCategory[]>;
  subcategories$!: Observable<ProductSubCategory[]>;

  constructor(
    private fb: FormBuilder,
    private service: ProductService,
    private categoryService: ProductCategoryService,
    private subCategoryService: ProductSubCategoryService,
    private dialogRef: MatDialogRef<ProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Product | null
  ) {
    this.form = this.fb.group({
      id: [],
      subCategoryId: [null, Validators.required],
      sku: ['', Validators.required],
      name: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0.01)]],
      stockQuantity: [0, [Validators.required, Validators.min(0)]],
      active: [true]
    });

    if (data) {
      this.form.patchValue(data);
    }
  }

  ngOnInit(): void {
    this.categories$ = this.categoryService.list();
    this.subcategories$ = this.subCategoryService.list();

    if (this.data?.subCategoryId) {
      this.subCategoryService.list().subscribe(subs => {
        const found = subs.find(sub => sub.id === this.data!.subCategoryId);
        if (found) {
          this.loadSubCategoriesByCategory(found.categoryId);
        }
      });
    }
  }

  loadSubCategoriesByCategory(categoryId: number) {
    this.subcategories$ = this.subCategoryService.list(categoryId);
  }

  submit() {
    if (this.form.invalid) {
      return;
    }
    this.service.save(this.form.value as Product).subscribe({
      next: res => this.dialogRef.close(res),
      error: () => this.dialogRef.close(null)
    });
  }

  cancel() {
    this.dialogRef.close(null);
  }
}
