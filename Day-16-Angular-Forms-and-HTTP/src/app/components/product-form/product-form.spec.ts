import { TestBed } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ProductFormComponent } from './product-form';
import { environment } from '../../../environments/environment';

describe('ProductFormComponent', () => {
  let fixture: ComponentFixture<ProductFormComponent>;
  let component: ProductFormComponent;
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductFormComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    httpTesting = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpTesting.match(`${environment.apiBaseUrl}/categories`).forEach((request) => {
      if (!request.cancelled) request.flush({ data: [] });
    });
    httpTesting.verify();
  });

  function flushCategories(): void {
    httpTesting.expectOne(`${environment.apiBaseUrl}/categories`).flush({
      data: [{ id: 1, name: 'Electronics' }],
    });
  }

  it('starts invalid and rejects invalid prices', () => {
    flushCategories();
    expect(component.productForm.invalid).toBe(true);

    component.productForm.controls.price.setValue('-1');
    expect(component.productForm.controls.price.errors?.['positiveMoney']).toBe(true);
  });

  it('passes validation for a complete valid form', () => {
    flushCategories();
    component.productForm.setValue({
      category_id: 1,
      name: 'Desk Lamp',
      description: 'Adjustable lamp',
      price: '24.50',
    });
    expect(component.productForm.valid).toBe(true);
  });

  it('shows required field feedback and does not submit an invalid form', () => {
    flushCategories();
    component.submit();
    fixture.detectChanges();

    expect(component.productForm.controls.name.errors?.['required']).toBe(true);
    expect(component.productForm.controls.category_id.errors?.['required']).toBe(true);
    expect(component.productForm.controls.price.errors?.['required']).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('Product name is required.');
    httpTesting.expectNone(`${environment.apiBaseUrl}/products`);
  });

  it('shows loading, sends valid data, then shows success and resets', () => {
    flushCategories();
    component.productForm.setValue({
      category_id: 1,
      name: 'Desk Lamp',
      description: null,
      price: '24.50',
    });

    component.submit();
    fixture.detectChanges();
    expect(component.isLoading).toBe(true);
    const submit = fixture.nativeElement.querySelector('button[type="submit"]') as HTMLButtonElement;
    expect(submit.disabled).toBe(true);

    const request = httpTesting.expectOne(`${environment.apiBaseUrl}/products`);
    expect(request.request.body).toEqual({
      category_id: 1,
      name: 'Desk Lamp',
      description: null,
      price: '24.50',
    });
    request.flush({
      data: {
        id: 4,
        category_id: 1,
        name: 'Desk Lamp',
        description: null,
        price: '24.50',
      },
    });
    fixture.detectChanges();

    expect(component.isLoading).toBe(false);
    expect(component.successMessage).toContain('created successfully');
    expect(component.productForm.pristine).toBe(true);
    expect(component.productForm.controls.name.value).toBeNull();
  });

  it('shows API errors and resets loading on failure', () => {
    flushCategories();
    component.productForm.setValue({
      category_id: 1,
      name: 'Desk Lamp',
      description: '',
      price: '24.50',
    });

    component.submit();
    const request = httpTesting.expectOne(`${environment.apiBaseUrl}/products`);
    request.flush(
      { message: 'Validation failed', errors: { price: ['The price is invalid.'] } },
      { status: 422, statusText: 'Unprocessable Entity' },
    );
    fixture.detectChanges();

    expect(component.isLoading).toBe(false);
    expect(component.errorMessage).toBe('Please correct the highlighted fields.');
    expect(fixture.nativeElement.textContent).toContain('Could not save product');
  });
});
