import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { createApp } from "../app.js";

const createdAt = new Date("2026-11-07T06:00:00.000Z");

class FakePool {
  constructor() {
    this.tasks = [];
    this.nextId = 1;
    this.failNextQuery = false;
  }

  async query(sql, values = []) {
    if (this.failNextQuery) {
      this.failNextQuery = false;
      throw new Error("Simulated database failure.");
    }

    if (sql.startsWith("SELECT") && !sql.includes("WHERE")) {
      return { rows: [...this.tasks] };
    }

    if (sql.startsWith("SELECT") && sql.includes("WHERE id = $1")) {
      return { rows: this.tasks.filter((task) => task.id === values[0]) };
    }

    if (sql.startsWith("INSERT")) {
      const task = {
        id: this.nextId++,
        title: values[0],
        description: values[1],
        completed: values[2],
        createdAt,
      };
      this.tasks.push(task);
      return { rows: [task] };
    }

    if (sql.startsWith("UPDATE")) {
      const setClause = sql.match(/SET\s+([\s\S]+?)\s+WHERE id/)[1];
      const assignments = setClause.split(", ");
      const id = values[assignments.length];
      const task = this.tasks.find((candidate) => candidate.id === id);
      if (!task) {
        return { rows: [] };
      }

      for (const assignment of assignments) {
        const [, column, position] = assignment.match(
          /^(title|description|completed) = \$(\d+)$/,
        );
        task[column] = values[Number(position) - 1];
      }

      return { rows: [task] };
    }

    if (sql.startsWith("DELETE")) {
      const index = this.tasks.findIndex((task) => task.id === values[0]);
      if (index === -1) {
        return { rows: [] };
      }

      return { rows: [this.tasks.splice(index, 1)[0]] };
    }

    throw new Error(`Unexpected SQL in test fake: ${sql}`);
  }
}

let server;
let baseUrl;
let databasePool;

before(async () => {
  databasePool = new FakePool();
  server = createApp({ databasePool }).listen(0);
  await new Promise((resolve, reject) => {
    server.once("listening", resolve);
    server.once("error", reject);
  });

  const address = server.address();
  baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

async function request(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, options);
  const body = await response.json();
  return { response, body };
}

function jsonBody(value) {
  return {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(value),
  };
}

test("task API supports CRUD and maps createdAt", async () => {
  const emptyList = await request("/api/tasks");
  assert.equal(emptyList.response.status, 200);
  assert.deepEqual(emptyList.body, { success: true, data: [] });

  const created = await request(
    "/api/tasks",
    { method: "POST", ...jsonBody({ title: "  Write tests  " }) },
  );
  assert.equal(created.response.status, 201);
  assert.deepEqual(created.body.data, {
    id: 1,
    title: "Write tests",
    description: "",
    completed: false,
    createdAt: createdAt.toISOString(),
  });

  const listed = await request("/api/tasks/");
  assert.equal(listed.response.status, 200);
  assert.deepEqual(listed.body.data, [created.body.data]);

  const fetched = await request("/api/tasks/1");
  assert.equal(fetched.response.status, 200);
  assert.deepEqual(fetched.body.data, created.body.data);

  const updated = await request(
    "/api/tasks/1",
    { method: "PUT", ...jsonBody({ completed: true }) },
  );
  assert.equal(updated.response.status, 200);
  assert.equal(updated.body.data.completed, true);

  const deleted = await request("/api/tasks/1", { method: "DELETE" });
  assert.equal(deleted.response.status, 200);
  assert.equal(deleted.body.data.task.id, 1);
});

test("validation rejects bad IDs and task fields", async () => {
  const cases = [
    ["GET", "/api/tasks/0", undefined],
    ["GET", "/api/tasks/not-an-id", undefined],
    ["POST", "/api/tasks", {}],
    ["POST", "/api/tasks", { title: "   " }],
    ["POST", "/api/tasks", { title: "x".repeat(151) }],
    ["POST", "/api/tasks", { title: "Valid", completed: "yes" }],
    ["POST", "/api/tasks", { title: "Valid", description: 5 }],
    ["PUT", "/api/tasks/1", { completed: "yes" }],
    ["PUT", "/api/tasks/1", {}],
  ];

  for (const [method, path, body] of cases) {
    const options = { method };
    if (body !== undefined) {
      Object.assign(options, jsonBody(body));
    }
    const result = await request(path, options);
    assert.equal(result.response.status, 400, `${method} ${path}`);
    assert.equal(result.body.success, false);
  }

  const maximumLengthTitle = await request(
    "/api/tasks",
    { method: "POST", ...jsonBody({ title: "😀".repeat(150) }) },
  );
  assert.equal(maximumLengthTitle.response.status, 201);
});

test("missing records and routes return consistent 404 responses", async () => {
  for (const [path, options] of [
    ["/api/tasks/999", {}],
    ["/api/tasks/999", { method: "PUT", ...jsonBody({ title: "Missing" }) }],
    ["/api/tasks/999", { method: "DELETE" }],
    ["/unknown", {}],
  ]) {
    const result = await request(path, options);
    assert.equal(result.response.status, 404);
    assert.equal(result.body.success, false);
    assert.ok(result.body.error.message);
  }
});

test("malformed JSON and database errors use centralized error responses", async () => {
  const malformedJson = await fetch(`${baseUrl}/api/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: '{"title":',
  });
  assert.equal(malformedJson.status, 400);
  assert.deepEqual(await malformedJson.json(), {
    success: false,
    error: { message: "Request body contains invalid JSON." },
  });

  databasePool.failNextQuery = true;
  const originalError = console.error;
  console.error = () => {};
  try {
    const failedQuery = await request("/api/tasks");
    assert.equal(failedQuery.response.status, 500);
    assert.deepEqual(failedQuery.body, {
      success: false,
      error: { message: "An unexpected error occurred." },
    });
  } finally {
    console.error = originalError;
  }
});
