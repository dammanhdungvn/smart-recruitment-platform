const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Application = sequelize.define(
  "Application",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    job_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "jobs",
        key: "id",
      },
      unique: "uniq_application_per_job_user",
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      unique: "uniq_application_per_job_user",
    },
    resume_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "resumes",
        key: "id",
      },
    },
    cover_letter: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(
        "submitted",
        "pending",
        "reviewing",
        "shortlisted",
        "interviewed",
        "offered",
        "rejected",
        "withdrawn"
      ),
      defaultValue: "submitted",
    },
    applied_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    reviewed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "applications",
    timestamps: true,
    underscored: true,
  }
);

module.exports = Application;
