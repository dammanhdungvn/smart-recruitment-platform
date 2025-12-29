const { sequelize } = require("../config/database");
const User = require("./User");
const Job = require("./Job");
const Resume = require("./Resume");
const Application = require("./Application");

// Define associations
User.hasMany(Job, { foreignKey: "user_id", as: "jobs" });
Job.belongsTo(User, { foreignKey: "user_id", as: "recruiter" });

User.hasMany(Resume, { foreignKey: "user_id", as: "resumes" });
Resume.belongsTo(User, { foreignKey: "user_id", as: "candidate" });

User.hasMany(Application, { foreignKey: "user_id", as: "applications" });
Application.belongsTo(User, { foreignKey: "user_id", as: "candidate" });

Job.hasMany(Application, { foreignKey: "job_id", as: "applications" });
Application.belongsTo(Job, { foreignKey: "job_id", as: "job" });

Resume.hasMany(Application, { foreignKey: "resume_id", as: "applications" });
Application.belongsTo(Resume, { foreignKey: "resume_id", as: "resume" });

// Sync database
const syncDatabase = async (options = {}) => {
  try {
    await sequelize.sync(options);
    console.log("✓ Database synchronized successfully");
  } catch (error) {
    console.error("✗ Error synchronizing database:", error.message);
    throw error;
  }
};

module.exports = {
  sequelize,
  User,
  Job,
  Resume,
  Application,
  syncDatabase,
};
