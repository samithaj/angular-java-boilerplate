import { Component, Input, OnChanges, SimpleChanges, PLATFORM_ID, Inject, OnInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CategoryStatisticsDto } from '../services/statistics.model';

@Component({
  selector: 'app-category-pie-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-container">
      <div *ngIf="isBrowser && plotlyLoaded" 
           #plotlyContainer 
           id="plotly-chart"
           [style]="{ width: '100%', height: '500px' }">
      </div>
      <div *ngIf="!isBrowser || loading" class="loading-overlay">
        <p>Loading chart...</p>
      </div>
      <div *ngIf="error" class="error-message">
        {{ error }}
      </div>
    </div>
  `,
  styles: [`
    .chart-container {
      position: relative;
      width: 100%;
      height: 500px;
    }
    
    .loading-overlay {
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
    }
    
    .error-message {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #f44336;
      text-align: center;
      background: rgba(255, 255, 255, 0.9);
      padding: 20px;
      border-radius: 4px;
    }
  `]
})
export class CategoryPieChartComponent implements OnInit, OnChanges {
  @Input() data: CategoryStatisticsDto[] = [];
  @Input() loading = false;
  @Input() error: string | null = null;
  
  plotData: any[] = [];
  layout: any = {};
  config: any = {};
  isBrowser = false;
  plotlyLoaded = false;
  private plotlyInstance: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  async ngOnInit(): Promise<void> {
    if (this.isBrowser) {
      await this.loadPlotly();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data?.length > 0 && this.plotlyLoaded) {
      this.updateChart();
    }
  }

  private async loadPlotly(): Promise<void> {
    try {
      // Dynamic import of Plotly only in browser
      this.plotlyInstance = await import('plotly.js-dist-min');
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
    if (!this.data || this.data.length === 0 || !this.plotlyInstance) {
      return;
    }

    const labels = this.data.map(item => item.categoryName);
    const values = this.data.map(item => item.salesVolume);
    const text = this.data.map(item => `${item.percentage}%`);

    // PowerBuilder-style colors (blue dominant)
    const colors = [
      '#3f51b5', // Blue for Bikes (dominant)
      '#2196f3', // Light blue for Components  
      '#4caf50', // Green for Clothing
      '#ff9800'  // Orange for Accessories
    ];

    this.plotData = [{
      type: 'pie',
      labels: labels,
      values: values,
      text: text,
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

    this.layout = {
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

    this.config = {
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

    // Use native Plotly.js instead of angular-plotly.js wrapper
    setTimeout(() => {
      const element = document.getElementById('plotly-chart');
      if (element && this.plotlyInstance) {
        this.plotlyInstance.newPlot(element, this.plotData, this.layout, this.config);
      }
    }, 0);
  }
} 