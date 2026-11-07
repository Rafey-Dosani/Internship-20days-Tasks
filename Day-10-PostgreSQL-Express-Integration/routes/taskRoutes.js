import { Router } from "express";
import { createTaskController } from "../controllers/taskController.js";

export function createTaskRouter(taskService) {
  const router = Router();
  const controller = createTaskController(taskService);

  router.get("/", controller.getTasks);
  router.get("/:id", controller.getTaskById);
  router.post("/", controller.createTask);
  router.put("/:id", controller.updateTask);
  router.delete("/:id", controller.deleteTask);

  return router;
}
