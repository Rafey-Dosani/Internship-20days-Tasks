import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { InvalidApiResponseError, ProductService } from './product';
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

  it('fetches the Laravel product collection and unwraps its data', () => {
    let products: unknown[] = [];
    service.getProducts().subscribe((value) => (products = value));

    const request = httpTesting.expectOne(`${environment.apiBaseUrl}/products`);
    expect(request.request.method).toBe('GET');
    request.flush({
      data: [
        {
          id: 4,
          category_id: 2,
          name: 'Desk Lamp',
          description: 'Adjustable reading lamp.',
          price: '24.50',
          category: { id: 2, name: 'Office' },
        },
      ],
      links: {},
      meta: { current_page: 1, total: 1 },
    });

    expect(products).toMatchObject([
      { id: 4, name: 'Desk Lamp', category: { name: 'Office' } },
    ]);
  });

  it('requests one product by its Laravel resource ID', () => {
    let product: unknown;
    service.getProduct(7).subscribe((value) => (product = value));

    const request = httpTesting.expectOne(`${environment.apiBaseUrl}/products/7`);
    expect(request.request.method).toBe('GET');
    request.flush({
      data: {
        id: 7,
        category_id: 2,
        name: 'Desk Lamp',
        description: null,
        price: '24.50',
        category: { id: 2, name: 'Office' },
      },
    });

    expect(product).toMatchObject({ id: 7, name: 'Desk Lamp', price: '24.50' });
  });

  it('rejects a product collection that does not match the Laravel resource shape', () => {
    let error: unknown;
    service.getProducts().subscribe({ error: (caught) => (error = caught) });

    const request = httpTesting.expectOne(`${environment.apiBaseUrl}/products`);
    request.flush({ data: { products: [] } });

    expect(error).toBeInstanceOf(InvalidApiResponseError);
  });

  it('rejects a malformed product detail resource', () => {
    let error: unknown;
    service.getProduct(7).subscribe({ error: (caught) => (error = caught) });

    const request = httpTesting.expectOne(`${environment.apiBaseUrl}/products/7`);
    request.flush({ data: { id: 7, name: 'Incomplete response' } });

    expect(error).toBeInstanceOf(InvalidApiResponseError);
  });
});
