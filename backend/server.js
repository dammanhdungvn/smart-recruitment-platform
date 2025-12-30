const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const app = require("./src/app");
const config = require("./src/config/config");
const { testConnection } = require("./src/config/database");
const { syncDatabase } = require("./src/models");
const logger = require("./src/utils/logger");

const startServer = async () => {
  try {
    // Test database connection
    await testConnection();

    // Sync database (create tables if not exist)
    await syncDatabase({ alter: false });

    // Start server
    const PORT = config.port;
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
      logger.info(`Environment: ${config.nodeEnv}`);
      logger.info(`API: http://localhost:${PORT}/api`);
      logger.info(`Swagger docs: http://localhost:${PORT}/api/docs`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
