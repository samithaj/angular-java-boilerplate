import { Component, Input, OnChanges, SimpleChanges, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DepartmentSalaryDto } from '../services/statistics.model';

@Component({
  selector: 'app-department-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './department-table.component.html',
  styleUrls: ['./department-table.component.css']
})
export class DepartmentTableComponent implements OnChanges, AfterViewInit {
  @Input() data: DepartmentSalaryDto[] = [];
  @Input() isLoading = false;
  @Input() errorMessage: string | null = null;

  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [
    'departmentName',
    'employeeCount',
    'averageSalary',
    'totalSalary',
    'minSalary',
    'maxSalary'
  ];

  dataSource = new MatTableDataSource<DepartmentSalaryDto>([]);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      this.dataSource.data = this.data;
      if (this.sort) {
        this.dataSource.sort = this.sort;
      }
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  exportToCSV(): void {
    if (!this.data || this.data.length === 0) {
      return;
    }

    const headers = [
      'Department',
      'Employee Count',
      'Average Salary',
      'Total Salary',
      'Min Salary',
      'Max Salary'
    ];

    const csvData = [
      headers.join(','),
      ...this.data.map(row => [
        `"${row.departmentName}"`,
        row.employeeCount,
        row.averageSalary,
        row.totalSalary,
        row.minSalary,
        row.maxSalary
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'department-salary-statistics.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  }
} 