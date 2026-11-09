import jwt from "jsonwebtoken";
import { HttpError } from "../utils/httpError.js";

export function createAuthenticate(authService, jwtSecret) {
  return async function authenticate(req, _res, next) {
    const authorization = req.get("Authorization");
    const match =
      typeof authorization === "string" &&
      authorization.match(/^Bearer\s+(\S+)$/i);

    if (!match) {
      return next(new HttpError(401, "A valid Bearer token is required."));
    }

    let payload;
    try {
      payload = jwt.verify(match[1], jwtSecret, {
        issuer: "day-12-api",
        audience: "day-12-api",
      });
    } catch {
      return next(new HttpError(401, "The access token is invalid or expired."));
    }

    if (
      typeof payload !== "object" ||
      typeof payload.sub !== "string" ||
      !/^[1-9]\d*$/.test(payload.sub)
    ) {
      return next(new HttpError(401, "The access token is invalid or expired."));
    }

    const user = await authService.getUserById(payload.sub);
    if (!user) {
      return next(new HttpError(401, "The access token is invalid or expired."));
    }

    req.user = user;
    return next();
  };
}
