import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { API_BASE_URL } from '../../../../shared/constants/api.constants';
import { Product, ProductPage, ProductFilters } from './product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.backend}${API_BASE_URL}/products`;

  list(filters: ProductFilters = {}): Observable<ProductPage> {
    const params = new URLSearchParams();
    if (filters.subCategoryId != null) params.set('subCategoryId', String(filters.subCategoryId));
    if (filters.page != null) params.set('page', String(filters.page));
    if (filters.size != null) params.set('size', String(filters.size));
    if (filters.sort) params.set('sort', filters.sort);
    const query = params.toString();

    return this.http.get<ProductPage>(`${this.baseUrl}${query ? '?' + query : ''}`);
  }

  save(product: Product): Observable<Product> {
    if (product.id) {
      return this.http.put<Product>(`${this.baseUrl}/${product.id}`, product);
    }

    return this.http.post<Product>(this.baseUrl, product);
  }
}
