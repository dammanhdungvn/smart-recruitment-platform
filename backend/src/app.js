const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const config = require("./config/config");
const routes = require("./routes");
const { errorHandler, notFound } = require("./middleware/error.middleware");
const logger = require("./utils/logger");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// Swagger documentation
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API routes
app.use("/api", routes);

// Static files for uploads
app.use("/uploads", express.static("uploads"));

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

module.exports = app;
