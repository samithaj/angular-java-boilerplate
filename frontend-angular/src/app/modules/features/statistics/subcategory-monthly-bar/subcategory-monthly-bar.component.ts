import { Component, Input, OnChanges, SimpleChanges, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { SubcategoryStatisticsDto, MonthlySalesDto } from '../services/statistics.model';

@Component({
  selector: 'app-subcategory-monthly-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-container">
      <div *ngIf="isBrowser && plotlyLoaded && !isLoading && !errorMessage && data.length > 0"
           id="plotly-chart-subcategory"
           [style]="{width: '100%', height: '500px'}">
      </div>
      
      <div class="chart-loading" *ngIf="isLoading || !plotlyLoaded">
        <p>{{ plotlyLoaded ? 'Loading chart data...' : 'Loading chart library...' }}</p>
      </div>
      
      <div class="chart-error" *ngIf="errorMessage">
        <p>{{ errorMessage }}</p>
      </div>
      
      <div class="no-data" *ngIf="!isLoading && !errorMessage && data.length === 0 && plotlyLoaded">
        <p>No subcategory data available for the selected date range</p>
      </div>
    </div>
  `,
  styleUrls: ['./subcategory-monthly-bar.component.css']
})
export class SubcategoryMonthlyBarComponent implements OnInit, OnChanges {
  @Input() data: SubcategoryStatisticsDto[] = [];
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
    if (changes['data'] && this.data && this.plotlyLoaded && this.isBrowser) {
      this.updateChart();
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

    // Extract all unique months and sort them
    const allMonths = new Set<string>();
    this.data.forEach(subcategory => {
      subcategory.monthlySales.forEach(monthly => {
        allMonths.add(monthly.month);
      });
    });
    
    const sortedMonths = Array.from(allMonths).sort();

    // Generate colors for each subcategory
    const colors = this.generateColors(this.data.length);

    // Create traces for each subcategory
    const plotData = this.data.map((subcategory, index) => {
      // Create a map for quick lookup of monthly data
      const monthlyMap = new Map<string, MonthlySalesDto>();
      subcategory.monthlySales.forEach(monthly => {
        monthlyMap.set(monthly.month, monthly);
      });

      // Build y-values array in the same order as sortedMonths
      const yValues = sortedMonths.map(month => {
        const monthlyData = monthlyMap.get(month);
        return monthlyData ? monthlyData.totalSales : 0;
      });

      return {
        x: sortedMonths,
        y: yValues,
        type: 'bar',
        name: `${subcategory.subcategoryName} (${subcategory.categoryName})`,
        marker: {
          color: colors[index]
        }
      };
    });

    // Update layout title to include category if filtered
    const categories = [...new Set(this.data.map(d => d.categoryName))];
    const title = categories.length === 1 
      ? `Monthly Sales by Subcategory - ${categories[0]}`
      : 'Monthly Sales by Subcategory';

    const layout = {
      title: {
        text: title,
        font: { size: 16, family: 'Roboto, sans-serif' }
      },
      xaxis: {
        title: 'Month',
        type: 'category'
      },
      yaxis: {
        title: 'Total Sales ($)',
        tickformat: ',.0f'
      },
      barmode: 'group',
      font: { family: 'Roboto, sans-serif' },
      margin: { t: 50, r: 50, b: 50, l: 50 },
      autosize: true
    };

    const config = {
      responsive: true,
      displayModeBar: true,
      modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d'],
      toImageButtonOptions: {
        format: 'png',
        filename: 'subcategory-monthly-sales',
        height: 500,
        width: 700,
        scale: 1
      }
    };

    // Use setTimeout to ensure DOM element exists
    setTimeout(() => {
      const element = document.getElementById('plotly-chart-subcategory');
      if (element && this.plotly) {
        this.plotly.newPlot(element, plotData, layout, config);
      }
    }, 0);
  }

  private generateColors(count: number): string[] {
    const colors = [
      '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
      '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'
    ];
    
    // If we need more colors than predefined, generate them
    if (count > colors.length) {
      for (let i = colors.length; i < count; i++) {
        const hue = (i * 137.508) % 360; // Golden angle approximation
        colors.push(`hsl(${hue}, 65%, 50%)`);
      }
    }
    
    return colors.slice(0, count);
  }
} 