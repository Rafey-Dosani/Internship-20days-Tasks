# Day 17 Notes - Angular Quality and Routing

## Concepts implemented

- Standalone Angular 21 components and provider-based application configuration.
- Angular Router routes for the product list and parameterized product details.
- `ActivatedRoute.paramMap` for reacting to the selected product ID, including changes while the detail route remains active.
- A typed `HttpClient` service that unwraps the Laravel JSON resource envelope.
- Signal-backed list and detail state so asynchronous HTTP updates render correctly with Angular 21's zoneless change detection.
- Runtime validation of the Laravel resource envelope and product fields; invalid or empty responses leave the loading state and show an error.
- Semantic page sections, descriptive links, visible focus states, reduced-motion handling, and `role="status"`/`role="alert"` feedback.
- Isolated component, routing, and service responsibilities.

## Route structure

- `/` redirects to `/products`.
- `/products` displays the API-backed product list.
- `/products/:id` fetches and displays one product.
- Unknown paths redirect to `/products`.

The product detail includes the product name, price, category, category description when available, description, category ID, and Laravel timestamps when present.

## Guard explanation

`validProductIdGuard` accepts positive, safe integer IDs and redirects malformed IDs to `/products` with an `invalidId` query parameter. The list uses that parameter to provide feedback. This is deliberately a UI navigation aid: users can bypass client-side checks, so it must not be used as a substitute for authorization or validation in Laravel.

## Testing approach

- `HttpTestingController` verifies the exact collection and detail GET requests and resource response shapes.
- Angular component tests check list content, empty/error/retry feedback, parameter-driven detail requests, invalid IDs, and missing records.
- `RouterTestingHarness` exercises actual routing, invalid-ID guard redirects, and the list-to-detail link interaction.
- The suite uses Angular's unit-test builder with Vitest and does not depend on a running API.

Run all tests with `npm test -- --watch=false`; produce an optimized bundle with `npm run build`.

## Screenshots to capture

1. Product list populated with category and price visible.
2. Product detail page, including its return-to-list link.
3. Empty or failed product-list state.
4. Invalid product URL redirected to the list with its explanatory status.
