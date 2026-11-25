import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ProductService } from './product';
import { environment } from '../../environments/environment';

describe('ProductService', () => {
  let service: ProductService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), ProductService],
    });
    service = TestBed.inject(ProductService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('creates a product with the Laravel payload contract', () => {
    const payload = {
      category_id: 2,
      name: 'Desk Lamp',
      description: 'Adjustable reading lamp.',
      price: '24.50',
    };
    let result: unknown;

    service.createProduct(payload).subscribe((product) => (result = product));

    const request = httpTesting.expectOne(`${environment.apiBaseUrl}/products`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(payload);
    request.flush({
      data: { id: 7, ...payload, category: { id: 2, name: 'Office' } },
    });

    expect(result).toMatchObject({ id: 7, name: 'Desk Lamp', price: '24.50' });
  });

  it('retrieves and unwraps categories', () => {
    let categories: unknown[] = [];
    service.getCategories().subscribe((value) => (categories = value));

    const request = httpTesting.expectOne(`${environment.apiBaseUrl}/categories`);
    expect(request.request.method).toBe('GET');
    request.flush({
      data: [{ id: 1, name: 'Electronics' }, { id: 2, name: 'Office' }],
    });

    expect(categories).toEqual([
      { id: 1, name: 'Electronics' },
      { id: 2, name: 'Office' },
    ]);
  });

  it('propagates HTTP errors', () => {
    let errorStatus = 0;
    service.createProduct({
      category_id: 999,
      name: 'Invalid',
      description: null,
      price: '1.00',
    }).subscribe({
      error: (error) => (errorStatus = error.status),
    });

    const request = httpTesting.expectOne(`${environment.apiBaseUrl}/products`);
    request.flush(
      { message: 'Validation failed', errors: { category_id: ['Invalid category'] } },
      { status: 422, statusText: 'Unprocessable Entity' },
    );

    expect(errorStatus).toBe(422);
  });
});
