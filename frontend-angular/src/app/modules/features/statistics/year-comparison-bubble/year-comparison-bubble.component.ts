import { Component, Input, OnChanges, SimpleChanges, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { YearComparisonDto } from '../services/statistics.model';

@Component({
  selector: 'app-year-comparison-bubble',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-container">
      <div *ngIf="isBrowser && plotlyLoaded && !isLoading && !errorMessage && data.length > 0"
           id="plotly-chart-bubble"
           [style]="{width: '100%', height: '600px'}">
      </div>
      
      <div class="chart-loading" *ngIf="isLoading || !plotlyLoaded">
        <p>{{ plotlyLoaded ? 'Loading chart data...' : 'Loading chart library...' }}</p>
      </div>
      
      <div class="chart-error" *ngIf="errorMessage">
        <p>{{ errorMessage }}</p>
      </div>
      
      <div class="no-data" *ngIf="!isLoading && !errorMessage && data.length === 0 && plotlyLoaded">
        <p>No bubble chart data available</p>
      </div>
    </div>
  `,
  styles: [`
    .chart-container {
      position: relative;
      width: 100%;
      height: 600px;
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
export class YearComparisonBubbleComponent implements OnInit, OnChanges {
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

    // Get the years from the first data item
    const yearA = this.data[0]?.yearA || 2013;
    const yearB = this.data[0]?.yearB || 2012;

    // Create data for Year A bubbles
    const yearAData = {
      x: this.data.map(item => item.totalSalesYearA),
      y: this.data.map(item => item.categoryName),
      mode: 'markers',
      type: 'scatter',
      name: `${yearA}`,
      text: this.data.map(item => 
        `${item.categoryName}<br>` +
        `Year: ${yearA}<br>` +
        `Sales: $${item.totalSalesYearA.toLocaleString()}<br>` +
        `Volume: ${item.salesVolumeYearA.toLocaleString()}`
      ),
      hovertemplate: '%{text}<extra></extra>',
      marker: {
        size: this.data.map(item => Math.max(10, Math.sqrt(item.salesVolumeYearA) * 2)),
        color: '#3f51b5',
        opacity: 0.7,
        line: {
          color: '#1a237e',
          width: 2
        }
      }
    };

    // Create data for Year B bubbles
    const yearBData = {
      x: this.data.map(item => item.totalSalesYearB),
      y: this.data.map(item => item.categoryName),
      mode: 'markers',
      type: 'scatter',
      name: `${yearB}`,
      text: this.data.map(item => 
        `${item.categoryName}<br>` +
        `Year: ${yearB}<br>` +
        `Sales: $${item.totalSalesYearB.toLocaleString()}<br>` +
        `Volume: ${item.salesVolumeYearB.toLocaleString()}`
      ),
      hovertemplate: '%{text}<extra></extra>',
      marker: {
        size: this.data.map(item => Math.max(10, Math.sqrt(item.salesVolumeYearB) * 2)),
        color: '#2196f3',
        opacity: 0.7,
        line: {
          color: '#0d47a1',
          width: 2
        }
      }
    };

    const plotData = [yearAData, yearBData];

    const layout = {
      title: {
        text: `Sales Volume Bubble Chart: ${yearA} vs ${yearB}`,
        font: { size: 16, family: 'Roboto, sans-serif' }
      },
      xaxis: {
        title: 'Total Sales ($)',
        tickformat: ',.0f',
        type: 'linear'
      },
      yaxis: {
        title: 'Category',
        type: 'category'
      },
      font: { family: 'Roboto, sans-serif' },
      margin: { t: 60, r: 50, b: 80, l: 120 },
      autosize: true,
      legend: {
        orientation: 'h',
        x: 0.5,
        xanchor: 'center',
        y: 1.02
      },
      annotations: [{
        x: 0.5,
        y: -0.15,
        xref: 'paper',
        yref: 'paper',
        text: 'Bubble size represents sales volume',
        showarrow: false,
        font: {
          size: 12,
          color: '#666'
        }
      }],
      dragmode: 'pan'
    };

    const config = {
      responsive: true,
      displayModeBar: true,
      modeBarButtonsToRemove: ['lasso2d', 'select2d'],
      scrollZoom: true,
      toImageButtonOptions: {
        format: 'png',
        filename: 'year-comparison-bubble-chart',
        height: 600,
        width: 800,
        scale: 1
      }
    };

    setTimeout(() => {
      const element = document.getElementById('plotly-chart-bubble');
      if (element && this.plotly) {
        this.plotly.newPlot(element, plotData, layout, config);
      }
    }, 0);
  }
} 