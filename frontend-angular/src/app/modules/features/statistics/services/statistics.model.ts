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