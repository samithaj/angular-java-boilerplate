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
import { ProductCategoryService } from '../../services/product-category.service';
import { ProductCategory } from '../../services/product.model';
import { ProductCategoryDialogComponent } from '../dialog/product-category-dialog.component';

@Component({
  selector: 'app-product-category-list',
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
    ProductCategoryDialogComponent
  ],
  templateUrl: './product-category-list.component.html',
  styleUrl: './product-category-list.component.css'
})
export class ProductCategoryListComponent implements OnInit {
  displayedColumns = ['name', 'actions'];
  dataSource = new MatTableDataSource<ProductCategory>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private service: ProductCategoryService, private dialog: MatDialog, private snack: MatSnackBar) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.service.list().subscribe({
      next: res => {
        this.dataSource.data = res;
        this.dataSource.paginator = this.paginator;
      },
      error: () => this.snack.open('Failed to load categories', 'Close', { duration: 3000 })
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(category?: ProductCategory) {
    const ref = this.dialog.open(ProductCategoryDialogComponent, { data: category });
    ref.afterClosed().subscribe(result => {
      if (result) {
        this.load();
        this.snack.open('Category saved', 'Close', { duration: 3000 });
      }
    });
  }
}
