import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { API_BASE_URL } from '../../../../shared/constants/api.constants';
import { ProductCategory } from './product.model';

@Injectable({ providedIn: 'root' })
export class ProductCategoryService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.backend}${API_BASE_URL}/product-categories`;

  list(): Observable<ProductCategory[]> {
    return this.http.get<ProductCategory[]>(this.baseUrl);
  }

  save(category: ProductCategory): Observable<ProductCategory> {
    if (category.id) {
      return this.http.put<ProductCategory>(`${this.baseUrl}/${category.id}`, category);
    }

    return this.http.post<ProductCategory>(this.baseUrl, category);
  }
}
