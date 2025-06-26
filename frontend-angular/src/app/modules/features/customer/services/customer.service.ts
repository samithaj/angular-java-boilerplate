import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { API_BASE_URL } from '../../../../shared/constants/api.constants';
import { Customer, CustomerPage, CustomerFilters } from './customer.model';

export interface CustomerSearchFilters extends CustomerFilters {
  q?: string;
  email?: string;
  name?: string;
  city?: string;
}

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.backend}${API_BASE_URL}/customers`;

  list(filters: CustomerFilters = {}): Observable<CustomerPage> {
    let params = new HttpParams();
    
    if (filters.page != null) params = params.set('page', String(filters.page));
    if (filters.size != null) params = params.set('size', String(filters.size));
    if (filters.sort) params = params.set('sort', filters.sort);

    return this.http.get<CustomerPage>(this.baseUrl, { params });
  }

  search(filters: CustomerSearchFilters = {}): Observable<CustomerPage> {
    let params = new HttpParams();
    
    // Search parameters
    if (filters.q) params = params.set('q', filters.q);
    if (filters.email) params = params.set('email', filters.email);
    if (filters.name) params = params.set('name', filters.name);
    if (filters.city) params = params.set('city', filters.city);
    
    // Pagination parameters
    if (filters.page != null) params = params.set('page', String(filters.page));
    if (filters.size != null) params = params.set('size', String(filters.size));
    if (filters.sort) params = params.set('sort', filters.sort);

    return this.http.get<CustomerPage>(`${this.baseUrl}/search`, { params });
  }

  getById(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.baseUrl}/${id}`);
  }

  create(customer: Omit<Customer, 'id'>): Observable<Customer> {
    return this.http.post<Customer>(this.baseUrl, customer);
  }

  update(id: number, customer: Partial<Customer>): Observable<Customer> {
    return this.http.put<Customer>(`${this.baseUrl}/${id}`, customer);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  save(customer: Customer): Observable<Customer> {
    if (customer.id) {
      return this.update(customer.id, customer);
    }
    return this.create(customer);
  }
}
