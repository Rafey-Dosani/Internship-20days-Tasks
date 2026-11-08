# Day 11 – Authentication and Authorization

An independently runnable Node.js and Express 5 API with PostgreSQL-backed
accounts, bcrypt password hashing, JWT authentication, and user/admin roles.

## Requirements

- Node.js 18 or newer
- PostgreSQL

## Install and configure

From this project directory, install dependencies and create a local environment
file:

```sh
npm install
Copy-Item .env.example .env
```

In `.env`, set the PostgreSQL connection values and replace `JWT_SECRET` with a
private random value at least 32 characters long. For example, generate one
with Node.js:

```sh
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Never commit `.env` or share its contents. `.env.example` contains placeholders
only.

## Database setup

Create the database if it does not exist:

```sh
createdb -U your_postgres_role internship_auth_db
```

Apply the schema from the repository root (or use the equivalent absolute
path):

```sh
psql -U your_postgres_role -d internship_auth_db -f Day-11-Authentication-Authorization/database/schema.sql
```

The schema creates `public.users` with a case-insensitive unique email index.
Registration always creates a `user`; assign the `admin` role only through a
trusted database administrator, never through the public registration API.

## Run the API

From this project directory:

```sh
npm start
```

For development with automatic restarts:

```sh
npm run dev
```

The API listens at `http://localhost:3000` by default. Set `PORT` to change it.
Startup checks the PostgreSQL connection before listening.

## API endpoints

Responses use `{ "success": true, "data": ... }` on success and a consistent
`{ "success": false, "error": { "message": ... } }` shape on errors.

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Public | Create a user account |
| POST | `/api/auth/login` | Public | Verify credentials and receive a JWT |
| GET | `/api/auth/me` | Authenticated | Return the current user |
| GET | `/api/users` | Admin | List users without password hashes |
| GET | `/api/user/dashboard` | Authenticated | Access the user dashboard |
| GET | `/api/admin/dashboard` | Admin | Access the admin dashboard |

Registration requires `name`, `email`, and a password of 8–72 UTF-8 bytes.
Registration does not accept a role. Login failures return the same generic
message for unknown emails and incorrect passwords.

## Authentication flow

1. Register with a name, email, and password. Passwords are hashed with bcrypt
   before they are inserted into PostgreSQL.
2. Log in with the same email and password. A one-hour JWT is returned on
   successful login.
3. Send the token as `Authorization: Bearer <token>` to protected endpoints.
   The middleware verifies the signature and expiry, then loads the current
   user from the database so deleted or changed accounts do not retain stale
   access.
4. Admin routes require the current database role to be `admin`; only trusted
   database operators should grant this role.

Example requests:

```sh
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Ada User\",\"email\":\"ada@example.com\",\"password\":\"sample-password-123\"}"

curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"ada@example.com\",\"password\":\"sample-password-123\"}"

curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT"
```

## Tests

Run the automated API tests from this directory:

```sh
npm test
```

Tests use an injected in-memory PostgreSQL-pool fake and real bcrypt/JWT
operations; they do not require or modify a PostgreSQL database.
