import { HttpError } from "../utils/httpError.js";

export function requireRole(...roles) {
  return function authorize(req, _res, next) {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new HttpError(403, "You do not have permission to access this resource."));
    }

    return next();
  };
}
