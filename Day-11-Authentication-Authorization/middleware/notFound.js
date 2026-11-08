import { HttpError } from "../utils/httpError.js";

export default function notFound(_req, _res, next) {
  return next(new HttpError(404, "The requested resource was not found."));
}
