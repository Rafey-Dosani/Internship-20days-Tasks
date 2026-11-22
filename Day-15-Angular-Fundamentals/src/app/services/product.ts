import { Injectable, signal } from '@angular/core';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly products = signal<Product[]>([
    { id: 1, name: 'Wireless Headphones', category: 'Electronics', price: 129.99, available: true },
    { id: 2, name: 'Mechanical Keyboard', category: 'Electronics', price: 89.50, available: true },
    { id: 3, name: 'Leather Desk Mat', category: 'Workspace', price: 48.00, available: false },
    { id: 4, name: 'Ceramic Travel Mug', category: 'Lifestyle', price: 24.75, available: true },
    { id: 5, name: 'Minimal Desk Lamp', category: 'Workspace', price: 64.00, available: true },
    { id: 6, name: 'Canvas Backpack', category: 'Lifestyle', price: 72.25, available: false }
  ]);

  getProducts() {
    return this.products.asReadonly();
  }

  addProduct(product: Omit<Product, 'id'>): Product {
    const nextId = this.products().reduce((highest, item) => Math.max(highest, item.id), 0) + 1;
    const created = { id: nextId, ...product };
    this.products.update(items => [created, ...items]);
    return created;
  }

  deleteProduct(id: number): void {
    this.products.update(items => items.filter(product => product.id !== id));
  }
}
