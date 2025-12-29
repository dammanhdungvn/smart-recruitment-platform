const logger = require("../utils/logger");

/**
 * Centralized error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  // Log error
  logger.error(err.stack || err.message);

  // Sequelize validation error
  if (err.name === "SequelizeValidationError") {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: err.errors.map((e) => ({
        field: e.path,
        message: e.message,
      })),
    });
  }

  // Sequelize unique constraint error
  if (err.name === "SequelizeUniqueConstraintError") {
    return res.status(409).json({
      success: false,
      message: "Duplicate entry",
      errors: err.errors.map((e) => ({
        field: e.path,
        message: `${e.path} already exists`,
      })),
    });
  }

  // JWT error
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }

  // Explicit status code provided
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message || "Error",
    });
  }

  // Business logic errors - determine status based on message
  const message = err.message || "Internal server error";
  let statusCode = err.statusCode || 500;

  // Not found errors
  if (message.includes("not found") || message.includes("does not exist")) {
    statusCode = 404;
  }
  // Already exists / duplicate errors
  else if (message.includes("already") || message.includes("duplicate")) {
    statusCode = 409;
  }
  // Validation / business rule errors
  else if (
    message.includes("not accepting") ||
    message.includes("cannot") ||
    message.includes("must") ||
    message.includes("required") ||
    (message.includes("invalid") && !message.includes("password"))
  ) {
    statusCode = 400;
  }
  // Authentication errors
  else if (
    message.includes("password") ||
    message.includes("inactive") ||
    message.includes("unauthorized")
  ) {
    statusCode = 401;
  }
  // Permission errors
  else if (
    message.includes("not allowed") ||
    message.includes("permission") ||
    message.includes("forbidden") ||
    message.includes("access denied")
  ) {
    statusCode = 403;
  }

  // Default error response
  res.status(statusCode).json({
    success: false,
    message: message,
  });
};

/**
 * Handle 404 - Route not found
 */
const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
};

module.exports = { errorHandler, notFound };
