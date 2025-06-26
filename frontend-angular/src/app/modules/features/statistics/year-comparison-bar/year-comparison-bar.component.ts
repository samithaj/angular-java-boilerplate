import { Component, Input, OnChanges, SimpleChanges, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { YearComparisonDto } from '../services/statistics.model';

@Component({
  selector: 'app-year-comparison-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-container">
      <div *ngIf="isBrowser && plotlyLoaded && !isLoading && !errorMessage && data.length > 0"
           id="plotly-chart-year-comparison"
           [style]="{width: '100%', height: '500px'}">
      </div>
      
      <div class="chart-loading" *ngIf="isLoading || !plotlyLoaded">
        <p>{{ plotlyLoaded ? 'Loading chart data...' : 'Loading chart library...' }}</p>
      </div>
      
      <div class="chart-error" *ngIf="errorMessage">
        <p>{{ errorMessage }}</p>
      </div>
      
      <div class="no-data" *ngIf="!isLoading && !errorMessage && data.length === 0 && plotlyLoaded">
        <p>No year comparison data available</p>
      </div>
    </div>
  `,
  styles: [`
    .chart-container {
      position: relative;
      width: 100%;
      height: 500px;
    }
    
    .chart-loading, .chart-error, .no-data {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      background: rgba(255, 255, 255, 0.9);
      padding: 20px;
      border-radius: 4px;
      text-align: center;
    }
    
    .chart-error {
      color: #f44336;
      border: 1px solid #ffcdd2;
      background: #ffebee;
    }
    
    .no-data {
      color: #666;
      font-style: italic;
    }
  `]
})
export class YearComparisonBarComponent implements OnInit, OnChanges {
  @Input() data: YearComparisonDto[] = [];
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

    const categories = this.data.map(item => item.categoryName);
    
    // Get the years from the first data item
    const yearA = this.data[0]?.yearA || 2013;
    const yearB = this.data[0]?.yearB || 2012;

    // Create traces for each year
    const plotData = [
      {
        x: categories,
        y: this.data.map(item => item.totalSalesYearA),
        type: 'bar',
        name: `${yearA}`,
        marker: {
          color: '#3f51b5' // Primary blue
        }
      },
      {
        x: categories,
        y: this.data.map(item => item.totalSalesYearB),
        type: 'bar',
        name: `${yearB}`,
        marker: {
          color: '#2196f3' // Light blue
        }
      }
    ];

    const layout = {
      title: {
        text: `Sales Comparison: ${yearA} vs ${yearB}`,
        font: { size: 16, family: 'Roboto, sans-serif' }
      },
      xaxis: {
        title: 'Category',
        type: 'category'
      },
      yaxis: {
        title: 'Total Sales ($)',
        tickformat: ',.0f'
      },
      barmode: 'group',
      font: { family: 'Roboto, sans-serif' },
      margin: { t: 50, r: 50, b: 50, l: 50 },
      autosize: true,
      legend: {
        orientation: 'h',
        x: 0.5,
        xanchor: 'center',
        y: 1.02
      }
    };

    const config = {
      responsive: true,
      displayModeBar: true,
      modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d'],
      toImageButtonOptions: {
        format: 'png',
        filename: 'year-comparison-sales',
        height: 500,
        width: 700,
        scale: 1
      }
    };

    // Use setTimeout to ensure DOM element exists
    setTimeout(() => {
      const element = document.getElementById('plotly-chart-year-comparison');
      if (element && this.plotly) {
        this.plotly.newPlot(element, plotData, layout, config);
      }
    }, 0);
  }
} 