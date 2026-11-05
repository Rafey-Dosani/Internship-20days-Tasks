# Task Management REST API

A beginner-friendly REST API built with Node.js and Express. It stores tasks in
memory, so task data is reset whenever the server restarts.

## Folder structure

```text
Day-8-Node-Express-REST-API/
├── app.js
├── server.js
├── package.json
├── routes/
│   └── taskRoutes.js
├── controllers/
│   └── taskController.js
├── services/
│   └── taskService.js
├── middleware/
│   ├── errorHandler.js
│   ├── notFound.js
│   └── requestLogger.js
└── test/
    └── taskApi.test.js
```

## Installation and start

Requires Node.js 18 or newer.

```bash
npm install
npm start
```

The API listens on `http://localhost:3000` by default. Set the `PORT`
environment variable to use another port. During development, run
`npm run dev` to restart the server when files change.

Run automated API tests with:

```bash
npm test
```

## API endpoints

All endpoints use the `/api/tasks` base path and return JSON.

| Method | Endpoint | Description | Success |
|---|---|---|---|
| GET | `/api/tasks` | Get all tasks | 200 |
| GET | `/api/tasks/:id` | Get a task by ID | 200 |
| POST | `/api/tasks` | Create a task | 201 |
| PUT | `/api/tasks/:id` | Update a task | 200 |
| DELETE | `/api/tasks/:id` | Delete a task | 200 |

Task IDs are positive integers. A task has the following shape:

```json
{
  "id": 1,
  "title": "Write documentation",
  "description": "Document the task API",
  "completed": false,
  "createdAt": "2026-11-05T03:50:00.000Z"
}
```

### Create a task

Send a non-empty `title`. `description` defaults to an empty string and
`completed` defaults to `false`.

```http
POST /api/tasks
Content-Type: application/json
```

```json
{
  "title": "Write documentation",
  "description": "Document the task API"
}
```

Response (`201 Created`):

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Write documentation",
    "description": "Document the task API",
    "completed": false,
    "createdAt": "2026-11-05T03:50:00.000Z"
  }
}
```

### Update a task

Send one or more of `title`, `description`, and `completed`. Unspecified
fields keep their current values.

```http
PUT /api/tasks/1
Content-Type: application/json
```

```json
{
  "completed": true
}
```

### Error response

Errors use the same JSON shape. For example, an invalid title returns
`400 Bad Request`:

```json
{
  "success": false,
  "error": {
    "message": "Title must be a non-empty string."
  }
}
```

## HTTP status codes

| Code | Meaning |
|---|---|
| 200 | Request succeeded |
| 201 | Task created |
| 400 | Invalid ID, input, or malformed JSON |
| 404 | Task or route not found |
| 500 | Unexpected internal server error |

## Architecture and middleware

- `server.js` starts the HTTP server; `app.js` configures Express.
- `routes/` maps HTTP methods and paths to controller functions.
- `controllers/` validates requests, chooses HTTP status codes, and formats
  responses.
- `services/` owns task CRUD operations and the in-memory array.
- `requestLogger` logs each request after its response finishes.
- `express.json()` parses JSON request bodies.
- `notFound` returns a consistent JSON response for unknown routes.
- `errorHandler` handles malformed JSON and unexpected errors centrally.
