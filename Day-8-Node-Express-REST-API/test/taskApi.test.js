import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import app from "../app.js";

let server;
let baseUrl;

before(async () => {
  server = app.listen(0);
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

test("task API supports CRUD and returns consistent validation errors", async () => {
  const emptyList = await request("/api/tasks");
  assert.equal(emptyList.response.status, 200);
  assert.deepEqual(emptyList.body, { success: true, data: [] });

  const missingTitle = await request("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ description: "No title" }),
  });
  assert.equal(missingTitle.response.status, 400);
  assert.equal(missingTitle.body.success, false);
  assert.equal(missingTitle.body.error.message, "Title is required.");

  const invalidTitle = await request("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "   " }),
  });
  assert.equal(invalidTitle.response.status, 400);

  const created = await request("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "  Write tests  ", description: "CRUD" }),
  });
  assert.equal(created.response.status, 201);
  assert.deepEqual(created.body.data, {
    id: 1,
    title: "Write tests",
    description: "CRUD",
    completed: false,
    createdAt: created.body.data.createdAt,
  });
  assert.ok(Number.isNaN(Date.parse(created.body.data.createdAt)) === false);

  const listed = await request("/api/tasks");
  assert.equal(listed.response.status, 200);
  assert.equal(listed.body.data.length, 1);
  assert.equal(listed.body.data[0].id, created.body.data.id);

  const fetched = await request("/api/tasks/1");
  assert.equal(fetched.response.status, 200);
  assert.deepEqual(fetched.body.data, created.body.data);

  const updated = await request("/api/tasks/1", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed: true }),
  });
  assert.equal(updated.response.status, 200);
  assert.equal(updated.body.data.completed, true);
  assert.equal(updated.body.data.title, "Write tests");

  const invalidId = await request("/api/tasks/not-a-number");
  assert.equal(invalidId.response.status, 400);
  assert.equal(invalidId.body.success, false);

  const absentTask = await request("/api/tasks/999");
  assert.equal(absentTask.response.status, 404);
  assert.equal(absentTask.body.success, false);

  const missingUpdate = await request("/api/tasks/999", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "Missing" }),
  });
  assert.equal(missingUpdate.response.status, 404);

  const badUpdate = await request("/api/tasks/1", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed: "yes" }),
  });
  assert.equal(badUpdate.response.status, 400);

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

  const missingDelete = await request("/api/tasks/999", { method: "DELETE" });
  assert.equal(missingDelete.response.status, 404);

  const deleted = await request("/api/tasks/1", { method: "DELETE" });
  assert.equal(deleted.response.status, 200);
  assert.equal(deleted.body.data.task.id, 1);

  const missingRoute = await request("/unknown");
  assert.equal(missingRoute.response.status, 404);
  assert.equal(missingRoute.body.success, false);
});
