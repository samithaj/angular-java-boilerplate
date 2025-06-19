import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ProductSubCategoryService } from '../../services/product-subcategory.service';
import { ProductSubCategory } from '../../services/product.model';
import { ProductSubCategoryDialogComponent } from '../dialog/product-subcategory-dialog.component';

@Component({
  selector: 'app-product-subcategory-list',
  standalone: true,
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    ProductSubCategoryDialogComponent
  ],
  templateUrl: './product-subcategory-list.component.html',
  styleUrl: './product-subcategory-list.component.css'
})
export class ProductSubCategoryListComponent implements OnInit {
  displayedColumns = ['name', 'actions'];
  dataSource = new MatTableDataSource<ProductSubCategory>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private service: ProductSubCategoryService, private dialog: MatDialog, private snack: MatSnackBar) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.service.list().subscribe({
      next: res => {
        this.dataSource.data = res;
        this.dataSource.paginator = this.paginator;
      },
      error: () => this.snack.open('Failed to load subcategories', 'Close', { duration: 3000 })
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(subCategory?: ProductSubCategory) {
    const ref = this.dialog.open(ProductSubCategoryDialogComponent, { data: subCategory });
    ref.afterClosed().subscribe(result => {
      if (result) {
        this.load();
        this.snack.open('Subcategory saved', 'Close', { duration: 3000 });
      }
    });
  }
}
