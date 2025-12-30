/**
 * Add category column to jobs table
 * Run this script to add the category column if it doesn't exist
 */

require("dotenv").config();
const { sequelize } = require("../src/config/database");
const logger = require("../src/utils/logger");

const addJobCategoryColumn = async () => {
  try {
    logger.info("Starting migration: Add category column to jobs table");

    // Check if column exists
    const [results] = await sequelize.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'jobs' 
      AND COLUMN_NAME = 'category'
      AND TABLE_SCHEMA = DATABASE()
    `);

    if (results.length > 0) {
      logger.info("✓ Category column already exists in jobs table");
      return;
    }

    // Add category column
    await sequelize.query(`
      ALTER TABLE jobs 
      ADD COLUMN category VARCHAR(50) 
      NULL
      AFTER job_fields
    `);

    logger.info("✓ Successfully added category column to jobs table");

    // Update existing records with default category
    const [updateResult] = await sequelize.query(`
      UPDATE jobs 
      SET category = 'BUSINESS-DEVELOPMENT' 
      WHERE category IS NULL
    `);

    logger.info(
      `✓ Updated ${
        updateResult.affectedRows || 0
      } existing records with default category`
    );

    process.exit(0);
  } catch (error) {
    logger.error("Migration failed:", error);
    process.exit(1);
  }
};

addJobCategoryColumn();
