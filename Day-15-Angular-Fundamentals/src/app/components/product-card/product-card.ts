import { CurrencyPipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css'
})
export class ProductCard {
  readonly product = input.required<Product>();
  readonly delete = output<number>();

  onDelete(): void {
    this.delete.emit(this.product().id);
  }
}
