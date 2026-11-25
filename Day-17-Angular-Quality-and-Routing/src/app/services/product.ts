import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Category, Product } from '../models/product.model';

export class InvalidApiResponseError extends Error {
  constructor(
    message = 'The product API returned an invalid response. Check the Laravel API response shape.',
  ) {
    super(message);
    this.name = 'InvalidApiResponseError';
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isCategory(value: unknown): value is Category {
  if (!isRecord(value)) return false;

  return (
    Number.isInteger(value['id']) &&
    typeof value['name'] === 'string' &&
    (value['description'] === undefined ||
      value['description'] === null ||
      typeof value['description'] === 'string')
  );
}

function isProduct(value: unknown): value is Product {
  if (!isRecord(value)) return false;

  return (
    Number.isInteger(value['id']) &&
    Number.isInteger(value['category_id']) &&
    typeof value['name'] === 'string' &&
    (typeof value['description'] === 'string' || value['description'] === null) &&
    typeof value['price'] === 'string' &&
    (value['category'] === undefined ||
      value['category'] === null ||
      isCategory(value['category'])) &&
    (value['created_at'] === undefined || typeof value['created_at'] === 'string') &&
    (value['updated_at'] === undefined || typeof value['updated_at'] === 'string')
  );
}

function readResourceData(response: unknown): unknown {
  if (!isRecord(response) || !('data' in response)) {
    throw new InvalidApiResponseError();
  }
  return response['data'];
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  getProducts(): Observable<Product[]> {
    return this.http
      .get<unknown>(`${this.baseUrl}/products`)
      .pipe(
        map((response) => {
          const data = readResourceData(response);
          if (!Array.isArray(data)) throw new InvalidApiResponseError();

          const products: unknown[] = data;
          if (!products.every(isProduct)) throw new InvalidApiResponseError();
          return products;
        }),
      );
  }

  getProduct(id: number): Observable<Product> {
    return this.http
      .get<unknown>(`${this.baseUrl}/products/${id}`)
      .pipe(
        map((response) => {
          const data = readResourceData(response);
          if (!isProduct(data)) throw new InvalidApiResponseError();
          return data;
        }),
      );
  }
}
