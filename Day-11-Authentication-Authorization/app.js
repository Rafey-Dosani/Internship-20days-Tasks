import express from "express";
import pool from "./config/database.js";
import { createAuthController } from "./controllers/authController.js";
import { createUserController } from "./controllers/userController.js";
import errorHandler from "./middleware/errorHandler.js";
import notFound from "./middleware/notFound.js";
import { createAuthenticate } from "./middleware/authenticate.js";
import { requireRole } from "./middleware/requireRole.js";
import { createAuthService } from "./services/authService.js";

export function createApp({
  databasePool = pool,
  jwtSecret = process.env.JWT_SECRET,
} = {}) {
  if (typeof jwtSecret !== "string" || jwtSecret.length < 32) {
    throw new Error("JWT_SECRET must be configured with at least 32 characters.");
  }

  const app = express();
  const authService = createAuthService(databasePool, { jwtSecret });
  const authController = createAuthController(authService);
  const userController = createUserController(authService);
  const authenticate = createAuthenticate(authService, jwtSecret);

  app.use(express.json({ limit: "16kb" }));

  app.post("/api/auth/register", authController.register);
  app.post("/api/auth/login", authController.login);
  app.get("/api/auth/me", authenticate, authController.getCurrentUser);

  app.get(
    "/api/users",
    authenticate,
    requireRole("admin"),
    userController.getUsers,
  );
  app.get("/api/user/dashboard", authenticate, userController.getUserDashboard);
  app.get(
    "/api/admin/dashboard",
    authenticate,
    requireRole("admin"),
    userController.getAdminDashboard,
  );

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
