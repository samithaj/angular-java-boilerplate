import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialog } from '@angular/material/dialog';
import { FlexLayoutModule } from '@angular/flex-layout';
import { OrderService } from '../services/order.service';
import { Order } from '../services/order.model';
import { OrderDialogComponent } from '../dialog/order-dialog.component';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatToolbarModule
  ],
  template: `
    <mat-toolbar>
      <span>Orders</span>
      <span class="spacer"></span>
      <button mat-raised-button color="primary" (click)="openDialog()">
        <mat-icon>add</mat-icon>
        Add Order
      </button>
    </mat-toolbar>
    
    <div class="table-container">
      <table mat-table [dataSource]="dataSource" class="mat-elevation-1">
        <ng-container matColumnDef="id">
          <th mat-header-cell *matHeaderCellDef> # </th>
          <td mat-cell *matCellDef="let row">{{row.id}}</td>
        </ng-container>
        
        <ng-container matColumnDef="date">
          <th mat-header-cell *matHeaderCellDef> Date </th>
          <td mat-cell *matCellDef="let row">{{row.orderDate | date}}</td>
        </ng-container>
        
        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef> Status </th>
          <td mat-cell *matCellDef="let row">
            <mat-chip [color]="getStatusColor(row.status)" selected>
              {{row.status}}
            </mat-chip>
          </td>
        </ng-container>
        
        <ng-container matColumnDef="total">
          <th mat-header-cell *matHeaderCellDef> Total </th>
          <td mat-cell *matCellDef="let row">{{row.totalAmount | currency}}</td>
        </ng-container>
        
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef> Actions </th>
          <td mat-cell *matCellDef="let row">
            <button mat-icon-button (click)="openDialog(row)">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="delete(row)">
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>
        
        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
      
      <mat-paginator [pageSize]="10" [pageSizeOptions]="[5, 10, 20]"></mat-paginator>
    </div>
  `,
  styles: [`
    .spacer {
      flex: 1 1 auto;
    }
    .table-container {
      margin: 16px;
    }
    table {
      width: 100%;
    }
  `]
})
export class OrderListComponent implements OnInit {
  displayedColumns = ['id', 'date', 'status', 'total', 'actions'];
  dataSource = new MatTableDataSource<Order>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private service: OrderService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.service.list().subscribe(res => {
      this.dataSource.data = res.content;
      this.dataSource.paginator = this.paginator;
    });
  }

  openDialog(order?: Order): void {
    const dialogRef = this.dialog.open(OrderDialogComponent, {
      width: '800px',
      data: order ? { ...order } : null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.load();
      }
    });
  }

  delete(order: Order): void {
    if (confirm('Are you sure you want to delete this order?')) {
      // TODO: Implement delete when backend service is ready
      console.log('Delete order:', order.id);
    }
  }

  getStatusColor(status: string): string {
    switch (status?.toUpperCase()) {
      case 'NEW': return 'primary';
      case 'PAID': return 'accent';
      case 'SHIPPED': return 'warn';
      case 'CANCELLED': return '';
      default: return 'primary';
    }
  }
}
