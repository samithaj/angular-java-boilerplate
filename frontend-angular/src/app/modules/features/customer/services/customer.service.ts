import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { API_BASE_URL } from '../../../../shared/constants/api.constants';
import { Customer, CustomerPage, CustomerFilters } from './customer.model';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.backend}${API_BASE_URL}/customers`;

  list(filters: CustomerFilters = {}): Observable<CustomerPage> {
    const params = new URLSearchParams();
    if (filters.page != null) params.set('page', String(filters.page));
    if (filters.size != null) params.set('size', String(filters.size));
    if (filters.sort) params.set('sort', filters.sort);
    const query = params.toString();
    return this.http.get<CustomerPage>(`${this.baseUrl}${query ? '?' + query : ''}`);
  }

  save(customer: Customer): Observable<Customer> {
    if (customer.id) {
      return this.http.put<Customer>(`${this.baseUrl}/${customer.id}`, customer);
    }
    return this.http.post<Customer>(this.baseUrl, customer);
  }
}
