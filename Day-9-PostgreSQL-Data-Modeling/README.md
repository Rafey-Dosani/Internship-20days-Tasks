# Day 9 – PostgreSQL & Data Modeling

This project defines a PostgreSQL schema for the task resource in the Day 8
Express REST API. It includes the table definition, example seed data, practical
queries, and design notes. The SQL files have not been executed as part of this
documentation.

## Requirements

- PostgreSQL 18 (or a compatible PostgreSQL release)
- `psql` command-line client available on your `PATH`

Check the client installation:

```sh
psql --version
```

## Create the database

From this project directory, create the database once:

```sh
createdb -U postgres internship_tasks_db
```

Replace `postgres` with your PostgreSQL role if needed. Alternatively, create
`internship_tasks_db` using `CREATE DATABASE internship_tasks_db;` while
connected to a different database. PostgreSQL does not allow `CREATE DATABASE`
inside a transaction.

## Create the table and load sample tasks

Run these commands from `Day-9-PostgreSQL-Data-Modeling`:

```sh
psql -U postgres -d internship_tasks_db -f schema/create_tables.sql
psql -U postgres -d internship_tasks_db -f data/seed.sql
```

The schema file creates `public.tasks`. The seed file inserts eight realistic
tasks without manually setting their identity IDs. Run the schema before the
seed. The seed is intended to be loaded once; rerunning it adds another set of
sample rows.

To open an interactive session:

```sh
psql -U postgres -d internship_tasks_db
```

## Explore queries

Run the examples from the project directory:

```sh
psql -U postgres -d internship_tasks_db -f queries/task_queries.sql
```

The query file contains read and write examples, transactions, and index
inspection. It is an executable collection of examples, not a read-only script:
it inserts, updates, and deletes sample task rows. Review it before running
against data you need to preserve.

For database design, constraints, normalization, ACID, indexes, timestamp
handling, and Day 8 API field mapping, see
[docs/database-design.md](docs/database-design.md).