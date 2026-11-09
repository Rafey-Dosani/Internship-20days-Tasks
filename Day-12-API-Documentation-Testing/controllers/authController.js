import { HttpError } from "../utils/httpError.js";

function isRequestBody(body) {
  return body !== null && typeof body === "object" && !Array.isArray(body);
}

function validateCredentials(body, { registering = false } = {}) {
  if (!isRequestBody(body)) {
    return "Request body must be a JSON object.";
  }

  const allowedFields = registering
    ? ["name", "email", "password"]
    : ["email", "password"];
  if (Object.keys(body).some((field) => !allowedFields.includes(field))) {
    return `Only ${allowedFields.join(", ")} fields are allowed.`;
  }

  if (registering) {
    if (typeof body.name !== "string" || body.name.trim().length === 0) {
      return "Name must be a non-empty string.";
    }
    if (Array.from(body.name.trim()).length > 100) {
      return "Name must be 100 characters or fewer.";
    }
  }

  if (
    typeof body.email !== "string" ||
    body.email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim())
  ) {
    return "A valid email address is required.";
  }

  if (typeof body.password !== "string") {
    return "Password is required.";
  }

  if (registering) {
    if (body.password.length < 8) {
      return "Password must be at least 8 characters long.";
    }
    if (Buffer.byteLength(body.password, "utf8") > 72) {
      return "Password must be 72 bytes or fewer.";
    }
  }

  return null;
}

function validateOrThrow(body, options) {
  const validationError = validateCredentials(body, options);
  if (validationError) {
    throw new HttpError(400, validationError);
  }
}

export function createAuthController(authService) {
  return {
    async register(req, res) {
      validateOrThrow(req.body, { registering: true });

      const user = await authService.registerUser({
        name: req.body.name.trim(),
        email: req.body.email.trim(),
        password: req.body.password,
      });

      return res.status(201).json({ success: true, data: user });
    },

    async login(req, res) {
      validateOrThrow(req.body);

      const result = await authService.loginUser({
        email: req.body.email.trim(),
        password: req.body.password,
      });
      return res.status(200).json({ success: true, data: result });
    },

    getCurrentUser(req, res) {
      return res.status(200).json({ success: true, data: req.user });
    },
  };
}
