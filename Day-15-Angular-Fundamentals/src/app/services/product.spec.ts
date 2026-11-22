import { TestBed } from '@angular/core/testing';
import { ProductService } from './product';

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductService);
  });

  it('returns the sample products', () => {
    expect(service.getProducts()().length).toBe(6);
  });

  it('adds a product with an incremented id', () => {
    const created = service.addProduct({
      name: 'Office Plant',
      category: 'Lifestyle',
      price: 35,
      available: true
    });

    expect(created.id).toBe(7);
    expect(service.getProducts()()[0].name).toBe('Office Plant');
  });

  it('deletes a product by id', () => {
    service.deleteProduct(1);
    expect(service.getProducts()().some(product => product.id === 1)).toBe(false);
  });
});
