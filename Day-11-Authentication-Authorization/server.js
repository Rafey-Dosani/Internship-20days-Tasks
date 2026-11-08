import "dotenv/config";
import { createApp } from "./app.js";
import pool from "./config/database.js";

const port = Number(process.env.PORT) || 3000;
const app = createApp({ databasePool: pool });

async function startServer() {
  await pool.query("SELECT 1");

  const server = app.listen(port, () => {
    console.log(`Authentication API is running at http://localhost:${port}`);
  });

  const shutdown = (signal) => {
    console.log(`${signal} received; closing the server.`);
    server.close(async (error) => {
      if (error) {
        console.error("Failed to close the HTTP server.", error);
        process.exitCode = 1;
      }

      try {
        await pool.end();
      } catch (poolError) {
        console.error("Failed to close the PostgreSQL pool.", poolError);
        process.exitCode = 1;
      }
    });
  };

  process.once("SIGINT", () => shutdown("SIGINT"));
  process.once("SIGTERM", () => shutdown("SIGTERM"));
}

startServer().catch(async (error) => {
  console.error("Failed to start the authentication API.", error);
  process.exitCode = 1;

  try {
    await pool.end();
  } catch (poolError) {
    console.error("Failed to close the PostgreSQL pool.", poolError);
  }
});
