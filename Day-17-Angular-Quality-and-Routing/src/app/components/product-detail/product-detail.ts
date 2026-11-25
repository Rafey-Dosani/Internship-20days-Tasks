import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  asapScheduler,
  catchError,
  map,
  observeOn,
  of,
  startWith,
  switchMap,
} from 'rxjs';
import { Product } from '../../models/product.model';
import { InvalidApiResponseError, ProductService } from '../../services/product';

type ProductDetailState =
  | { kind: 'loading' }
  | { kind: 'error'; message: string }
  | { kind: 'loaded'; product: Product };

@Component({
  selector: 'app-product-detail',
  imports: [CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetailComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  readonly state = signal<ProductDetailState>({ kind: 'loading' });

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        observeOn(asapScheduler),
        switchMap((params) => {
          const id = params.get('id');
          const numericId = Number(id);

          if (!id || !/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(numericId)) {
            return of<ProductDetailState>({
              kind: 'error',
              message:
                'This product link is invalid. Return to the product list and choose a product.',
            });
          }

          return this.productService.getProduct(numericId).pipe(
            map((product): ProductDetailState => ({ kind: 'loaded', product })),
            startWith<ProductDetailState>({ kind: 'loading' }),
            catchError((error: unknown) =>
              of<ProductDetailState>({
                kind: 'error',
                message: this.errorMessage(error),
              }),
            ),
          );
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (state) => this.state.set(state),
      });
  }

  private errorMessage(error: unknown): string {
    if (error instanceof InvalidApiResponseError) return error.message;
    if (!(error instanceof HttpErrorResponse)) {
      return 'Product details could not be loaded. Please try again.';
    }

    if (error.status === 404) {
      return 'This product could not be found. It may have been removed.';
    }

    return error.status === 0
      ? 'Cannot connect to the product API. Check that Laravel is running and CORS is configured.'
      : 'Product details could not be loaded. Please try again.';
  }
}
