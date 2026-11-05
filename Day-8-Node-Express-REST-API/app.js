import express from "express";
import taskRoutes from "./routes/taskRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import notFound from "./middleware/notFound.js";
import requestLogger from "./middleware/requestLogger.js";

const app = express();

app.use(requestLogger);
app.use(express.json());
app.use("/api/tasks", taskRoutes);
app.use(notFound);
app.use(errorHandler);

export default app;
