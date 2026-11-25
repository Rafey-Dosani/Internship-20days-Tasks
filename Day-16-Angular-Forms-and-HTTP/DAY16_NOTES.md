# Day 16 Notes

## Reactive Forms

The form is created with `FormGroup` and `FormControl` in `product-form.ts`. A `FormControl` owns one input's value and validation state. The `FormGroup` owns the complete product form and exposes `valid`, `invalid`, `touched`, `pristine`, and submitted values.

`ReactiveFormsModule` connects controls in `product-form.html` to inputs through `formControlName`.

## Validators

Built-in validators enforce requirements and lengths:

- `required` for category, name, and price
- `minLength(2)` and `maxLength(255)` for name
- `maxLength(2000)` for description

A custom `positiveMoney` validator checks that price is numeric, non-negative, has no more than two decimal places, and does not exceed Laravel's maximum.

Validation messages are shown once a control is touched or dirty, or after `submit()` calls `markAllAsTouched()`. `submit()` returns without sending the HTTP request when the form is invalid.

## HttpClient

`ProductService` is the only class that constructs API URLs or calls `HttpClient`. It sends typed requests and maps Laravel resource envelopes:

- `GET /api/categories` returns `ApiDataResponse<Category[]>`
- `POST /api/products` returns `ApiDataResponse<Product>`

The API base URL is centralized in `src/environments/environment.ts` and production environment configuration. Component code never contains an API endpoint.

## Typed responses

Interfaces in `product.model.ts` describe category, product, create-payload, and Laravel `data` envelope shapes. TypeScript catches mismatched payload properties and makes HTTP response handling explicit.

## RxJS

Each HTTP call returns an `Observable`. `map()` unwraps Laravel's `data` envelope. `takeUntilDestroyed()` unsubscribes on component destruction. `finalize()` always resets `isLoading`, including success and error paths. There are no nested HTTP subscriptions.

## Loading, success, and error state

- `isLoading` prevents duplicate submission and disables the submit button.
- A successful POST clears loading through `finalize()`, resets the form, and shows a success message.
- An HTTP `422` extracts `error.error.errors` and displays server field messages.
- HTTP `0` is treated as an unavailable API/network issue.
- Other HTTP failures show a retryable generic API error.
- Category loading has a separate loading status and also handles API failure.
