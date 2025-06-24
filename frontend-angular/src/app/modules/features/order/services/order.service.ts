import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { API_BASE_URL } from '../../../../shared/constants/api.constants';
import { Order, OrderPage } from './order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.backend}${API_BASE_URL}/orders`;

  list(params: Record<string, any> = {}): Observable<OrderPage> {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value != null) search.set(key, String(value));
    }
    const query = search.toString();

    return this.http.get<OrderPage>(`${this.baseUrl}${query ? '?' + query : ''}`);
  }

  create(order: Order): Observable<Order> {
    return this.http.post<Order>(this.baseUrl, order);
  }

  get(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/${id}`);
  }

  update(order: Order): Observable<Order> {
    return this.http.put<Order>(`${this.baseUrl}/${order.id}`, order);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
