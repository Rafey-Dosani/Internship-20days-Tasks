# API response samples

Examples assume the application is running locally and a category with ID `1` exists.

## Create a product

Request:

```http
POST /api/products
Accept: application/json
Content-Type: application/json
```

```json
{
  "category_id": 1,
  "name": "Desk Lamp",
  "description": "Adjustable reading lamp.",
  "price": "24.50"
}
```

Response: **201 Created**

```json
{
  "data": {
    "id": 1,
    "category_id": 1,
    "name": "Desk Lamp",
    "description": "Adjustable reading lamp.",
    "price": "24.50",
    "category": {
      "id": 1,
      "name": "Electronics",
      "description": "Everyday devices and accessories."
    },
    "created_at": "2026-11-20T06:00:00.000000Z",
    "updated_at": "2026-11-20T06:00:00.000000Z"
  }
}
```

## Validation error

Request with a category ID that does not exist:

```http
POST /api/products
Accept: application/json
Content-Type: application/json
```

```json
{
  "category_id": 9999,
  "name": "Desk Lamp",
  "description": null,
  "price": "24.50"
}
```

Response: **422 Unprocessable Content**

```json
{
  "message": "The selected category id is invalid.",
  "errors": {
    "category_id": [
      "The selected category id is invalid."
    ]
  }
}
```

## Paginated products

`GET /api/products?per_page=5&page=2` returns a `data` array along with Laravel's navigation `links` and pagination `meta` (including `current_page`, `per_page`, `total`, and `last_page`).
