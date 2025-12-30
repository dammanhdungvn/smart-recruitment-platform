/**
 * Add status column to resumes table
 * Run this script to add the status column if it doesn't exist
 */

require("dotenv").config();
const { sequelize } = require("../src/config/database");
const logger = require("../src/utils/logger");

const addResumeStatusColumn = async () => {
  try {
    logger.info("Starting migration: Add status column to resumes table");

    // Check if column exists
    const [results] = await sequelize.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'resumes' 
      AND COLUMN_NAME = 'status'
      AND TABLE_SCHEMA = DATABASE()
    `);

    if (results.length > 0) {
      logger.info("✓ Status column already exists in resumes table");
      return;
    }

    // Add status column
    await sequelize.query(`
      ALTER TABLE resumes 
      ADD COLUMN status ENUM('pending', 'approved', 'rejected') 
      NOT NULL DEFAULT 'pending'
      AFTER is_primary
    `);

    logger.info("✓ Successfully added status column to resumes table");

    // Update existing records to have status = 'pending'
    const [updateResult] = await sequelize.query(`
      UPDATE resumes 
      SET status = 'pending' 
      WHERE status IS NULL
    `);

    logger.info(`✓ Updated ${updateResult.affectedRows || 0} existing records`);

    process.exit(0);
  } catch (error) {
    logger.error("Migration failed:", error);
    process.exit(1);
  }
};

addResumeStatusColumn();
