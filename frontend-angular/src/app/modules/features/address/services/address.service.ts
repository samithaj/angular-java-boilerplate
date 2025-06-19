import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { API_BASE_URL } from '../../../../shared/constants/api.constants';
import { Address, AddressPage, AddressFilters } from './address.model';

@Injectable({ providedIn: 'root' })
export class AddressService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.backend}${API_BASE_URL}/addresses`;

  getAll(filters: AddressFilters = {}): Observable<AddressPage> {
    const params = new URLSearchParams();
    if (filters.page != null) params.set('page', String(filters.page));
    if (filters.size != null) params.set('size', String(filters.size));
    if (filters.sort) params.set('sort', filters.sort);
    const query = params.toString();

    return this.http.get<AddressPage>(`${this.baseUrl}${query ? '?' + query : ''}`);
  }

  save(address: Address): Observable<Address> {
    if (address.id) {
      return this.http.put<Address>(`${this.baseUrl}/${address.id}`, address);
    }

    return this.http.post<Address>(this.baseUrl, address);
  }
}
