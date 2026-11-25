import { Component } from '@angular/core';
import { ProductFormComponent } from './components/product-form/product-form';

@Component({
  selector: 'app-root',
  imports: [ProductFormComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
