# Day 15 Notes: Angular Fundamentals

## Components

Components combine a TypeScript class, an HTML template, and CSS. This project uses standalone components, so each component declares its own imports. The three main UI areas are the application shell, shared header, product card, and Products feature page.

## Templates and bindings

Interpolation displays TypeScript values in the template. Property binding passes values into components and HTML properties. Event binding responds to clicks and form controls. `[(ngModel)]` combines property and event binding to keep form fields synchronized with component state.

## Modern template control flow

The catalog uses `@for` to render product cards and category options. It uses `@if` and `@else` for stock status, validation messages, feedback, and the empty state. This is easier to read than older structural directives.

## Services and dependency injection

`ProductService` owns the product data. Components do not maintain a separate copy of the catalog. The Products page injects the service and calls its methods. `providedIn: 'root'` creates one application-wide service instance.

## Signals

Signals hold reactive values such as search text and category selection. `computed()` derives values such as filtered products and inventory counts. When a signal changes, Angular updates the parts of the template that depend on it.

## Angular CLI

Angular CLI created the standalone project and generated components and the service. Its build and test commands compile and verify the application. The project structure separates models, services, reusable components, and feature pages.

## Mentor review checklist

- Standalone architecture is used.
- Components have clear responsibilities.
- Inputs and outputs pass data and events between components.
- Product data is managed by an injectable service.
- Search and category filtering work together.
- Add and delete operations update the catalog.
- Validation gives clear feedback.
- Empty and stock states are visible.
- No backend or external API is used.
