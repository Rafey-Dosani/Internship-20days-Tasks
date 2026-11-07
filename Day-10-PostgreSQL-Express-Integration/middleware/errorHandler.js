export default function errorHandler(error, _req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  if (error.type === "entity.parse.failed") {
    return res.status(400).json({
      success: false,
      error: { message: "Request body contains invalid JSON." },
    });
  }

  if (error.code === "23514" || error.code === "22001") {
    return res.status(400).json({
      success: false,
      error: { message: "Task data violates a database constraint." },
    });
  }

  console.error(error);
  return res.status(500).json({
    success: false,
    error: { message: "An unexpected error occurred." },
  });
}
