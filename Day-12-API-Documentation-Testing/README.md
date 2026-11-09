# Day 12 - API Documentation and Testing

An independent Node.js/Express API that reproduces Day 11's PostgreSQL account
registration, bcrypt password hashing, JWT authentication, user/admin roles,
and dashboard endpoints. It adds interactive OpenAPI documentation and
database-level pagination for the existing admin-only user listing.

## Learning objectives

- Describe real API operations and schemas with OpenAPI 3.
- Exercise bearer JWT authentication from Swagger UI.
- Test authentication, role authorization, validation, errors, and pagination.
- Return stable pagination metadata while querying records in PostgreSQL.

## Technologies

- Node.js 18+, Express 5, and ES modules
- PostgreSQL with `pg`
- `bcrypt` for password hashing and `jsonwebtoken` for JWTs
- `swagger-ui-express` for interactive API documentation
- Node's built-in `node:test` and `fetch` for API tests

## Features

- Registration and login, with the same validation, role assignment, and
  password/JWT behavior as the Day 11 API.
- Protected current-user and user/admin dashboard routes.
- Admin-only user listing with `page` and `limit` database pagination.
- OpenAPI JSON and an interactive Swagger UI with a JWT **Authorize** control.
- Consistent JSON errors and isolated HTTP API tests using a test-only pool fake.

## Project structure

```text
.
├── app.js
├── server.js
├── config/
│   └── database.js
├── controllers/
│   ├── authController.js
│   └── userController.js
├── database/
│   └── schema.sql
├── docs/
│   └── openapi.json
├── middleware/
│   ├── authenticate.js
│   ├── errorHandler.js
│   ├── notFound.js
│   └── requireRole.js
├── services/
│   └── authService.js
├── test/
│   └── authApi.test.js
└── utils/
    └── httpError.js
```

## Requirements and installation

Install Node.js 18 or newer and PostgreSQL. From this project folder:

```sh
npm install
```

Create a local environment file:

```powershell
Copy-Item .env.example .env
```

Set the PostgreSQL connection values in `.env`. Replace `JWT_SECRET` with a
private random value at least 32 characters long. Generate one with:

```sh
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Do not commit `.env` or use real credentials in `.env.example`.

## Database setup

Create the configured database and apply the schema from the repository root
(change the role or database name to match `.env`):

```sh
createdb -U your_postgres_role internship_auth_db
psql -U your_postgres_role -d internship_auth_db -f Day-12-API-Documentation-Testing/database/schema.sql
```

The schema creates `public.users` and a case-insensitive unique email index.
Registration only creates `user` accounts. A trusted database administrator
must grant the `admin` role; the public API never accepts role changes.

## Start the application

From the Day 12 folder:

```sh
npm start
```

For development restarts:

```sh
npm run dev
```

The server checks database connectivity before listening. The default API
address is `http://localhost:3000`; set `PORT` to change it.

## Swagger UI and JWT authorization

Open [http://localhost:3000/api-docs](http://localhost:3000/api-docs). The
machine-readable specification is at `http://localhost:3000/api-docs.json`.

1. Use `POST /api/auth/register` to create an account.
2. Use `POST /api/auth/login` with that account's email and password.
3. Copy the `data.token` value from the successful response.
4. Click **Authorize** in Swagger UI and paste the token (without adding the
   `Bearer ` prefix; the HTTP bearer scheme adds it).
5. Execute `GET /api/auth/me` or `GET /api/user/dashboard`. Swagger sends the
   `Authorization: Bearer <token>` header.
6. Without a valid token protected endpoints return `401`. A user-role token
   receives `403` on the admin dashboard and user list. An admin token is
   required for those routes.

Never put a real token or secret in source control or shared documentation.

## API endpoint summary

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Public | Create a user account |
| POST | `/api/auth/login` | Public | Verify credentials and receive a JWT |
| GET | `/api/auth/me` | Authenticated | Return the current user |
| GET | `/api/user/dashboard` | Authenticated | Return the user dashboard |
| GET | `/api/admin/dashboard` | Admin | Return the admin dashboard |
| GET | `/api/users` | Admin | List users with pagination |

Successful responses use `{ "success": true, "data": ... }`; list responses
also include `pagination`. Errors use
`{ "success": false, "error": { "message": "..." } }`.
Registration returns `201`; login and protected reads return `200`.
Validation errors return `400`, invalid credentials/tokens `401`, role
restrictions `403`, unknown routes `404`, and duplicate registration `409`.

The API has no path-parameter resource endpoints, so ID validation is not
applicable to the implemented routes. The `404` response is exercised for
unknown routes.

## Pagination

`GET /api/users` accepts:

- `page`: one-based page number; default `1`
- `limit`: records per page; default `10`, range `1`–`100`

Both parameters must be positive integer strings; unknown query parameters are
rejected. For example, an admin can request:

```text
GET /api/users?page=2&limit=5
```

The response contains the records in `data` and metadata such as:

```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 2,
    "limit": 5,
    "totalRecords": 23,
    "totalPages": 5
  }
}
```

Out-of-range pages return an empty array while preserving the total count.
When the database contains no users, `totalPages` is `0`.

## Automated tests

Run all API tests:

```sh
npm test
```

Tests use a dedicated in-memory pool fake and real bcrypt/JWT operations; they
do not connect to or alter a development database. Coverage includes
registration/login, role restrictions, missing/invalid/expired JWTs,
validation, malformed JSON, unknown routes, Swagger assets/spec, default and
custom pagination, invalid query values, and empty pages. The test runner
prints the actual pass/fail results. Tests do not require a separate build or
type-check command because the project is plain JavaScript.
