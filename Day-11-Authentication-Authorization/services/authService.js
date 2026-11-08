import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { HttpError } from "../utils/httpError.js";

const userColumns =
  'id, name, email, role, created_at AS "createdAt"';
const passwordHashColumns = `${userColumns}, password_hash`;
const bcryptRounds = 12;

export function createAuthService(pool, { jwtSecret }) {
  return {
    async registerUser({ name, email, password }) {
      const normalizedEmail = email.toLowerCase();
      const existingUser = await pool.query(
        "SELECT id FROM public.users WHERE LOWER(email) = $1",
        [normalizedEmail],
      );
      if (existingUser.rows.length > 0) {
        throw new HttpError(409, "An account with this email already exists.");
      }

      const passwordHash = await bcrypt.hash(password, bcryptRounds);
      try {
        const result = await pool.query(
          `INSERT INTO public.users (name, email, password_hash)
           VALUES ($1, $2, $3)
           RETURNING ${userColumns}`,
          [name, normalizedEmail, passwordHash],
        );
        return result.rows[0];
      } catch (error) {
        if (error.code === "23505") {
          throw new HttpError(
            409,
            "An account with this email already exists.",
          );
        }
        throw error;
      }
    },

    async loginUser({ email, password }) {
      const result = await pool.query(
        `SELECT ${passwordHashColumns}
         FROM public.users
         WHERE LOWER(email) = $1`,
        [email.toLowerCase()],
      );
      const user = result.rows[0];
      const passwordMatches =
        user && (await bcrypt.compare(password, user.password_hash));

      if (!passwordMatches) {
        throw new HttpError(401, "Invalid email or password.");
      }

      const token = jwt.sign({}, jwtSecret, {
        subject: String(user.id),
        expiresIn: "1h",
        issuer: "day-11-auth-api",
        audience: "day-11-auth-api",
      });

      return {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
      };
    },

    async getUserById(id) {
      const result = await pool.query(
        `SELECT ${userColumns} FROM public.users WHERE id = $1`,
        [id],
      );
      return result.rows[0] ?? null;
    },

    async getUsers() {
      const result = await pool.query(
        `SELECT ${userColumns} FROM public.users ORDER BY id`,
      );
      return result.rows;
    },
  };
}
