# Day 14 - Laravel Eloquent and Validation

A standalone Laravel API exercise demonstrating a Category–Product one-to-many relationship, Form Request validation, resource responses, pagination, factories, seeders, and feature tests.

## Requirements

- PHP 8.3 or later with PDO SQLite enabled
- Composer

The project uses Laravel 13 and SQLite. No frontend or API authentication setup is required.

## Setup

From this directory:

```powershell
Remove-Item Env:COMPOSER -ErrorAction SilentlyContinue
composer install
Copy-Item .env.example .env
php artisan key:generate
New-Item -ItemType File -Force database/database.sqlite
```

Set `DB_CONNECTION=sqlite` in `.env` (the example already selects SQLite). Then create the schema and sample data:

```powershell
php artisan migrate
php artisan db:seed
```

To run the API locally:

```powershell
php artisan serve
```

Run the feature and unit test suites with:

```powershell
php artisan test
```

Tests use an in-memory SQLite database and do not require the seeded local database.

## API endpoints

All endpoints are under `/api` and return JSON.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/categories` | List categories with product counts |
| `GET` | `/api/categories/{id}` | Get a category and its products |
| `GET` | `/api/products` | Paginated products with their categories |
| `GET` | `/api/products/{id}` | Get a product with its category |
| `POST` | `/api/products` | Create a product |
| `PUT` | `/api/products/{id}` | Replace a product |
| `PATCH` | `/api/products/{id}` | Partially update a product |
| `DELETE` | `/api/products/{id}` | Delete a product (204 response) |

Product creation and replacement require `category_id`, `name`, and `price`; partial updates validate only the supplied fields. The optional `description` may be a string or `null`. Prices must be non-negative and have at most two decimal places. A category ID that does not exist returns a JSON validation response with HTTP `422`; missing resources return `404`.

Product listings accept `per_page` and `page` query parameters. `per_page` defaults to 15 and is capped at 100. Paginated responses include Laravel's `links` and `meta` fields.

Example create request:

```json
{
  "category_id": 1,
  "name": "Desk Lamp",
  "description": "Adjustable reading lamp.",
  "price": "24.50"
}
```

See [docs/api-samples.md](docs/api-samples.md) for successful and validation-error JSON samples, and [docs/relationship-diagram.md](docs/relationship-diagram.md) for the ER diagram.
