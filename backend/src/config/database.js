const { Sequelize } = require("sequelize");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

// Shared model defaults
const baseDefine = {
  timestamps: true,
  underscored: true,
};

// Allow opting into MySQL for tests via USE_MYSQL_TEST=true
const isTestEnv = process.env.NODE_ENV === "test";
const useMysqlForTest = process.env.USE_MYSQL_TEST === "true";
const shouldUseMysql = !isTestEnv || useMysqlForTest;

// Resolve DB credentials (test-specific first to avoid using prod by mistake)
const dbName = shouldUseMysql
  ? useMysqlForTest
    ? process.env.DB_TEST_NAME || "smart_job_test"
    : process.env.DB_NAME || "smart_recruitment"
  : undefined;
const dbUser = useMysqlForTest
  ? process.env.DB_TEST_USER || "root"
  : process.env.DB_USER || "root";
const dbPassword = useMysqlForTest
  ? process.env.DB_TEST_PASSWORD || ""
  : process.env.DB_PASSWORD || "";
const dbHost = useMysqlForTest
  ? process.env.DB_TEST_HOST || "localhost"
  : process.env.DB_HOST || "localhost";
const dbPort = useMysqlForTest
  ? process.env.DB_TEST_PORT || 3306
  : process.env.DB_PORT || 3306;

const sequelize = shouldUseMysql
  ? new Sequelize(dbName, dbUser, dbPassword, {
      host: dbHost,
      port: dbPort,
      dialect: "mysql",
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
      define: baseDefine,
    })
  : new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      define: baseDefine,
    });

// Test database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✓ Database connection established successfully");
  } catch (error) {
    console.error("✗ Unable to connect to the database:", error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, testConnection };
