import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, Sort } from '@angular/material/sort';
import { CategoryStatisticsDto } from '../services/statistics.model';

@Component({
  selector: 'app-category-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSortModule, CurrencyPipe, DecimalPipe],
  template: `
    <div class="table-container">
      <table mat-table [dataSource]="dataSource" matSort class="category-table">
        
        <!-- Category Name Column -->
        <ng-container matColumnDef="categoryName">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Category Name</th>
          <td mat-cell *matCellDef="let element">{{ element.categoryName }}</td>
        </ng-container>

        <!-- Sales Volume Column -->
        <ng-container matColumnDef="salesVolume">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Sales Volume</th>
          <td mat-cell *matCellDef="let element">{{ element.salesVolume | number }}</td>
        </ng-container>

        <!-- Total Sales Column -->
        <ng-container matColumnDef="totalSales">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Total Sales (USD)</th>
          <td mat-cell *matCellDef="let element">{{ element.totalSales | currency:'USD':'symbol':'1.2-2' }}</td>
        </ng-container>

        <!-- Percentage Column -->
        <ng-container matColumnDef="percentage">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Percentage</th>
          <td mat-cell *matCellDef="let element">{{ element.percentage | number:'1.2-2' }}%</td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </div>
  `,
  styles: [`
    .table-container {
      width: 100%;
      overflow-x: auto;
    }
    
    .category-table {
      width: 100%;
      margin-top: 16px;
    }
    
    .mat-mdc-header-cell {
      font-weight: 600;
      color: #424242;
    }
    
    .mat-mdc-cell {
      color: #616161;
    }
    
    .mat-mdc-row:hover {
      background-color: #f5f5f5;
    }
  `]
})
export class CategoryTableComponent implements OnChanges {
  @Input() data: CategoryStatisticsDto[] = [];
  
  displayedColumns: string[] = ['categoryName', 'salesVolume', 'totalSales', 'percentage'];
  dataSource: CategoryStatisticsDto[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.dataSource = [...this.data];
    }
  }

  onSortChange(sort: Sort): void {
    if (!sort.active || sort.direction === '') {
      this.dataSource = [...this.data];
      return;
    }

    this.dataSource = this.data.slice().sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'categoryName':
          return this.compare(a.categoryName, b.categoryName, isAsc);
        case 'salesVolume':
          return this.compare(a.salesVolume, b.salesVolume, isAsc);
        case 'totalSales':
          return this.compare(a.totalSales, b.totalSales, isAsc);
        case 'percentage':
          return this.compare(a.percentage, b.percentage, isAsc);
        default:
          return 0;
      }
    });
  }

  private compare(a: string | number, b: string | number, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
} 