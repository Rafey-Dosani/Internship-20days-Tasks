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

  const statusCode =
    Number.isInteger(error.status) && error.status >= 400 && error.status < 500
      ? error.status
      : 500;

  if (statusCode === 500) {
    console.error(error);
  }

  const message =
    statusCode === 500
      ? "An unexpected error occurred."
      : error.message || "The request could not be processed.";

  return res
    .status(statusCode)
    .json({ success: false, error: { message } });
}
