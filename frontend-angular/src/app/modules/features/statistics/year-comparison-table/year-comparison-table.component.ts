import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { YearComparisonDto } from '../services/statistics.model';

@Component({
  selector: 'app-year-comparison-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSortModule],
  template: `
    <div class="table-container">
      <table mat-table [dataSource]="data" matSort class="mat-elevation-2">
        
        <ng-container matColumnDef="categoryName">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Category</th>
          <td mat-cell *matCellDef="let row">{{ row.categoryName }}</td>
        </ng-container>

        <ng-container matColumnDef="yearASales">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>{{ getYearA() }} Sales</th>
          <td mat-cell *matCellDef="let row">{{ row.totalSalesYearA | currency:'USD':'symbol':'1.0-0' }}</td>
        </ng-container>

        <ng-container matColumnDef="yearAVolume">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>{{ getYearA() }} Volume</th>
          <td mat-cell *matCellDef="let row">{{ row.salesVolumeYearA | number:'1.0-0' }}</td>
        </ng-container>

        <ng-container matColumnDef="yearBSales">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>{{ getYearB() }} Sales</th>
          <td mat-cell *matCellDef="let row">{{ row.totalSalesYearB | currency:'USD':'symbol':'1.0-0' }}</td>
        </ng-container>

        <ng-container matColumnDef="yearBVolume">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>{{ getYearB() }} Volume</th>
          <td mat-cell *matCellDef="let row">{{ row.salesVolumeYearB | number:'1.0-0' }}</td>
        </ng-container>

        <ng-container matColumnDef="salesDifference">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Sales Difference</th>
          <td mat-cell *matCellDef="let row" [class]="getSalesDifferenceClass(row)">
            {{ getSalesDifference(row) | currency:'USD':'symbol':'1.0-0' }}
          </td>
        </ng-container>

        <ng-container matColumnDef="volumeDifference">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Volume Difference</th>
          <td mat-cell *matCellDef="let row" [class]="getVolumeDifferenceClass(row)">
            {{ getVolumeDifference(row) | number:'1.0-0' }}
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>

      <div *ngIf="data.length === 0" class="no-data">
        <p>No year comparison data available</p>
      </div>
    </div>
  `,
  styles: [`
    .table-container {
      width: 100%;
      max-height: 400px;
      overflow: auto;
    }

    table {
      width: 100%;
    }

    .no-data {
      text-align: center;
      padding: 40px;
      color: #666;
      font-style: italic;
    }

    .positive {
      color: #4caf50;
      font-weight: 500;
    }

    .negative {
      color: #f44336;
      font-weight: 500;
    }

    .neutral {
      color: #666;
    }
  `]
})
export class YearComparisonTableComponent {
  @Input() data: YearComparisonDto[] = [];

  displayedColumns: string[] = [
    'categoryName',
    'yearASales',
    'yearAVolume', 
    'yearBSales',
    'yearBVolume',
    'salesDifference',
    'volumeDifference'
  ];

  getYearA(): number {
    return this.data[0]?.yearA || 2013;
  }

  getYearB(): number {
    return this.data[0]?.yearB || 2012;
  }

  getSalesDifference(row: YearComparisonDto): number {
    return row.totalSalesYearA - row.totalSalesYearB;
  }

  getVolumeDifference(row: YearComparisonDto): number {
    return row.salesVolumeYearA - row.salesVolumeYearB;
  }

  getSalesDifferenceClass(row: YearComparisonDto): string {
    const diff = this.getSalesDifference(row);
    if (diff > 0) return 'positive';
    if (diff < 0) return 'negative';
    return 'neutral';
  }

  getVolumeDifferenceClass(row: YearComparisonDto): string {
    const diff = this.getVolumeDifference(row);
    if (diff > 0) return 'positive';
    if (diff < 0) return 'negative';
    return 'neutral';
  }
} 