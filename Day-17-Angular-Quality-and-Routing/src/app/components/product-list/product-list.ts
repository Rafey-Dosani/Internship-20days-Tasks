import { HttpErrorResponse } from '@angular/common/http';
import { CurrencyPipe } from '@angular/common';
import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize, throwIfEmpty } from 'rxjs';
import { Product } from '../../models/product.model';
import { InvalidApiResponseError, ProductService } from '../../services/product';

@Component({
  selector: 'app-product-list',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductListComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  readonly products = signal<Product[]>([]);
  readonly isLoading = signal(true);
  readonly errorMessage = signal('');
  readonly navigationNotice = signal('');

  ngOnInit(): void {
    this.route.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        this.navigationNotice.set(
          params.has('invalidId')
            ? 'That product link is invalid. Choose a product from the list.'
            : '',
        );
      });
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.productService
      .getProducts()
      .pipe(
        throwIfEmpty(
          () =>
            new InvalidApiResponseError(
              'The product API completed without returning a product collection.',
            ),
        ),
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe({
        next: (products) => {
          this.products.set(products);
        },
        error: (error: unknown) => {
          this.errorMessage.set(this.getErrorMessage(error));
        },
      });
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof InvalidApiResponseError) return error.message;

    if (error instanceof HttpErrorResponse && error.status === 0) {
      return 'Cannot connect to the product API. Check that Laravel is running and CORS is configured.';
    }

    return 'Products could not be loaded. Please try again.';
  }
}
