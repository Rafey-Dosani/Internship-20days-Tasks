import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';
import { Category, ProductCreateRequest } from '../../models/product.model';
import { ProductService } from '../../services/product';

function positiveMoney(control: AbstractControl): ValidationErrors | null {
  if (control.value === '' || control.value === null) return null;
  const value = String(control.value);
  if (!/^(?:0|[1-9]\d*)(?:\.\d{1,2})?$/.test(value)) return { positiveMoney: true };
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0 || number > 99999999.99) {
    return { positiveMoney: true };
  }
  return null;
}

@Component({
  selector: 'app-product-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css',
})
export class ProductFormComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly destroyRef = inject(DestroyRef);

  categories: Category[] = [];
  isLoading = false;
  isLoadingCategories = true;
  successMessage = '';
  errorMessage = '';
  backendErrors: Record<string, string[]> = {};

  readonly productForm = new FormGroup({
    category_id: new FormControl<number | null>(null, [Validators.required]),
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(255),
    ]),
    description: new FormControl('', [Validators.maxLength(2000)]),
    price: new FormControl('', [
      Validators.required,
      positiveMoney,
    ]),
  });

  ngOnInit(): void {
    this.productService
      .getCategories()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (categories) => {
          this.categories = categories;
          this.isLoadingCategories = false;
        },
        error: (error: HttpErrorResponse) => {
          this.isLoadingCategories = false;
          this.errorMessage =
            'Categories could not be loaded. Check that Laravel is running and retry.';
          this.backendErrors = this.extractBackendErrors(error);
        },
      });
  }

  submit(): void {
    this.successMessage = '';
    this.errorMessage = '';
    this.backendErrors = {};
    this.productForm.markAllAsTouched();

    if (this.productForm.invalid || this.isLoading) return;

    const raw = this.productForm.getRawValue();
    const payload: ProductCreateRequest = {
      category_id: raw.category_id as number,
      name: raw.name?.trim() as string,
      description: raw.description?.trim() || null,
      price: raw.price as string,
    };

    this.isLoading = true;
    this.productService
      .createProduct(payload)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => (this.isLoading = false)),
      )
      .subscribe({
        next: (product) => {
          this.successMessage = `"${product.name}" was created successfully.`;
          this.productForm.reset();
        },
        error: (error: HttpErrorResponse) => {
          this.backendErrors = this.extractBackendErrors(error);
          this.errorMessage =
            error.status === 0
              ? 'Cannot connect to the API. Check that Laravel is running and CORS is configured.'
              : error.status === 422
                ? 'Please correct the highlighted fields.'
                : 'The product could not be created. Please try again.';
        },
      });
  }

  fieldError(field: string): boolean {
    const control = this.productForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  private extractBackendErrors(error: HttpErrorResponse): Record<string, string[]> {
    const body = error.error as { errors?: Record<string, string[]> } | null;
    return body?.errors ?? {};
  }
}
