import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  ApiDataResponse,
  Category,
  Product,
  ProductCreateRequest,
} from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  getCategories(): Observable<Category[]> {
    return this.http
      .get<ApiDataResponse<Category[]>>(`${this.baseUrl}/categories`)
      .pipe(map((response) => response.data));
  }

  createProduct(payload: ProductCreateRequest): Observable<Product> {
    return this.http
      .post<ApiDataResponse<Product>>(`${this.baseUrl}/products`, payload)
      .pipe(map((response) => response.data));
  }
}
