import assert from "node:assert/strict";
import bcrypt from "bcrypt";
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

    if (sql.startsWith("SELECT") && sql.includes("ORDER BY id")) {
      return { rows: this.users.map((user) => this.publicUser(user)) };
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
  databasePool = new FakePool([
    {
      id: 1,
      name: "Admin",
      email: "admin@example.com",
      password_hash: passwordHash,
      role: "admin",
      createdAt,
    },
  ]);
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
  const invalid = await request("/api/auth/register", {
    method: "POST",
    ...jsonBody({ name: "New User", email: "not-an-email", password: "short" }),
  });
  assert.equal(invalid.response.status, 400);

  const roleEscalation = await request("/api/auth/register", {
    method: "POST",
    ...jsonBody({
      name: "New User",
      email: "new@example.com",
      password: "user-password-123",
      role: "admin",
    }),
  });
  assert.equal(roleEscalation.response.status, 400);

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

test("authentication rejects missing and invalid tokens and accepts a valid token", async () => {
  const missing = await request("/api/auth/me");
  assert.equal(missing.response.status, 401);

  const invalid = await request("/api/user/dashboard", bearer("not-a-jwt"));
  assert.equal(invalid.response.status, 401);

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

  const users = await request("/api/users", bearer(adminToken));
  assert.equal(users.response.status, 200);
  assert.equal(users.body.data.length, 2);
  assert.equal(
    users.body.data.some((user) => Object.hasOwn(user, "password_hash")),
    false,
  );

  const dashboard = await request(
    "/api/admin/dashboard",
    bearer(adminToken),
  );
  assert.equal(dashboard.response.status, 200);
  assert.equal(dashboard.body.data.user.role, "admin");
});

test("malformed JSON uses the centralized error response", async () => {
  const response = await fetch(`${baseUrl}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: '{"name":',
  });
  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), {
    success: false,
    error: { message: "Request body contains invalid JSON." },
  });
});
