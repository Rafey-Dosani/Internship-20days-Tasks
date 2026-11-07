function isRequestBody(body) {
  return body !== null && typeof body === "object" && !Array.isArray(body);
}

function validateTaskFields(body, { creating = false } = {}) {
  if (!isRequestBody(body)) {
    return "Request body must be a JSON object.";
  }

  const allowedFields = ["title", "description", "completed"];
  const suppliedFields = Object.keys(body).filter((field) =>
    allowedFields.includes(field),
  );

  if (Object.keys(body).some((field) => !allowedFields.includes(field))) {
    return "Only title, description, and completed fields are allowed.";
  }

  if (creating && !Object.hasOwn(body, "title")) {
    return "Title is required.";
  }

  if (!creating && suppliedFields.length === 0) {
    return "Provide at least one field to update.";
  }

  if (Object.hasOwn(body, "title")) {
    if (typeof body.title !== "string" || body.title.trim().length === 0) {
      return "Title must be a non-empty string.";
    }

    if (Array.from(body.title.trim()).length > 150) {
      return "Title must be 150 characters or fewer.";
    }
  }

  if (
    Object.hasOwn(body, "description") &&
    typeof body.description !== "string"
  ) {
    return "Description must be a string.";
  }

  if (
    Object.hasOwn(body, "completed") &&
    typeof body.completed !== "boolean"
  ) {
    return "Completed must be a boolean.";
  }

  return null;
}

function parseTaskId(id) {
  if (!/^[1-9]\d*$/.test(id)) {
    return null;
  }

  const numericId = Number(id);
  return Number.isSafeInteger(numericId) ? numericId : null;
}

function sendInvalidId(res) {
  return res.status(400).json({
    success: false,
    error: { message: "Task ID must be a positive integer." },
  });
}

function sendValidationError(res, message) {
  return res.status(400).json({ success: false, error: { message } });
}

export function createTaskController(taskService) {
  return {
    async getTasks(_req, res) {
      const tasks = await taskService.getTasks();
      return res.status(200).json({ success: true, data: tasks });
    },

    async getTaskById(req, res) {
      const id = parseTaskId(req.params.id);
      if (id === null) {
        return sendInvalidId(res);
      }

      const task = await taskService.getTaskById(id);
      if (!task) {
        return res.status(404).json({
          success: false,
          error: { message: `Task with ID ${id} was not found.` },
        });
      }

      return res.status(200).json({ success: true, data: task });
    },

    async createTask(req, res) {
      const validationError = validateTaskFields(req.body, { creating: true });
      if (validationError) {
        return sendValidationError(res, validationError);
      }

      const task = await taskService.createTask({
        title: req.body.title.trim(),
        description: req.body.description ?? "",
        completed: req.body.completed ?? false,
      });

      return res.status(201).json({ success: true, data: task });
    },

    async updateTask(req, res) {
      const id = parseTaskId(req.params.id);
      if (id === null) {
        return sendInvalidId(res);
      }

      const validationError = validateTaskFields(req.body);
      if (validationError) {
        return sendValidationError(res, validationError);
      }

      const updates = { ...req.body };
      if (Object.hasOwn(updates, "title")) {
        updates.title = updates.title.trim();
      }

      const task = await taskService.updateTask(id, updates);
      if (!task) {
        return res.status(404).json({
          success: false,
          error: { message: `Task with ID ${id} was not found.` },
        });
      }

      return res.status(200).json({ success: true, data: task });
    },

    async deleteTask(req, res) {
      const id = parseTaskId(req.params.id);
      if (id === null) {
        return sendInvalidId(res);
      }

      const task = await taskService.deleteTask(id);
      if (!task) {
        return res.status(404).json({
          success: false,
          error: { message: `Task with ID ${id} was not found.` },
        });
      }

      return res.status(200).json({
        success: true,
        data: { message: "Task deleted successfully.", task },
      });
    },
  };
}
