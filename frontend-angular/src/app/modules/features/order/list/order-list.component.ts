import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { OrderService } from '../services/order.service';
import { Order } from '../services/order.model';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `<table mat-table [dataSource]="dataSource">
    <ng-container matColumnDef="id">
      <th mat-header-cell *matHeaderCellDef> # </th>
      <td mat-cell *matCellDef="let row">{{row.id}}</td>
    </ng-container>
    <ng-container matColumnDef="date">
      <th mat-header-cell *matHeaderCellDef> Date </th>
      <td mat-cell *matCellDef="let row">{{row.orderDate}}</td>
    </ng-container>
    <ng-container matColumnDef="status">
      <th mat-header-cell *matHeaderCellDef> Status </th>
      <td mat-cell *matCellDef="let row">{{row.status}}</td>
    </ng-container>
    <ng-container matColumnDef="total">
      <th mat-header-cell *matHeaderCellDef> Total </th>
      <td mat-cell *matCellDef="let row">{{row.totalAmount}}</td>
    </ng-container>
    <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
    <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
  </table>
  <mat-paginator [pageSize]="10"></mat-paginator>`,
  styleUrls: []
})
export class OrderListComponent implements OnInit {
  displayedColumns = ['id', 'date', 'status', 'total'];
  dataSource = new MatTableDataSource<Order>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private service: OrderService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.service.list().subscribe(res => {
      this.dataSource.data = res.content;
      this.dataSource.paginator = this.paginator;
    });
  }
}
