import { Routes } from '@angular/router';
import { ProductDetailComponent } from './components/product-detail/product-detail';
import { ProductListComponent } from './components/product-list/product-list';
import { validProductIdGuard } from './guards/valid-product-id.guard';

export const appRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'products' },
  { path: 'products', component: ProductListComponent },
  {
    path: 'products/:id',
    component: ProductDetailComponent,
    canActivate: [validProductIdGuard],
  },
  { path: '**', redirectTo: 'products' },
];
