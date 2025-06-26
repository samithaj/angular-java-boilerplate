import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { API_BASE_URL } from '../../../../shared/constants/api.constants';
import { Address, AddressPage, AddressFilters } from './address.model';

export interface AddressSearchFilters extends AddressFilters {
  q?: string;
  city?: string;
  state?: string;
  postalCode?: string;
}

@Injectable({ providedIn: 'root' })
export class AddressService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.backend}${API_BASE_URL}/addresses`;

  getAll(filters: AddressFilters = {}): Observable<AddressPage> {
    let params = new HttpParams();
    
    if (filters.page != null) params = params.set('page', String(filters.page));
    if (filters.size != null) params = params.set('size', String(filters.size));
    if (filters.sort) params = params.set('sort', filters.sort);

    return this.http.get<AddressPage>(this.baseUrl, { params });
  }

  search(filters: AddressSearchFilters = {}): Observable<AddressPage> {
    let params = new HttpParams();
    
    // Search parameters
    if (filters.q) params = params.set('q', filters.q);
    if (filters.city) params = params.set('city', filters.city);
    if (filters.state) params = params.set('state', filters.state);
    if (filters.postalCode) params = params.set('postalCode', filters.postalCode);
    
    // Pagination parameters
    if (filters.page != null) params = params.set('page', String(filters.page));
    if (filters.size != null) params = params.set('size', String(filters.size));
    if (filters.sort) params = params.set('sort', filters.sort);

    return this.http.get<AddressPage>(`${this.baseUrl}/search`, { params });
  }

  getById(id: number): Observable<Address> {
    return this.http.get<Address>(`${this.baseUrl}/${id}`);
  }

  create(address: Omit<Address, 'id'>): Observable<Address> {
    return this.http.post<Address>(this.baseUrl, address);
  }

  update(id: number, address: Partial<Address>): Observable<Address> {
    return this.http.put<Address>(`${this.baseUrl}/${id}`, address);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  save(address: Address): Observable<Address> {
    if (address.id) {
      return this.update(address.id, address);
    }
    return this.create(address);
  }
}
