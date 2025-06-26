import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { SubcategoryStatisticsDto } from '../services/statistics.model';

interface TopProductData {
  subcategoryName: string;
  categoryName: string;
  totalSales: number;
  totalVolume: number;
  averageMonthlySales: number;
  peakMonth: string;
  peakSales: number;
}

@Component({
  selector: 'app-subcategory-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSortModule, MatCardModule],
  template: `
    <mat-card class="table-card">
      <mat-card-header>
        <mat-card-title>Subcategory Performance Summary</mat-card-title>
        <mat-card-subtitle>Top performing subcategories by total sales</mat-card-subtitle>
      </mat-card-header>
      
      <mat-card-content>
        <div class="table-container">
          <table mat-table [dataSource]="tableData" class="subcategory-table" matSort>
            
            <ng-container matColumnDef="subcategoryName">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Subcategory</th>
              <td mat-cell *matCellDef="let element">{{ element.subcategoryName }}</td>
            </ng-container>
            
            <ng-container matColumnDef="categoryName">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Category</th>
              <td mat-cell *matCellDef="let element">{{ element.categoryName }}</td>
            </ng-container>
            
            <ng-container matColumnDef="totalSales">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Total Sales</th>
              <td mat-cell *matCellDef="let element">{{ element.totalSales | currency }}</td>
            </ng-container>
            
            <ng-container matColumnDef="totalVolume">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Total Volume</th>
              <td mat-cell *matCellDef="let element">{{ element.totalVolume | number }}</td>
            </ng-container>
            
            <ng-container matColumnDef="averageMonthlySales">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Avg Monthly Sales</th>
              <td mat-cell *matCellDef="let element">{{ element.averageMonthlySales | currency }}</td>
            </ng-container>
            
            <ng-container matColumnDef="peakMonth">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Peak Month</th>
              <td mat-cell *matCellDef="let element">{{ element.peakMonth }}</td>
            </ng-container>
            
            <ng-container matColumnDef="peakSales">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Peak Sales</th>
              <td mat-cell *matCellDef="let element">{{ element.peakSales | currency }}</td>
            </ng-container>
            
            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
          
          <div class="no-data" *ngIf="tableData.length === 0">
            <p>No subcategory data available</p>
          </div>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styleUrls: ['./subcategory-table.component.css']
})
export class SubcategoryTableComponent implements OnChanges {
  @Input() data: SubcategoryStatisticsDto[] = [];
  
  tableData: TopProductData[] = [];
  displayedColumns: string[] = [
    'subcategoryName', 
    'categoryName', 
    'totalSales', 
    'totalVolume', 
    'averageMonthlySales', 
    'peakMonth', 
    'peakSales'
  ];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      this.processTableData();
    }
  }

  private processTableData(): void {
    this.tableData = this.data.map(subcategory => {
      const monthlySales = subcategory.monthlySales || [];
      
      const totalSales = monthlySales.reduce((sum, month) => sum + month.totalSales, 0);
      const totalVolume = monthlySales.reduce((sum, month) => sum + month.salesVolume, 0);
      const averageMonthlySales = monthlySales.length > 0 ? totalSales / monthlySales.length : 0;
      
      // Find peak month
      let peakMonth = '';
      let peakSales = 0;
      
      monthlySales.forEach(month => {
        if (month.totalSales > peakSales) {
          peakSales = month.totalSales;
          peakMonth = month.month;
        }
      });

      return {
        subcategoryName: subcategory.subcategoryName,
        categoryName: subcategory.categoryName,
        totalSales: totalSales,
        totalVolume: totalVolume,
        averageMonthlySales: averageMonthlySales,
        peakMonth: peakMonth,
        peakSales: peakSales
      };
    }).sort((a, b) => b.totalSales - a.totalSales); // Sort by total sales descending
  }
} 