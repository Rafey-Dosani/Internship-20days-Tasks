import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { EMPTY, Observable, Subject, of, throwError } from 'rxjs';
import { Product } from '../../models/product.model';
import { InvalidApiResponseError, ProductService } from '../../services/product';
import { appRoutes } from '../../app.routes';
import { ProductListComponent } from './product-list';

const sampleProduct: Product = {
  id: 4,
  category_id: 2,
  name: 'Desk Lamp',
  description: 'Adjustable reading lamp.',
  price: '24.50',
  category: { id: 2, name: 'Office' },
};

describe('ProductListComponent', () => {
  let getProducts: ReturnType<typeof vi.fn<() => Observable<Product[]>>>;
  let getProduct: ReturnType<typeof vi.fn<(id: number) => Observable<Product>>>;

  beforeEach(() => {
    getProducts = vi.fn(() => of([sampleProduct]));
    getProduct = vi.fn(() => of(sampleProduct));
    TestBed.configureTestingModule({
      imports: [ProductListComponent],
      providers: [
        provideRouter(appRoutes),
        { provide: ProductService, useValue: { getProducts, getProduct } },
      ],
    });
  });

  it('renders product details and a descriptive navigation link', () => {
    const fixture = TestBed.createComponent(ProductListComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Desk Lamp');
    expect(fixture.nativeElement.textContent).toContain('Office');
    expect(fixture.nativeElement.textContent).toContain('Adjustable reading lamp.');
    expect(
      fixture.nativeElement.querySelector('a[aria-label="View details for Desk Lamp"]'),
    ).not.toBeNull();
  });

  it('shows an empty state when the API returns no products', () => {
    getProducts.mockReturnValue(of([]));
    const fixture = TestBed.createComponent(ProductListComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('No products are available yet.');
    expect(fixture.nativeElement.querySelector('[aria-busy="true"]')).toBeNull();
  });

  it('updates the rendered list when an asynchronous API response arrives', async () => {
    const response = new Subject<Product[]>();
    getProducts.mockReturnValue(response);
    const fixture = TestBed.createComponent(ProductListComponent);
    fixture.autoDetectChanges();

    expect(fixture.nativeElement.textContent).toContain('Loading products');
    response.next([sampleProduct]);
    response.complete();
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('Desk Lamp');
    expect(fixture.nativeElement.querySelector('[aria-busy="true"]')).toBeNull();
  });

  it('leaves loading and reports an error if the request completes without a response', () => {
    getProducts.mockReturnValue(EMPTY);
    const fixture = TestBed.createComponent(ProductListComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[aria-busy="true"]')).toBeNull();
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain(
      'completed without returning a product collection',
    );
  });

  it('leaves loading and explains an invalid API response', () => {
    getProducts.mockReturnValue(throwError(() => new InvalidApiResponseError()));
    const fixture = TestBed.createComponent(ProductListComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[aria-busy="true"]')).toBeNull();
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain(
      'invalid response',
    );
  });

  it('shows a connection hint for a network failure and clears loading', () => {
    getProducts.mockReturnValueOnce(
      throwError(() => new HttpErrorResponse({ status: 0 })),
    );
    const fixture = TestBed.createComponent(ProductListComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[aria-busy="true"]')).toBeNull();
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain(
      'Cannot connect to the product API',
    );
  });

  it('announces API errors and lets the user retry', () => {
    getProducts
      .mockReturnValueOnce(throwError(() => new HttpErrorResponse({ status: 500 })))
      .mockReturnValue(of([sampleProduct]));
    const fixture = TestBed.createComponent(ProductListComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="alert"]')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('[aria-busy="true"]')).toBeNull();
    fixture.nativeElement.querySelector('button').click();
    fixture.detectChanges();

    expect(getProducts).toHaveBeenCalledTimes(2);
    expect(fixture.nativeElement.textContent).toContain('Desk Lamp');
  });

  it('navigates to the selected product details when its link is activated', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/products', ProductListComponent);
    const link = harness.routeNativeElement?.querySelector<HTMLAnchorElement>(
      'a[aria-label="View details for Desk Lamp"]',
    );

    expect(link).not.toBeNull();
    link?.click();
    await harness.fixture.whenStable();

    expect(TestBed.inject(Router).url).toBe('/products/4');
    expect(getProduct).toHaveBeenCalledWith(4);
  });
});
