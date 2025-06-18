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
import { AddressService } from '../services/address.service';
import { Address } from '../services/address.model';
import { AddressDialogComponent } from '../dialog/address-dialog.component';

@Component({
  selector: 'app-address-list',
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
    AddressDialogComponent
  ],
  templateUrl: './address-list.component.html',
  styleUrl: './address-list.component.css'
})
export class AddressListComponent implements OnInit {
  displayedColumns = ['street', 'city', 'state', 'postalCode', 'actions'];
  dataSource = new MatTableDataSource<Address>([]);
  filter = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private service: AddressService, private dialog: MatDialog, private snack: MatSnackBar) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.service.getAll().subscribe({
      next: res => {
        this.dataSource.data = res.content;
        this.dataSource.paginator = this.paginator;
      },
      error: () => this.snack.open('Failed to load addresses', 'Close', { duration: 3000 })
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(address?: Address) {
    const ref = this.dialog.open(AddressDialogComponent, { data: address });
    ref.afterClosed().subscribe(result => {
      if (result) {
        this.load();
        this.snack.open('Address saved', 'Close', { duration: 3000 });
      }
    });
  }
}
