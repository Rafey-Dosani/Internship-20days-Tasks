# Day 15 - Angular Fundamentals

A polished product management and catalog application built with Angular 21 standalone components. It demonstrates components, templates, data binding, services, dependency injection, and modern Angular control-flow syntax without a backend or external API.

## Features

- Product catalog with sample inventory
- Reusable product card component
- Shared header with live product count
- Add-product form with template-driven validation
- Delete-product action
- Product search by name
- Category filtering
- Total, available, and out-of-stock summaries
- Clear empty state and feedback messages
- Responsive desktop and mobile layout

## Technologies

- Angular 21.2.30
- Standalone components
- TypeScript 5.9
- Angular Forms
- Angular Signals
- CSS
- Vitest unit testing

## Project structure

```text
src/app/
  components/
    header/
    product-card/
  models/
    product.model.ts
  pages/
    products/
  services/
    product.ts
  app.ts
  app.routes.ts
  app.html
```

## Component responsibilities

- `App`: application root and router outlet.
- `Header`: reusable navigation and live product summary.
- `ProductCard`: reusable presentation component that receives a product through an input and emits a delete event.
- `Products`: feature page that handles listing, filtering, form state, summaries, and service operations.

## ProductService and dependency injection

`ProductService` is provided at the application root with `@Injectable({ providedIn: 'root' })`. It stores products in an in-memory Angular signal and exposes `getProducts`, `addProduct`, and `deleteProduct`. The Products page injects the service with `inject(ProductService)`, demonstrating Angular dependency injection without a backend.

## Data binding concepts

- Interpolation: product names, prices, counts, and feedback.
- Property binding: product input and input state/attributes.
- Event binding: delete buttons, search input, category select, and form submit.
- Two-way binding: `[(ngModel)]` in the add-product form.
- Conditional rendering: `@if` for availability, validation, and empty state.
- List rendering: `@for` for product cards and category options.
- Signals: reactive search, category, form, and inventory state.

## Installation

From this folder:

```powershell
npm install
```

Dependencies are already installed after project setup, but `npm install` restores them when needed.

## Run the application

```powershell
npm start
```

Open `http://localhost:4200/`.

## Build

```powershell
npm run build
```

The production output is written to `dist/Day-15-Angular-Fundamentals/`.

## Unit tests

```powershell
npm test
```

The test suite uses Angular's Vitest runner and covers application creation plus ProductService retrieval, add, and delete behavior.

## Screenshots

Screenshot placeholder: add a desktop catalog screenshot here.

Screenshot placeholder: add a mobile catalog screenshot here.
