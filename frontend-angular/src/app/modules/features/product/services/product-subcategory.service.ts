import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { API_BASE_URL } from '../../../../shared/constants/api.constants';
import { ProductSubCategory } from './product.model';

@Injectable({ providedIn: 'root' })
export class ProductSubCategoryService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.backend}${API_BASE_URL}/product-subcategories`;

  list(categoryId?: number): Observable<ProductSubCategory[]> {
    const url = categoryId != null ? `${this.baseUrl}?categoryId=${categoryId}` : this.baseUrl;

    return this.http.get<ProductSubCategory[]>(url);
  }
}
