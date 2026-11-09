import assert from "node:assert/strict";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { after, before, test } from "node:test";
import { createApp } from "../app.js";

const jwtSecret = "test-secret-with-more-than-thirty-two-characters";
const createdAt = new Date("2026-11-08T00:00:00.000Z");

class FakePool {
  constructor(users) {
    this.users = users;
    this.nextId = Math.max(0, ...users.map((user) => Number(user.id))) + 1;
  }

  async query(sql, values = []) {
    if (sql.includes("WHERE LOWER(email) = $1")) {
      const user = this.users.find(
        (candidate) => candidate.email.toLowerCase() === values[0],
      );
      if (sql.startsWith("SELECT id FROM public.users")) {
        return { rows: user ? [{ id: user.id }] : [] };
      }
      return { rows: user ? [{ ...user }] : [] };
    }

    if (sql.startsWith("INSERT INTO public.users")) {
      if (this.users.some((user) => user.email === values[1])) {
        const error = new Error("Duplicate email.");
        error.code = "23505";
        throw error;
      }

      const user = {
        id: this.nextId++,
        name: values[0],
        email: values[1],
        password_hash: values[2],
        role: "user",
        createdAt,
      };
      this.users.push(user);
      return { rows: [this.publicUser(user)] };
    }

    if (sql.includes("WHERE id = $1")) {
      const user = this.users.find(
        (candidate) => String(candidate.id) === String(values[0]),
      );
      return { rows: user ? [this.publicUser(user)] : [] };
    }

    if (sql.includes("ORDER BY id LIMIT $1 OFFSET $2")) {
      const [limit, offset] = values;
      return {
        rows: this.users
          .slice()
          .sort((a, b) => Number(a.id) - Number(b.id))
          .slice(offset, offset + limit)
          .map((user) => this.publicUser(user)),
      };
    }

    if (sql.startsWith("SELECT COUNT(*)")) {
      return { rows: [{ total: this.users.length }] };
    }

    throw new Error(`Unexpected SQL in test fake: ${sql}`);
  }

  publicUser(user) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  }
}

let server;
let baseUrl;
let databasePool;
let userToken;
let adminToken;

before(async () => {
  const passwordHash = await bcrypt.hash("admin-password-123", 4);
  const seededUsers = Array.from({ length: 12 }, (_, index) => ({
    id: index + 1,
    name: index === 0 ? "Admin" : `User ${index + 1}`,
    email: index === 0 ? "admin@example.com" : `user${index + 1}@example.com`,
    password_hash: index === 0 ? passwordHash : "unused-test-hash",
    role: index === 0 ? "admin" : "user",
    createdAt,
  }));
  databasePool = new FakePool(seededUsers);
  server = createApp({ databasePool, jwtSecret }).listen(0);
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

function bearer(token) {
  return { headers: { Authorization: `Bearer ${token}` } };
}

test("registration validates input, hashes passwords, and omits hashes", async () => {
  for (const body of [
    {},
    { name: "New User", email: "not-an-email", password: "long-password-123" },
    { name: "New User", email: "new@example.com", password: "short" },
    {
      name: "New User",
      email: "new@example.com",
      password: "user-password-123",
      role: "admin",
    },
    ["not", "an", "object"],
  ]) {
    const invalid = await request("/api/auth/register", {
      method: "POST",
      ...jsonBody(body),
    });
    assert.equal(invalid.response.status, 400);
    assert.equal(invalid.body.success, false);
    assert.equal(typeof invalid.body.error.message, "string");
  }

  const registered = await request("/api/auth/register", {
    method: "POST",
    ...jsonBody({
      name: "  New User  ",
      email: "NEW@example.com",
      password: "user-password-123",
    }),
  });
  assert.equal(registered.response.status, 201);
  assert.equal(registered.body.data.name, "New User");
  assert.equal(registered.body.data.email, "new@example.com");
  assert.equal(registered.body.data.role, "user");
  assert.equal(Object.hasOwn(registered.body.data, "password_hash"), false);
  assert.equal(
    await bcrypt.compare(
      "user-password-123",
      databasePool.users.find((user) => user.email === "new@example.com")
        .password_hash,
    ),
    true,
  );

  const duplicate = await request("/api/auth/register", {
    method: "POST",
    ...jsonBody({
      name: "Another Name",
      email: "new@example.com",
      password: "user-password-123",
    }),
  });
  assert.equal(duplicate.response.status, 409);
});

test("login returns a JWT only for valid credentials", async () => {
  const invalidBody = await request("/api/auth/login", {
    method: "POST",
    ...jsonBody({ email: "bad-email", password: "wrong-password" }),
  });
  assert.equal(invalidBody.response.status, 400);

  const failed = await request("/api/auth/login", {
    method: "POST",
    ...jsonBody({ email: "new@example.com", password: "wrong-password" }),
  });
  assert.equal(failed.response.status, 401);
  assert.equal(failed.body.error.message, "Invalid email or password.");

  const unknownEmail = await request("/api/auth/login", {
    method: "POST",
    ...jsonBody({ email: "missing@example.com", password: "some-password" }),
  });
  assert.equal(unknownEmail.response.status, 401);
  assert.equal(unknownEmail.body.error.message, failed.body.error.message);

  const loggedIn = await request("/api/auth/login", {
    method: "POST",
    ...jsonBody({ email: "NEW@example.com", password: "user-password-123" }),
  });
  assert.equal(loggedIn.response.status, 200);
  assert.equal(typeof loggedIn.body.data.token, "string");
  assert.equal(Object.hasOwn(loggedIn.body.data.user, "password_hash"), false);
  userToken = loggedIn.body.data.token;

  const adminLogin = await request("/api/auth/login", {
    method: "POST",
    ...jsonBody({ email: "admin@example.com", password: "admin-password-123" }),
  });
  assert.equal(adminLogin.response.status, 200);
  adminToken = adminLogin.body.data.token;
});

test("authentication rejects missing, invalid, and expired tokens", async () => {
  const missing = await request("/api/auth/me");
  assert.equal(missing.response.status, 401);

  const invalid = await request("/api/user/dashboard", bearer("not-a-jwt"));
  assert.equal(invalid.response.status, 401);

  const expiredToken = jwt.sign({}, jwtSecret, {
    subject: "2",
    expiresIn: "-1s",
    issuer: "day-12-api",
    audience: "day-12-api",
  });
  const expired = await request("/api/auth/me", bearer(expiredToken));
  assert.equal(expired.response.status, 401);

  const currentUser = await request("/api/auth/me", bearer(userToken));
  assert.equal(currentUser.response.status, 200);
  assert.equal(currentUser.body.data.email, "new@example.com");
  assert.equal(Object.hasOwn(currentUser.body.data, "password_hash"), false);

  const dashboard = await request("/api/user/dashboard", bearer(userToken));
  assert.equal(dashboard.response.status, 200);
  assert.equal(dashboard.body.data.user.role, "user");
});

test("authorization allows admins and denies users on admin-only routes", async () => {
  const deniedUsers = await request("/api/users", bearer(userToken));
  assert.equal(deniedUsers.response.status, 403);

  const deniedDashboard = await request(
    "/api/admin/dashboard",
    bearer(userToken),
  );
  assert.equal(deniedDashboard.response.status, 403);

  const dashboard = await request(
    "/api/admin/dashboard",
    bearer(adminToken),
  );
  assert.equal(dashboard.response.status, 200);
  assert.equal(dashboard.body.data.user.role, "admin");
});

test("admin user listing paginates results and validates query parameters", async () => {
  const defaults = await request("/api/users", bearer(adminToken));
  assert.equal(defaults.response.status, 200);
  assert.equal(defaults.body.data.length, 10);
  assert.deepEqual(defaults.body.pagination, {
    page: 1,
    limit: 10,
    totalRecords: 13,
    totalPages: 2,
  });
  assert.equal(
    defaults.body.data.some((user) => Object.hasOwn(user, "password_hash")),
    false,
  );

  const custom = await request("/api/users?page=2&limit=5", bearer(adminToken));
  assert.equal(custom.response.status, 200);
  assert.equal(custom.body.data.length, 5);
  assert.deepEqual(custom.body.pagination, {
    page: 2,
    limit: 5,
    totalRecords: 13,
    totalPages: 3,
  });

  const emptyPage = await request("/api/users?page=99&limit=5", bearer(adminToken));
  assert.equal(emptyPage.response.status, 200);
  assert.deepEqual(emptyPage.body.data, []);
  assert.equal(emptyPage.body.pagination.totalRecords, 13);

  for (const query of [
    "?page=0",
    "?page=-1",
    "?page=1.5",
    "?page=9007199254740991",
    "?limit=0",
    "?limit=101",
    "?limit=2.5",
    "?other=1",
    "?page=1&page=2",
  ]) {
    const invalid = await request(`/api/users${query}`, bearer(adminToken));
    assert.equal(invalid.response.status, 400, query);
    assert.equal(invalid.body.success, false, query);
  }
});

test("Swagger UI serves the API specification with bearer JWT security", async () => {
  const ui = await fetch(`${baseUrl}/api-docs/`);
  assert.equal(ui.status, 200);
  assert.match(await ui.text(), /Swagger UI/);

  const spec = await request("/api-docs.json");
  assert.equal(spec.response.status, 200);
  assert.equal(spec.body.components.securitySchemes.BearerAuth.scheme, "bearer");
  assert.deepEqual(Object.keys(spec.body.paths).sort(), [
    "/api/admin/dashboard",
    "/api/auth/login",
    "/api/auth/me",
    "/api/auth/register",
    "/api/user/dashboard",
    "/api/users",
  ]);
});

test("malformed JSON and unknown routes use consistent error responses", async () => {
  const malformed = await fetch(`${baseUrl}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: '{"name":',
  });
  assert.equal(malformed.status, 400);
  assert.deepEqual(await malformed.json(), {
    success: false,
    error: { message: "Request body contains invalid JSON." },
  });

  const missing = await request("/api/unknown");
  assert.equal(missing.response.status, 404);
  assert.deepEqual(missing.body, {
    success: false,
    error: { message: "The requested resource was not found." },
  });
});
