const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });

const app = require("../src/app");
const config = require("../src/config/config");
const { sequelize, testConnection } = require("../src/config/database");
const { syncDatabase } = require("../src/models");
const logger = require("../src/utils/logger");

const start = async () => {
  try {
    // Basic env validation to surface missing credentials early
    const requiredEnv = [
      "DB_NAME",
      "DB_USER",
      "DB_PASSWORD",
      "DB_HOST",
      "DB_PORT",
    ];
    const missing = requiredEnv.filter((key) => !process.env[key]);
    if (missing.length) {
      logger.error(
        `Missing required environment variables: ${missing.join(", ")}. ` +
          "Set them in your .env before starting the server."
      );
      process.exit(1);
    }

    await testConnection();
    await syncDatabase({ alter: false });

    const port = config.port;
    const env = config.nodeEnv;
    const dbName =
      typeof sequelize.getDatabaseName === "function"
        ? sequelize.getDatabaseName()
        : sequelize.config.database;

    app.listen(port, () => {
      logger.info(`Server is running on port ${port}`);
      logger.info(`Environment: ${env}`);
      logger.info(`Database: ${dbName}`);
      logger.info(`API base: http://localhost:${port}/api`);
      logger.info(`Swagger UI available at: http://localhost:${port}/api/docs`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error.message || error);
    if (
      String(error.message || "")
        .toLowerCase()
        .includes("access denied")
    ) {
      logger.error(
        "Database access denied. Check DB_USER/DB_PASSWORD/DB_HOST/DB_PORT/DB_NAME in your .env."
      );
    }
    process.exit(1);
  }
};

start();
