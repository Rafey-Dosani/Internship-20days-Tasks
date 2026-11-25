# Day 17 - Angular Quality and Routing

A standalone Angular 21 product catalog that adds routed list/detail views to the Day 14 Laravel API. It follows the Angular and typed-resource conventions used in Day 16.

## Requirements

- Node.js compatible with Angular 21
- npm
- The Day 14 Laravel API for live product data

## Install and run

```powershell
cd "Day-17-Angular-Quality-and-Routing"
npm install
npm start
```

Open `http://localhost:4200`.

The API base URL is configured in `src/environments/environment.ts` and `src/environments/environment.production.ts`. The default is `http://127.0.0.1:8000/api`, matching Day 16. Start the Day 14 Laravel API separately; configure its local CORS policy to allow `http://localhost:4200` if the browser blocks cross-origin requests.

## Routes

| Route | Behavior |
| --- | --- |
| `/` | Redirects to `/products` |
| `/products` | Loads and displays the product collection |
| `/products/:id` | Loads a single product by its numeric ID |
| Other paths | Redirect to `/products` |

The detail route checks only that the ID has a valid positive-integer format. This functional guard is a navigation aid, not authorization or backend security. Laravel remains responsible for API access control.

## API contract

The app uses only the existing Day 14 endpoints:

- `GET /api/products` returns a Laravel paginated resource with products in its `data` array.
- `GET /api/products/{product}` returns one product in its `data` property.

Each product includes `id`, `category_id`, `name`, `description`, `price`, the loaded `category`, and `created_at`/`updated_at` timestamps. The app unwraps the resource `data` property and displays the available fields.

## Tests and production build

```powershell
npm test -- --watch=false
npm run build
```

The tests cover resource HTTP requests, list/loading/empty/error behavior, detail route parameters and failures, valid/invalid guard navigation, and following a product's details link. HTTP requests are mocked; a running Laravel server is not required for tests.
