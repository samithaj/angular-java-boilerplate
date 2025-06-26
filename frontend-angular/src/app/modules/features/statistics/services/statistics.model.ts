export interface CategoryStatisticsDto {
  categoryName: string;
  salesVolume: number;
  totalSales: number;
  percentage: number;
}

export interface MonthlySalesDto {
  month: string;
  totalSales: number;
  salesVolume: number;
}

export interface SubcategoryStatisticsDto {
  subcategoryName: string;
  categoryName: string;
  monthlySales: MonthlySalesDto[];
}

export interface YearComparisonDto {
  categoryName: string;
  yearA: number;
  salesVolumeYearA: number;
  totalSalesYearA: number;
  yearB: number;
  salesVolumeYearB: number;
  totalSalesYearB: number;
}

export interface DepartmentSalaryDto {
  departmentName: string;
  employeeCount: number;
  totalSalary: number;
  averageSalary: number;
  minSalary: number;
  maxSalary: number;
}

export type MetricType = 'average_salary' | 'employee_count' | 'total_salary' | 'min_salary' | 'max_salary';
export type ChartType = 'area' | 'line' | 'bar'; 