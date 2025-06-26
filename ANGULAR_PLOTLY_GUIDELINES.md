# Angular Plotly.js Implementation Guidelines

This document provides best practices and guidelines for implementing Plotly.js charts in Angular applications, based on our successful implementation in the Statistics Module.

**✅ WORKING CONFIGURATION CONFIRMED** - Charts successfully rendering with the approaches documented below.

## Table of Contents

1. [Installation](#installation)
2. [Module Configuration](#module-configuration)
3. [SSR Compatibility](#ssr-compatibility)
4. [Component Implementation](#component-implementation)
5. [API Integration](#api-integration)
6. [Best Practices](#best-practices)
7. [Common Issues & Solutions](#common-issues--solutions)
8. [Performance Optimization](#performance-optimization)

## Installation

### Required Dependencies

```bash
# Core dependencies
npm install angular-plotly.js plotly.js-dist-min --save

# Type definitions (dev dependency)
npm install @types/plotly.js-dist-min --save-dev
```

### Version Compatibility

- **Angular 20.x** → Use `angular-plotly.js@20.x`
- **Angular 8.x** → Use `angular-plotly.js@1.x`

Since version 20, angular-plotly.js follows Angular's version numbering.

## Module Configuration

### ✅ Working Configuration: Standalone Components + Global Provider

**Pros**: Modern Angular patterns, SSR compatible, clean architecture
**Cons**: Requires Angular 17+ with standalone components

```typescript
// app.config.ts (RECOMMENDED - WORKING SOLUTION)
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import * as PlotlyJS from 'plotly.js-dist-min';
import { PlotlyModule } from 'angular-plotly.js';

export const appConfig: ApplicationConfig = {
  providers: [
    // ... other providers
    importProvidersFrom(PlotlyModule.forRoot(PlotlyJS))
  ]
};
```

### Alternative: Traditional NgModule (Legacy Support)

```typescript
// statistics.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlotlyModule } from 'angular-plotly.js';
import * as PlotlyJS from 'plotly.js-dist-min';

@NgModule({
  imports: [
    CommonModule,
    PlotlyModule.forRoot(PlotlyJS)
  ],
  exports: [
    PlotlyModule
  ]
})
export class StatisticsModule { }
```

## SSR Compatibility

### ✅ Proven SSR Solution: Browser-Only Loading

**Problem**: Plotly.js uses browser APIs (`self`, `window`) that cause SSR errors:
```
ReferenceError: self is not defined
```

**Solution**: Dynamic import in components with platform detection

```typescript
import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [CommonModule], // No PlotlyModule here
  template: `
    <div id="plotly-chart" 
         *ngIf="isBrowser && plotlyLoaded"
         [style]="{ width: '100%', height: '500px' }">
    </div>
    <div *ngIf="!isBrowser || loading" class="loading-state">
      Loading chart...
    </div>
  `
})
export class PieChartComponent implements OnInit {
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

  private async loadPlotly(): Promise<void> {
    try {
      this.plotlyInstance = await import('plotly.js-dist-min');
      this.plotlyLoaded = true;
      if (this.data?.length > 0) {
        this.updateChart();
      }
    } catch (error) {
      console.error('Failed to load Plotly:', error);
    }
  }

  private updateChart(): void {
    if (!this.plotlyInstance) return;
    
    const element = document.getElementById('plotly-chart');
    if (element) {
      this.plotlyInstance.newPlot(element, this.plotData, this.layout, this.config);
    }
  }
}
```

### Alternative: CDN Loading (Production)

**Pros**: Smaller bundle, faster builds, cached across applications
**Cons**: Requires internet connection, additional configuration

```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlotlyViaCDNModule } from 'angular-plotly.js';

@NgModule({
  imports: [
    CommonModule,
    PlotlyViaCDNModule.forRoot({
      version: '2.35.2', // Use specific version for production
      bundleName: 'basic' // Options: null (full), 'basic', 'cartesian', 'geo', 'gl3d', 'gl2d', 'mapbox', 'finance'
    })
  ]
})
export class StatisticsModule { }
```

## API Integration

### ✅ Proven Solution: Direct Backend Calls

**Best Practice**: Call backend APIs directly instead of using proxy configuration

```typescript
// statistics.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  // Direct backend URL - no proxy needed
  private readonly baseUrl = 'http://localhost:8080/api/v1/statistics';

  constructor(private http: HttpClient) {}

  getCategorySalesStatistics(from: string, to: string): Observable<any[]> {
    const params = new HttpParams()
      .set('from', from)
      .set('to', to);

    return this.http.get<any[]>(`${this.baseUrl}/category-sales`, { params });
  }
}
```

**Why Direct Calls Work Better**:
- ✅ No proxy configuration needed
- ✅ Clear API endpoint visibility  
- ✅ Easier debugging
- ✅ Works immediately without server restart

### Backend API Example

```bash
# Working API call
curl -X GET "http://localhost:8080/api/v1/statistics/category-sales?from=2025-06-01&to=2025-06-30" \
  -H "Content-Type: application/json"

# Response
[{"categoryName":"cloths","salesVolume":12,"totalSales":108000.00,"percentage":100.00}]
```

### Window Object Loading (For Custom Builds)

**Pros**: Maximum control over bundle composition
**Cons**: Requires manual script management

```json
// angular.json
{
  "projects": {
    "your-project": {
      "architect": {
        "build": {
          "options": {
            "scripts": [
              "node_modules/plotly.js-dist-min/plotly.min.js"
            ]
          }
        }
      }
    }
  }
}
```

```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlotlyViaWindowModule } from 'angular-plotly.js';

@NgModule({
  imports: [CommonModule, PlotlyViaWindowModule]
})
export class StatisticsModule { }
```

## Bundle Management

### Bundle Size Comparison

| Bundle Type | Size | Use Case |
|-------------|------|----------|
| Full | ~3MB | All chart types needed |
| Basic | ~1MB | Simple charts (bar, line, scatter) |
| Cartesian | ~1.5MB | 2D charts without maps |
| Geo | ~2MB | Geographic visualizations |

### Bundle Selection Guidelines

```typescript
// For basic business charts
bundleName: 'basic' // Includes: bar, scatter, line, pie

// For comprehensive dashboards
bundleName: null // Full bundle with all chart types

// For geographic applications
bundleName: 'geo' // Includes maps and geographic charts
```

## Component Implementation

### ✅ Working Implementation: SSR-Compatible Chart Component

**Production-ready component from our Statistics Module**:

```typescript
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
      this.plotlyInstance = await import('plotly.js-dist-min');
      this.plotlyLoaded = true;
      
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
```

### 2. Chart with Loading States

```typescript
template: `
  <div class="chart-container">
    <plotly-plot 
      *ngIf="!loading && !error"
      [data]="plotData" 
      [layout]="layout" 
      [config]="config"
      [style]="chartStyle"
      [useResizeHandler]="true">
    </plotly-plot>
    
    <div *ngIf="loading" class="loading-state">
      <mat-spinner></mat-spinner>
      <p>Loading chart...</p>
    </div>
    
    <div *ngIf="error" class="error-state">
      <mat-icon>error</mat-icon>
      <p>{{ error }}</p>
    </div>
  </div>
`,
styles: [`
  .loading-state, .error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    gap: 16px;
  }
  
  .error-state {
    color: #f44336;
  }
`]
```

## Best Practices

### 1. Chart Configuration

```typescript
// Responsive configuration
layout: {
  autosize: true,
  margin: { t: 50, r: 50, b: 50, l: 50 },
  // Don't set fixed width/height - use autosize
}

// Performance configuration
config: {
  responsive: true,
  displayModeBar: true,
  modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d'],
  toImageButtonOptions: {
    format: 'png',
    filename: 'chart-export',
    height: 500,
    width: 700,
    scale: 1
  }
}
```

### 2. Data Handling

```typescript
// Always validate data before rendering
private updateChart(): void {
  if (!this.data || this.data.length === 0) {
    return;
  }

  // Transform data safely
  const labels = this.data.map(item => item.label || 'Unknown');
  const values = this.data.map(item => Number(item.value) || 0);

  this.plotData = [{
    type: 'pie',
    labels,
    values,
    // ... rest of configuration
  }];
}
```

### 3. Memory Management

```typescript
import { Component, OnDestroy } from '@angular/core';

export class ChartComponent implements OnDestroy {
  ngOnDestroy(): void {
    // Plotly cleanup is handled automatically by angular-plotly.js
    // But clean up any subscriptions or timers
  }
}
```

### 4. Styling Guidelines

```typescript
// Use CSS custom properties for theming
styles: [`
  .chart-container {
    width: 100%;
    height: var(--chart-height, 400px);
    border: 1px solid var(--border-color, #e0e0e0);
    border-radius: 4px;
    padding: 16px;
  }
`]

// Theme-aware colors
const colors = {
  primary: '#3f51b5',
  secondary: '#2196f3',
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336'
};
```

## Common Issues & Solutions

### ✅ SOLVED: "self is not defined" SSR Error

**Problem**: `ReferenceError: self is not defined` during server-side rendering

**Solution**: Use platform detection and dynamic imports (see SSR Compatibility section above)

### ✅ SOLVED: API Proxy Issues  

**Problem**: `SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON`

**Root Cause**: Frontend calling `localhost:4200/api/*` but no proxy configured
**Solution**: Use direct backend calls instead of proxy

```typescript
// ❌ Don't use relative URLs that need proxy
private readonly baseUrl = '/api/v1/statistics';

// ✅ Use direct backend URLs  
private readonly baseUrl = 'http://localhost:8080/api/v1/statistics';
```

### ✅ SOLVED: Invalid Date Parameters

**Problem**: `DateTimeException: Invalid date 'JUNE 31'`

**Solution**: Use valid dates in API calls
```typescript
// ❌ Invalid - June has only 30 days
from: '2025-06-31'

// ✅ Valid
from: '2025-06-01', to: '2025-06-30'
```

### 4. Charts Not Responsive

**Problem**: Fixed dimensions preventing responsive behavior

**Solution**: Use proper responsive configuration

```typescript
layout: {
  autosize: true,
  margin: { t: 50, r: 50, b: 50, l: 50 }
}

config: {
  responsive: true
}
```

### 5. Charts Not Updating

**Problem**: Data changes not reflected in chart

**Solution**: Proper change detection with Plotly loaded check

```typescript
ngOnChanges(changes: SimpleChanges): void {
  if (changes['data'] && this.data?.length > 0 && this.plotlyLoaded) {
    this.updateChart();
  }
}
```

### 6. Charts Blank After Tab Switch *(Tabs hidden during initial render)*

**Problem**: When a Plotly chart is rendered inside an inactive `mat-tab`, the DOM container may have `width = 0` so Plotly draws a 0 × 0 canvas. When the user later activates the tab, the chart area stays empty.

**Quick Fix**:
```typescript
// statistics.ts – after both HTTP calls finish
if (typeof window !== 'undefined') {
  // Force Plotly to recalculate sizes for all registered charts
  setTimeout(() => window.dispatchEvent(new Event('resize')), 0);
}
```

**Alternative**: call `Plotly.Plots.resize(element)` for each chart in `ngAfterViewInit` of the tab.

### 7. "Run Report" Does Not Trigger Backend Call *(Observable cached with shareReplay)*

**Problem**: The statistics service caches Observables with `shareReplay(1)`. Re-using the same parameters returns the cached stream so no new HTTP request appears in DevTools.

**Solution 1 – Clear Cache Before Each Run**
```typescript
runReport() {
  this.statisticsService.clearCache(); // <-- added
  ...
}
```

**Solution 2 – Provide a `refresh` flag**: Maintain a cache key that includes a timestamp or incrementing version so each run is unique.

Both approaches guarantee fresh data and visible REST calls.

## Performance Optimization

### 1. Lazy Loading

```typescript
// Route-based lazy loading
const routes: Routes = [
  {
    path: 'statistics',
    loadChildren: () => import('./statistics/statistics.module').then(m => m.StatisticsModule)
  }
];
```

### 2. Data Optimization

```typescript
// Limit data points for performance
private optimizeData(data: any[]): any[] {
  const MAX_POINTS = 1000;
  if (data.length <= MAX_POINTS) {
    return data;
  }
  
  // Sample data or use aggregation
  const step = Math.ceil(data.length / MAX_POINTS);
  return data.filter((_, index) => index % step === 0);
}
```

### 3. Chart Reuse

```typescript
// Use trackBy for ngFor with charts
trackByChartId(index: number, chart: any): string {
  return chart.id;
}
```

### 4. Memory Management

```typitten
// Avoid memory leaks
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartComponent {
  // Use OnPush for better performance
}
```

## ✅ Example Implementation - WORKING IN PRODUCTION

**Our Statistics Module** - fully functional and tested:

### File Structure
```
frontend-angular/src/app/modules/features/statistics/
├── category-pie-chart/
│   └── category-pie-chart.component.ts    # SSR-compatible chart component
├── services/
│   ├── statistics.service.ts               # Direct backend API calls
│   └── statistics.model.ts                # TypeScript interfaces
└── statistics/
    └── statistics.ts                       # Main page with date controls
```

### Backend Integration
```
backend-java-springboot/src/main/java/com/example/crm/
├── web/
│   ├── StatisticsController.java           # REST endpoints
│   └── dto/CategoryStatisticsDto.java      # Data transfer objects
├── service/
│   └── StatisticsService.java              # Business logic
└── domain/repository/
    └── OrderHeaderRepository.java          # JPA queries
```

### Key Features Implemented ✅
- ✅ **SSR Compatible**: No `self is not defined` errors
- ✅ **Direct API Calls**: No proxy configuration needed  
- ✅ **Real Data**: Connected to MySQL database with sales data
- ✅ **Responsive Charts**: Works on mobile and desktop
- ✅ **Material Design**: Integrated with Angular Material
- ✅ **Error Handling**: Proper loading states and error messages
- ✅ **PowerBuilder Style**: Blue-dominant color scheme matching legacy app

### Verified Working URLs
- **Frontend**: `http://localhost:4200/statistics`
- **Backend API**: `http://localhost:8080/api/v1/statistics/category-sales`
- **Sample Data**: Returns category sales statistics for June 2025

## References

- [angular-plotly.js Documentation](https://www.npmjs.com/package/angular-plotly.js)
- [Plotly.js Documentation](https://plotly.com/javascript/)
- [Angular Performance Guide](https://angular.dev/best-practices/performance) 