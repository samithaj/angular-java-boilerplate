import { Component, Input, OnChanges, SimpleChanges, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { DepartmentSalaryDto, MetricType, ChartType } from '../services/statistics.model';

@Component({
  selector: 'app-department-metric-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './department-metric-chart.component.html',
  styleUrls: ['./department-metric-chart.component.css']
})
export class DepartmentMetricChartComponent implements OnInit, OnChanges {
  @Input() data: DepartmentSalaryDto[] = [];
  @Input() metric: MetricType = 'average_salary';
  @Input() chartType: ChartType = 'area';
  @Input() isLoading = false;
  @Input() errorMessage: string | null = null;
  
  isBrowser = false;
  plotlyLoaded = false;
  private plotly: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  async ngOnInit(): Promise<void> {
    if (this.isBrowser) {
      await this.loadPlotly();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.data && this.plotlyLoaded && this.isBrowser) {
      if (changes['data'] || changes['metric'] || changes['chartType']) {
        this.updateChart();
      }
    }
  }

  private async loadPlotly(): Promise<void> {
    try {
      // Dynamic import only in browser to avoid SSR issues
      this.plotly = await import('plotly.js-dist-min');
      this.plotlyLoaded = true;
      
      // Update chart if data is already available
      if (this.data?.length > 0) {
        this.updateChart();
      }
    } catch (error) {
      console.error('Failed to load Plotly:', error);
      this.errorMessage = 'Failed to load chart library';
    }
  }

  private updateChart(): void {
    if (!this.plotly || !this.isBrowser || !this.data || this.data.length === 0) {
      return;
    }

    const departments = this.data.map(item => item.departmentName);
    const values = this.data.map(item => this.getMetricValue(item));
    
    const plotData = [{
      x: departments,
      y: values,
      type: this.getPlotlyType(),
      fill: this.chartType === 'area' ? 'tonexty' : undefined,
      mode: this.chartType === 'line' ? 'lines+markers' : undefined,
      name: this.getMetricLabel(),
      marker: {
        color: this.getColor(),
        line: {
          color: this.getDarkerColor(),
          width: 1
        }
      },
      line: this.chartType === 'line' || this.chartType === 'area' ? {
        color: this.getColor(),
        width: 3
      } : undefined
    }];

    const layout = {
      title: {
        text: `${this.getMetricLabel()} by Department`,
        font: { size: 16, family: 'Roboto, sans-serif' }
      },
      xaxis: {
        title: 'Department',
        type: 'category'
      },
      yaxis: {
        title: this.getYAxisTitle(),
        tickformat: this.metric === 'employee_count' ? ',.0f' : '$,.0f'
      },
      font: { family: 'Roboto, sans-serif' },
      margin: { t: 50, r: 50, b: 50, l: 80 },
      autosize: true,
      showlegend: false
    };

    const config = {
      responsive: true,
      displayModeBar: true,
      modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d'],
      toImageButtonOptions: {
        format: 'png',
        filename: `department-${this.metric}-${this.chartType}`,
        height: 500,
        width: 700,
        scale: 1
      }
    };

    // Use setTimeout to ensure DOM element exists
    setTimeout(() => {
      const element = document.getElementById('plotly-chart-department');
      if (element && this.plotly) {
        this.plotly.newPlot(element, plotData, layout, config);
      }
    }, 0);
  }

  private getMetricValue(item: DepartmentSalaryDto): number {
    switch (this.metric) {
      case 'average_salary': return item.averageSalary;
      case 'employee_count': return item.employeeCount;
      case 'total_salary': return item.totalSalary;
      case 'min_salary': return item.minSalary;
      case 'max_salary': return item.maxSalary;
      default: return item.averageSalary;
    }
  }

  private getPlotlyType(): string {
    switch (this.chartType) {
      case 'area': return 'scatter';
      case 'line': return 'scatter';
      case 'bar': return 'bar';
      default: return 'scatter';
    }
  }

  private getMetricLabel(): string {
    switch (this.metric) {
      case 'average_salary': return 'Average Salary';
      case 'employee_count': return 'Employee Count';
      case 'total_salary': return 'Total Salary';
      case 'min_salary': return 'Minimum Salary';
      case 'max_salary': return 'Maximum Salary';
      default: return 'Average Salary';
    }
  }

  private getYAxisTitle(): string {
    return this.metric === 'employee_count' ? 'Number of Employees' : 'Salary ($)';
  }

  private getColor(): string {
    switch (this.metric) {
      case 'average_salary': return '#3f51b5'; // Blue
      case 'employee_count': return '#4caf50'; // Green
      case 'total_salary': return '#ff9800'; // Orange
      case 'min_salary': return '#f44336'; // Red
      case 'max_salary': return '#9c27b0'; // Purple
      default: return '#3f51b5';
    }
  }

  private getDarkerColor(): string {
    switch (this.metric) {
      case 'average_salary': return '#1a237e';
      case 'employee_count': return '#2e7d32';
      case 'total_salary': return '#e65100';
      case 'min_salary': return '#c62828';
      case 'max_salary': return '#6a1b9a';
      default: return '#1a237e';
    }
  }
} 