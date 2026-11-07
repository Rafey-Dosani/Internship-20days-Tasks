import express from "express";
import pool from "./config/database.js";
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";
import { createTaskService } from "./services/taskService.js";
import { createTaskRouter } from "./routes/taskRoutes.js";

export function createApp({ databasePool = pool } = {}) {
  const app = express();
  const taskService = createTaskService(databasePool);

  app.use(express.json());
  app.use("/api/tasks", createTaskRouter(taskService));
  app.use(notFound);
  app.use(errorHandler);

  return app;
}

const app = createApp();

export default app;
