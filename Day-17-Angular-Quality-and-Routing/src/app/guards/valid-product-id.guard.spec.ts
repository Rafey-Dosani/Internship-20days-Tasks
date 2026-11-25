import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { Observable, of } from 'rxjs';
import { Product } from '../models/product.model';
import { ProductService } from '../services/product';
import { ProductListComponent } from '../components/product-list/product-list';
import { ProductDetailComponent } from '../components/product-detail/product-detail';
import { appRoutes } from '../app.routes';

const sampleProduct: Product = {
  id: 3,
  category_id: 1,
  name: 'Notebook',
  description: null,
  price: '4.50',
};

describe('validProductIdGuard', () => {
  let getProducts: ReturnType<typeof vi.fn<() => Observable<Product[]>>>;
  let getProduct: ReturnType<typeof vi.fn<(id: number) => Observable<Product>>>;

  beforeEach(() => {
    getProducts = vi.fn(() => of([sampleProduct]));
    getProduct = vi.fn(() => of(sampleProduct));
    TestBed.configureTestingModule({
      providers: [
        provideRouter(appRoutes),
        { provide: ProductService, useValue: { getProducts, getProduct } },
      ],
    });
  });

  it('allows a syntactically valid product ID to reach its detail route', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/products/3', ProductDetailComponent);

    expect(TestBed.inject(Router).url).toBe('/products/3');
    expect(getProduct).toHaveBeenCalledWith(3);
  });

  it('redirects an invalid product ID to the list and explains the redirect', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/products/invalid', ProductListComponent);

    expect(TestBed.inject(Router).url).toBe('/products?invalidId=invalid');
    expect(harness.routeNativeElement?.textContent).toContain(
      'That product link is invalid.',
    );
    expect(getProduct).not.toHaveBeenCalled();
  });
});
