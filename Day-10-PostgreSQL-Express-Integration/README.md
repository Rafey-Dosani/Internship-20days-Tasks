# Day 10 – PostgreSQL Express Integration

An independently runnable Node.js and Express 5 task API backed by PostgreSQL.
It uses the `public.tasks` table from the Day 9 data model and keeps the Day 8
JSON response shape, including `createdAt`.

## Requirements

- Node.js 18 or newer
- PostgreSQL with the `internship_tasks_db` database and `public.tasks` table

## Database setup

Create the database if it does not already exist. Run this from the repository
root, replacing the role as appropriate:

```sh
createdb -U your_postgres_role internship_tasks_db
```

If the database and table are not yet set up, run Day 9's schema from the
repository root:

```sh
psql -U your_postgres_role -d internship_tasks_db -f Day-9-PostgreSQL-Data-Modeling/schema/create_tables.sql
```

You may load the Day 9 sample rows with:

```sh
psql -U your_postgres_role -d internship_tasks_db -f Day-9-PostgreSQL-Data-Modeling/data/seed.sql
```

If these resources already exist, do not recreate or reseed them. This project
does not modify the schema or load sample data at startup.

## Install and configure

From this project directory:

```sh
npm install
```

Copy `.env.example` to `.env`, then set `PGHOST`, `PGPORT`, `PGDATABASE`,
`PGUSER`, and `PGPASSWORD` for your PostgreSQL server. The database name
defaults to `internship_tasks_db`; credentials are read from the environment
and are not stored in source code. `.env` is ignored by git.

Start the API:

```sh
npm start
```

For development with automatic restarts:

```sh
npm run dev
```

The API listens on `http://localhost:3000` by default. Set `PORT` to change it.
Startup verifies the database connection before listening.

## API endpoints

All endpoints return JSON with a `success` field and either `data` or `error`.

| Method | Endpoint | Description | Success |
| --- | --- | --- | --- |
| GET | `/api/tasks` | List tasks | 200 |
| GET | `/api/tasks/:id` | Get a task | 200 |
| POST | `/api/tasks` | Create a task | 201 |
| PUT | `/api/tasks/:id` | Update supplied task fields | 200 |
| DELETE | `/api/tasks/:id` | Delete a task | 200 |

Task responses use `id`, `title`, `description`, `completed`, and `createdAt`.
The database's `created_at` column is aliased to `createdAt`. Titles must be
nonempty and at most 150 characters; `description` defaults to an empty string
and `completed` defaults to `false` on creation. IDs must be positive integers.

Example create request:

```http
POST /api/tasks
Content-Type: application/json
```

```json
{
  "title": "Connect the task API",
  "description": "Use parameterized PostgreSQL queries."
}
```

## Tests

Run the API tests with:

```sh
npm test
```

Tests use an in-memory fake pool injected into the app. They do not connect to,
read from, or modify `internship_tasks_db`.
