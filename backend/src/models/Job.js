const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Job = sequelize.define(
  "Job",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    job_title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    job_type: {
      type: DataTypes.ENUM(
        "full-time",
        "part-time",
        "contract",
        "internship",
        "freelance"
      ),
      allowNull: false,
      defaultValue: "full-time",
    },
    position_level: {
      type: DataTypes.ENUM(
        "intern",
        "fresher",
        "junior",
        "middle",
        "senior",
        "lead",
        "manager",
        "director"
      ),
      allowNull: false,
      defaultValue: "junior",
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    experience: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    skills: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    job_fields: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    requirements: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    benefits: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    salary_min: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },
    salary_max: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },
    unit: {
      type: DataTypes.ENUM("VND", "USD"),
      defaultValue: "VND",
    },
    status: {
      type: DataTypes.ENUM("open", "closed", "draft"),
      defaultValue: "open",
    },
    deadline: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "jobs",
    timestamps: true,
    underscored: true,
  }
);

module.exports = Job;
