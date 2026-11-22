import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Header } from '../../components/header/header';
import { ProductCard } from '../../components/product-card/product-card';
import { ProductService } from '../../services/product';

@Component({
  selector: 'app-products',
  imports: [FormsModule, Header, ProductCard],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products {
  private readonly productService = inject(ProductService);
  readonly products = this.productService.getProducts();

  readonly searchText = signal('');
  readonly selectedCategory = signal('All');
  readonly categories = ['Electronics', 'Workspace', 'Lifestyle'];
  readonly feedback = signal('');
  readonly submitted = signal(false);

  readonly formProduct = {
    name: '',
    category: 'Electronics',
    price: null as number | null,
    available: true
  };

  readonly categoryOptions = computed(() => [
    'All',
    ...new Set(this.products().map(product => product.category))
  ]);

  readonly filteredProducts = computed(() => {
    const query = this.searchText().trim().toLowerCase();
    const category = this.selectedCategory();
    return this.products().filter(product =>
      product.name.toLowerCase().includes(query) &&
      (category === 'All' || product.category === category)
    );
  });

  readonly availableCount = computed(() =>
    this.products().filter(product => product.available).length
  );

  readonly outOfStockCount = computed(() =>
    this.products().filter(product => !product.available).length
  );

  onSearch(value: string): void {
    this.searchText.set(value);
  }

  onCategoryChange(value: string): void {
    this.selectedCategory.set(value);
  }

  clearFilters(): void {
    this.searchText.set('');
    this.selectedCategory.set('All');
  }

  addProduct(): void {
    this.submitted.set(true);
    const name = this.formProduct.name.trim();
    const price = this.formProduct.price;

    if (!name || name.length < 2 || price === null || price <= 0) {
      this.feedback.set('Please complete all fields with a valid product name and price.');
      return;
    }

    this.productService.addProduct({
      name,
      category: this.formProduct.category,
      price,
      available: this.formProduct.available
    });

    this.feedback.set(`${name} was added successfully.`);
    this.submitted.set(false);
    this.formProduct.name = '';
    this.formProduct.category = 'Electronics';
    this.formProduct.price = null;
    this.formProduct.available = true;
  }

  deleteProduct(id: number): void {
    const product = this.products().find(item => item.id === id);
    this.productService.deleteProduct(id);
    this.feedback.set(product ? `${product.name} was removed.` : 'Product was removed.');
  }
}
