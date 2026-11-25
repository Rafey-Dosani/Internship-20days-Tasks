import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { Observable, of } from 'rxjs';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product';
import { ProductDetailComponent } from './product-detail';

const sampleProduct: Product = {
  id: 9,
  category_id: 2,
  name: 'Desk Lamp',
  description: 'Adjustable reading lamp.',
  price: '24.50',
  category: { id: 2, name: 'Office' },
  created_at: '2025-01-15T10:00:00.000000Z',
};

describe('ProductDetailComponent', () => {
  let getProduct: ReturnType<typeof vi.fn<(id: number) => Observable<Product>>>;

  beforeEach(() => {
    getProduct = vi.fn(() => of(sampleProduct));
    TestBed.configureTestingModule({
      providers: [
        provideRouter([{ path: 'products/:id', component: ProductDetailComponent }]),
        { provide: ProductService, useValue: { getProduct } },
      ],
    });
  });

  it('reads the route parameter and requests the matching product', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/products/9', ProductDetailComponent);
    await harness.fixture.whenStable();

    expect(getProduct).toHaveBeenCalledWith(9);
    expect(harness.routeNativeElement?.textContent).toContain('Office');
    expect(harness.routeNativeElement?.textContent).toContain('Adjustable reading lamp.');
  });

  it('responds to product ID changes while staying on the detail route', async () => {
    const secondProduct = { ...sampleProduct, id: 10, name: 'Reading Light' };
    getProduct.mockReturnValueOnce(of(sampleProduct)).mockReturnValue(of(secondProduct));
    const harness = await RouterTestingHarness.create();

    await harness.navigateByUrl('/products/9', ProductDetailComponent);
    await harness.fixture.whenStable();
    await harness.navigateByUrl('/products/10', ProductDetailComponent);
    await harness.fixture.whenStable();

    expect(getProduct).toHaveBeenNthCalledWith(1, 9);
    expect(getProduct).toHaveBeenNthCalledWith(2, 10);
    expect(harness.routeNativeElement?.textContent).toContain('Reading Light');
  });

  it('shows an invalid-link message without making an API request', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/products/not-a-number', ProductDetailComponent);
    await harness.fixture.whenStable();

    expect(getProduct).not.toHaveBeenCalled();
    expect(harness.routeNativeElement?.textContent).toContain('This product link is invalid.');
  });

  it('shows a not-found message when the API no longer has the product', async () => {
    getProduct.mockReturnValueOnce(
      new Observable((subscriber) =>
        subscriber.error(new HttpErrorResponse({ status: 404 })),
      ),
    );
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/products/9', ProductDetailComponent);
    await harness.fixture.whenStable();

    expect(harness.routeNativeElement?.textContent).toContain(
      'This product could not be found.',
    );
    expect(TestBed.inject(Router).url).toBe('/products/9');
  });
});
