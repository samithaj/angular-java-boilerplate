import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { StatisticsService } from '../services/statistics.service';
import { CategoryStatisticsDto, SubcategoryStatisticsDto, YearComparisonDto, DepartmentSalaryDto, MetricType, ChartType } from '../services/statistics.model';
import { CategoryPieChartComponent } from '../category-pie-chart/category-pie-chart.component';
import { CategoryTableComponent } from '../category-table/category-table.component';
import { SubcategoryMonthlyBarComponent } from '../subcategory-monthly-bar/subcategory-monthly-bar.component';
import { SubcategoryTableComponent } from '../subcategory-table/subcategory-table.component';
import { YearComparisonBarComponent } from '../year-comparison-bar/year-comparison-bar.component';
import { YearComparisonTableComponent } from '../year-comparison-table/year-comparison-table.component';
import { YearComparisonBubbleComponent } from '../year-comparison-bubble/year-comparison-bubble.component';
import { DepartmentMetricChartComponent } from '../department-metric-chart/department-metric-chart.component';
import { DepartmentTableComponent } from '../department-table/department-table.component';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatDatepickerModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatSelectModule,
    MatListModule,
    ReactiveFormsModule,
    CategoryPieChartComponent,
    CategoryTableComponent,
    SubcategoryMonthlyBarComponent,
    SubcategoryTableComponent,
    YearComparisonBarComponent,
    YearComparisonTableComponent,
    YearComparisonBubbleComponent,
    DepartmentMetricChartComponent,
    DepartmentTableComponent
  ],
  template: `
    <div class="statistics-container">
      <div class="header">
        <h2>Sales Statistics</h2>
        
        <!-- Date Range Controls -->
        <form [formGroup]="dateForm" class="date-controls">
          <mat-form-field appearance="outline">
            <mat-label>Date From</mat-label>
            <input matInput [matDatepicker]="fromPicker" formControlName="from">
            <mat-datepicker-toggle matIconSuffix [for]="fromPicker"></mat-datepicker-toggle>
            <mat-datepicker #fromPicker></mat-datepicker>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Date To</mat-label>
            <input matInput [matDatepicker]="toPicker" formControlName="to">
            <mat-datepicker-toggle matIconSuffix [for]="toPicker"></mat-datepicker-toggle>
            <mat-datepicker #toPicker></mat-datepicker>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Category Filter (Optional)</mat-label>
            <mat-select formControlName="categoryFilter">
              <mat-option value="">All Categories</mat-option>
              <mat-option *ngFor="let category of availableCategories()" [value]="category">
                {{ category }}
              </mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Year A</mat-label>
            <mat-select formControlName="yearA">
              <mat-option value="2013">2013</mat-option>
              <mat-option value="2012">2012</mat-option>
              <mat-option value="2011">2011</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Year B</mat-label>
            <mat-select formControlName="yearB">
              <mat-option value="2012">2012</mat-option>
              <mat-option value="2013">2013</mat-option>
              <mat-option value="2011">2011</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Metric</mat-label>
            <mat-select formControlName="metric">
              <mat-option value="average_salary">Average Salary</mat-option>
              <mat-option value="employee_count">Employee Count</mat-option>
              <mat-option value="total_salary">Total Salary</mat-option>
              <mat-option value="min_salary">Min Salary</mat-option>
              <mat-option value="max_salary">Max Salary</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Chart Type</mat-label>
            <mat-select formControlName="chartType">
              <mat-option value="area">Area Chart</mat-option>
              <mat-option value="line">Line Chart</mat-option>
              <mat-option value="bar">Bar Chart</mat-option>
            </mat-select>
          </mat-form-field>

          <button mat-raised-button color="primary" (click)="runReport()" [disabled]="loading()">
            {{ loading() ? 'Loading...' : 'Run Report' }}
          </button>
        </form>
      </div>

      <!-- Tabs for different chart types -->
      <mat-tab-group>
        <mat-tab label="Category Statistics">
          <div class="tab-content">
            <div class="chart-section">
              <app-category-pie-chart 
                [data]="categoryData()" 
                [loading]="loading()" 
                [error]="error()">
              </app-category-pie-chart>
            </div>
            
            <div class="table-section">
              <app-category-table [data]="categoryData()"></app-category-table>
            </div>
          </div>
        </mat-tab>

        <mat-tab label="Subcategory Statistics">
          <div class="tab-content">
            <div class="chart-section">
              <app-subcategory-monthly-bar 
                [data]="subcategoryData()" 
                [isLoading]="loading()" 
                [errorMessage]="error()">
              </app-subcategory-monthly-bar>
            </div>
            
            <div class="table-section">
              <app-subcategory-table [data]="subcategoryData()"></app-subcategory-table>
            </div>
          </div>
        </mat-tab>

        <mat-tab label="Google Charts 1">
          <div class="tab-content">
            <div class="chart-section">
              <app-year-comparison-bar 
                [data]="yearComparisonData()" 
                [isLoading]="loading()" 
                [errorMessage]="error()">
              </app-year-comparison-bar>
            </div>
            
            <div class="table-section">
              <app-year-comparison-table [data]="yearComparisonData()"></app-year-comparison-table>
            </div>
          </div>
        </mat-tab>

        <mat-tab label="Google Charts 2">
          <div class="tab-content">
            <div class="chart-section">
              <app-year-comparison-bubble 
                [data]="yearComparisonData()" 
                [isLoading]="loading()" 
                [errorMessage]="error()">
              </app-year-comparison-bubble>
            </div>
            
            <div class="table-section">
              <app-year-comparison-table [data]="yearComparisonData()"></app-year-comparison-table>
            </div>
          </div>
        </mat-tab>

        <mat-tab label="Modern Graph">
          <div class="tab-content">
            <div class="chart-section">
              <app-department-metric-chart 
                [data]="departmentData()" 
                [metric]="selectedMetric()"
                [chartType]="selectedChartType()"
                [isLoading]="loading()" 
                [errorMessage]="error()">
              </app-department-metric-chart>
            </div>
            
            <div class="table-section">
              <app-department-table 
                [data]="departmentData()"
                [isLoading]="loading()" 
                [errorMessage]="error()">
              </app-department-table>
            </div>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .statistics-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      margin-bottom: 24px;
    }

    .header h2 {
      margin: 0 0 16px 0;
      color: #424242;
    }

    .date-controls {
      display: flex;
      gap: 16px;
      align-items: end;
      flex-wrap: wrap;
    }

    .date-controls mat-form-field {
      min-width: 200px;
    }

    .tab-content {
      padding: 24px 0;
    }

    .chart-section {
      margin-bottom: 24px;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      padding: 16px;
    }

    .table-section {
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      padding: 16px;
    }

    mat-tab-group {
      margin-top: 16px;
    }
  `]
})
export class Statistics implements OnInit {
  
  // Reactive signals for state management
  categoryData = signal<CategoryStatisticsDto[]>([]);
  subcategoryData = signal<SubcategoryStatisticsDto[]>([]);
  yearComparisonData = signal<YearComparisonDto[]>([]);
  departmentData = signal<DepartmentSalaryDto[]>([]);
  availableCategories = signal<string[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  // Computed signals for form values
  selectedMetric = signal<MetricType>('average_salary');
  selectedChartType = signal<ChartType>('area');

  // Form for date controls
  dateForm = new FormGroup({
    from: new FormControl(new Date('2025-01-01')),
    to: new FormControl(new Date('2025-12-31')),
    categoryFilter: new FormControl(''),
    yearA: new FormControl(2013),
    yearB: new FormControl(2012),
    metric: new FormControl<MetricType>('average_salary'),
    chartType: new FormControl<ChartType>('area')
  });

  constructor(private statisticsService: StatisticsService) {}

  ngOnInit(): void {
    // Subscribe to form changes for real-time updates
    this.dateForm.get('metric')?.valueChanges.subscribe(value => {
      if (value) {
        this.selectedMetric.set(value);
      }
    });

    this.dateForm.get('chartType')?.valueChanges.subscribe(value => {
      if (value) {
        this.selectedChartType.set(value);
      }
    });

    // Load initial data
    this.runReport();
  }

  runReport(): void {
    const fromDate = this.dateForm.get('from')?.value;
    const toDate = this.dateForm.get('to')?.value;
    const categoryFilter = this.dateForm.get('categoryFilter')?.value || null;
    const yearA = this.dateForm.get('yearA')?.value || 2013;
    const yearB = this.dateForm.get('yearB')?.value || 2012;
    const metric = this.dateForm.get('metric')?.value || 'average_salary';

    if (!fromDate || !toDate) {
      this.error.set('Please select valid date range');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    // Always fetch fresh data – clear cached observables first
    this.statisticsService.clearCache();

    const fromStr = this.formatDate(fromDate);
    const toStr = this.formatDate(toDate);

    // Load category, subcategory, year comparison, and department statistics
    Promise.all([
      this.statisticsService.getCategorySalesStatistics(fromStr, toStr).toPromise(),
      this.statisticsService.getSubcategorySalesStatistics(categoryFilter, fromStr, toStr).toPromise(),
      this.statisticsService.getYearComparisonStatistics(yearA, yearB).toPromise(),
      this.statisticsService.getDepartmentSalaryStatistics(metric, fromStr, toStr).toPromise()
    ]).then(([categoryData, subcategoryData, yearComparisonData, departmentData]) => {
      this.categoryData.set(categoryData || []);
      this.subcategoryData.set(subcategoryData || []);
      this.yearComparisonData.set(yearComparisonData || []);
      this.departmentData.set(departmentData || []);
      
      // Update available categories
      const categories = [...new Set((categoryData || []).map(cat => cat.categoryName))];
      this.availableCategories.set(categories);
      
      this.loading.set(false);
      // Trigger window resize to ensure Plotly charts hidden in inactive tabs are correctly resized when shown
      if (typeof window !== 'undefined') {
        setTimeout(() => window.dispatchEvent(new Event('resize')), 0);
      }
    }).catch((err) => {
      console.error('Error loading statistics:', err);
      this.error.set('Failed to load statistics data');
      this.loading.set(false);
    });
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
