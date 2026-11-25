# Day 16 - Angular Forms and HTTP

A standalone Angular 21 application for creating products through the Day 14 Laravel API. It demonstrates reactive forms, typed HttpClient services, RxJS state handling, validation, loading feedback, success feedback, and backend error handling.

## Technologies

- Angular 21 standalone components
- TypeScript 5.9
- Angular Reactive Forms
- Angular HttpClient
- RxJS 7
- Vitest and Angular HTTP testing utilities

## Features

- Reactive product form with touched-field validation
- Category selection loaded from Laravel
- Required, length, numeric, decimal, and range validation
- Typed product, category, request, and response models
- Loading indicator and duplicate-submit protection
- Backend `422` field-error display
- Network-error feedback and retryable submission
- Success message and form reset
- Responsive, accessible layout

## Project structure

```text
src/
  app/
    components/product-form/
      product-form.ts
      product-form.html
      product-form.css
      product-form.spec.ts
    models/product.model.ts
    services/
      product.ts
      product.spec.ts
    app.ts
    app.html
  environments/
    environment.ts
    environment.production.ts
DAY16_NOTES.md
```

## Install and run

```powershell
cd "Day-16-Angular-Forms-and-HTTP"
npm install
npm start
```

Open `http://localhost:4200`.

## API configuration

The base URL is configured only in the environment files:

- `src/environments/environment.ts`
- `src/environments/environment.production.ts`

Development default:

```ts
apiBaseUrl: 'http://127.0.0.1:8000/api'
```

Change that value if Laravel runs on another host or port. Do not add API URLs directly to components or services.

## Connect the Day 14 Laravel API

From the existing Day 14 project:

```powershell
cd "..\Day-14-Laravel-Eloquent-Relationships"
composer install
Copy-Item .env.example .env
php artisan key:generate
New-Item -ItemType File -Force database/database.sqlite
php artisan migrate
php artisan db:seed
php artisan serve
```

Laravel will normally listen at `http://127.0.0.1:8000`. Start it before submitting the Angular form.

If Angular is served from a different origin and Laravel reports CORS errors, allow `http://localhost:4200` in the Laravel CORS configuration or Laravel 13's allowed origins setting. Keep the Day 14 project unchanged unless you are configuring its local development environment.

## API contract

### Category retrieval

`GET /api/categories`

Response:

```json
{
  "data": [
    { "id": 1, "name": "Electronics" }
  ]
}
```

### Product creation

`POST /api/products`

Request:

```json
{
  "category_id": 1,
  "name": "Desk Lamp",
  "description": "Adjustable reading lamp.",
  "price": "24.50"
}
```

Success response (`201`):

```json
{
  "data": {
    "id": 1,
    "category_id": 1,
    "name": "Desk Lamp",
    "description": "Adjustable reading lamp.",
    "price": "24.50"
  }
}
```

Validation response (`422`):

```json
{
  "message": "The category_id field is invalid.",
  "errors": {
    "category_id": ["The selected category_id is invalid."]
  }
}
```

Laravel constraints: `category_id` required and existing; `name` required with a maximum of 255 characters; `description` optional with a maximum of 2000 characters; `price` required, numeric, at most two decimal places, at least zero, and at most `99999999.99`. The backend has no quantity field, so no quantity is sent.

## Example workflow

1. Start Laravel and seed categories.
2. Start Angular.
3. Select a category.
4. Enter a name, optional description, and valid price.
5. Submit the form.
6. The UI displays loading while the POST is pending.
7. HTTP `201` resets the form and shows success.
8. HTTP `422` shows the backend's field errors.
9. An unavailable API shows a network error and allows retry.

## Tests

```powershell
npm test -- --watch=false
```

The HTTP tests use `HttpTestingController` and do not require a running Laravel server.

## Production build

```powershell
npm run build
```
