import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { CategoryStatisticsDto, SubcategoryStatisticsDto } from './statistics.model';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private readonly baseUrl = 'http://localhost:8080/api/v1/statistics';
  private readonly cache = new Map<string, Observable<any>>();

  constructor(private http: HttpClient) {}

  getCategorySalesStatistics(from: string, to: string): Observable<CategoryStatisticsDto[]> {
    const cacheKey = `category-sales-${from}-${to}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const params = new HttpParams()
      .set('from', from)
      .set('to', to);

    const request$ = this.http.get<CategoryStatisticsDto[]>(`${this.baseUrl}/category-sales`, { params })
      .pipe(shareReplay(1));

    this.cache.set(cacheKey, request$);
    return request$;
  }

  getSubcategorySalesStatistics(category: string | null, from: string, to: string): Observable<SubcategoryStatisticsDto[]> {
    const cacheKey = `subcategory-sales-${category || 'all'}-${from}-${to}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    let params = new HttpParams()
      .set('from', from)
      .set('to', to);
    
    if (category) {
      params = params.set('category', category);
    }

    const request$ = this.http.get<SubcategoryStatisticsDto[]>(`${this.baseUrl}/subcategory-sales`, { params })
      .pipe(shareReplay(1));

    this.cache.set(cacheKey, request$);
    return request$;
  }

  clearCache(): void {
    this.cache.clear();
  }
} 