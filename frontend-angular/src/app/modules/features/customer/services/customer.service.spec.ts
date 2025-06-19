import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CustomerService } from './customer.service';
import { environment } from '../../../../../environments/environment';
import { API_BASE_URL } from '../../../../shared/constants/api.constants';
import { Customer } from './customer.model';

describe('CustomerService', () => {
  let service: CustomerService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.backend}${API_BASE_URL}/customers`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(CustomerService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should list customers', () => {
    const mock: Customer[] = [{ id: 1, firstName: 'A', lastName: 'B', email: 'a@b.com' }];

    service.list().subscribe(res => {
      expect(res.content.length).toBe(1);
    });

    const req = httpMock.expectOne(`${baseUrl}`);
    expect(req.request.method).toBe('GET');
    req.flush({ content: mock, totalElements: 1 });
  });
});
