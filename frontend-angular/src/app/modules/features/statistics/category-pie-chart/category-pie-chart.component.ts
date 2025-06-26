import { Component, Input, OnChanges, SimpleChanges, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CategoryStatisticsDto } from '../services/statistics.model';

@Component({
  selector: 'app-category-pie-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-container">
      <div *ngIf="isBrowser && plotlyLoaded && !loading && !error && data.length > 0" 
           id="plotly-chart-category"
           [style]="{ width: '100%', height: '500px' }">
      </div>
      
      <div *ngIf="loading || !plotlyLoaded" class="loading-overlay">
        <p>{{ plotlyLoaded ? 'Loading chart data...' : 'Loading chart library...' }}</p>
      </div>
      
      <div *ngIf="error" class="error-message">
        {{ error }}
      </div>
      
      <div *ngIf="!loading && !error && data.length === 0 && plotlyLoaded" class="no-data-message">
        <p>No data available for the selected date range</p>
      </div>
    </div>
  `,
  styles: [`
    .chart-container {
      position: relative;
      width: 100%;
      height: 500px;
    }
    
    .loading-overlay, .error-message, .no-data-message {
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
    
    .error-message {
      color: #f44336;
      border: 1px solid #ffcdd2;
      background: #ffebee;
    }
    
    .no-data-message {
      color: #666;
      font-style: italic;
    }
  `]
})
export class CategoryPieChartComponent implements OnInit, OnChanges {
  @Input() data: CategoryStatisticsDto[] = [];
  @Input() loading = false;
  @Input() error: string | null = null;
  
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
    if (changes['data'] && this.data?.length > 0 && this.plotlyLoaded && this.isBrowser) {
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
      this.error = 'Failed to load chart library';
    }
  }

  private updateChart(): void {
    if (!this.plotly || !this.isBrowser || !this.data || this.data.length === 0) {
      return;
    }

    const labels = this.data.map(item => item.categoryName);
    const values = this.data.map(item => item.salesVolume);
    
    // PowerBuilder-style colors (blue dominant)
    const colors = [
      '#3f51b5', // Blue for Bikes (dominant)
      '#2196f3', // Light blue for Components  
      '#4caf50', // Green for Clothing
      '#ff9800'  // Orange for Accessories
    ];

    const plotData = [{
      type: 'pie',
      labels: labels,
      values: values,
      textinfo: 'label+percent',
      textposition: 'auto',
      hovertemplate: '<b>%{label}</b><br>' +
                     'Sales Volume: %{value}<br>' +
                     'Percentage: %{percent}<br>' +
                     '<extra></extra>',
      marker: {
        colors: colors,
        line: {
          color: '#ffffff',
          width: 2
        }
      },
      showlegend: true
    }];

    const layout = {
      title: {
        text: 'Sales Percentage by Category',
        font: { size: 16, family: 'Roboto, sans-serif' }
      },
      font: { family: 'Roboto, sans-serif' },
      margin: { t: 50, r: 50, b: 50, l: 50 },
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      legend: {
        orientation: 'v',
        x: 1.05,
        y: 0.5
      },
      autosize: true
    };

    const config = {
      responsive: true,
      displayModeBar: true,
      modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d'],
      toImageButtonOptions: {
        format: 'png',
        filename: 'category-sales-pie-chart',
        height: 500,
        width: 700,
        scale: 1
      }
    };

    // Use setTimeout to ensure DOM element exists
    setTimeout(() => {
      const element = document.getElementById('plotly-chart-category');
      if (element && this.plotly) {
        this.plotly.newPlot(element, plotData, layout, config);
      }
    }, 0);
  }
} 