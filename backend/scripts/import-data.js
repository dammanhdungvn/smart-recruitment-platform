require("dotenv").config();
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const { User, Job, Resume, Application, sequelize } = require("../src/models");
const { hashPassword } = require("../src/utils/password.util");
const logger = require("../src/utils/logger");

// Paths
const DATA_DIR = path.join(__dirname, "../../data");
const JOBS_CSV = path.join(DATA_DIR, "jobs.csv");
const RESUMES_CSV = path.join(DATA_DIR, "resumes.csv");
const CV_DIR = path.join(DATA_DIR, "cv");

/**
 * Parse CSV file
 */
const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (error) => reject(error));
  });
};

/**
 * Create default users (recruiter, candidate, admin)
 */
const createDefaultUsers = async () => {
  logger.info("Creating default users...");

  const admin = await User.findOrCreate({
    where: { email: "admin@example.com" },
    defaults: {
      email: "admin@example.com",
      password: await hashPassword("password123"),
      full_name: "System Admin",
      role: "admin",
      phone: "0999999999",
    },
  });

  const recruiter = await User.findOrCreate({
    where: { email: "recruiter@example.com" },
    defaults: {
      email: "recruiter@example.com",
      password: await hashPassword("password123"),
      full_name: "Primary Recruiter",
      role: "recruiter",
      phone: "0123456789",
      company: "Dataset Corp",
    },
  });

  const candidate = await User.findOrCreate({
    where: { email: "candidate@example.com" },
    defaults: {
      email: "candidate@example.com",
      password: await hashPassword("password123"),
      full_name: "Primary Candidate",
      role: "candidate",
      phone: "0987654321",
    },
  });

  logger.info("✓ Default users ensured (admin, recruiter, candidate)");
  return { admin: admin[0], recruiter: recruiter[0], candidate: candidate[0] };
};

const normalizeJobType = (raw) => {
  const value = (raw || "").toString().trim().toLowerCase();
  const allowed = new Set([
    "full-time",
    "part-time",
    "contract",
    "internship",
    "freelance",
  ]);
  if (allowed.has(value)) return value;
  if (["fulltime", "full time"].includes(value)) return "full-time";
  if (["parttime", "part time"].includes(value)) return "part-time";
  return "full-time";
};

const normalizePositionLevel = (raw) => {
  const value = (raw || "").toString().trim().toLowerCase();
  const allowed = new Set([
    "intern",
    "fresher",
    "junior",
    "middle",
    "senior",
    "lead",
    "manager",
    "director",
  ]);
  if (allowed.has(value)) return value;
  if (value === "mid") return "middle";
  if (value === "sr" || value === "sr.") return "senior";
  return "junior";
};

const normalizeUnit = (raw) => {
  const value = (raw || "").toString().trim().toUpperCase();
  return value === "USD" ? "USD" : "VND";
};

const safeDecimal = (raw) => {
  if (raw === undefined || raw === null || raw === "") return null;
  const num = Number(raw);
  return Number.isFinite(num) ? num : null;
};

const clip = (value, max) => {
  if (value === undefined || value === null) return "";
  const str = value.toString();
  return str.length > max ? str.slice(0, max) : str;
};

const clipOrDefault = (value, max, fallback = "") => {
  if (!value) return fallback;
  return clip(value, max);
};

/**
 * Import jobs from CSV
 */
const importJobs = async (recruiterId) => {
  if (!fs.existsSync(JOBS_CSV)) {
    logger.warn(`Jobs CSV not found at: ${JOBS_CSV}`);
    return 0;
  }

  logger.info("Importing jobs from CSV...");

  const jobsData = await parseCSV(JOBS_CSV);
  const batchSize = 1000;
  let imported = 0;

  for (let i = 0; i < jobsData.length; i += batchSize) {
    const batch = jobsData.slice(i, i + batchSize).map((row) => ({
      user_id: recruiterId,
      job_title: clipOrDefault(
        row.job_title || row.title || "Untitled Job",
        255,
        "Untitled Job"
      ),
      job_type: normalizeJobType(row.job_type),
      position_level: normalizePositionLevel(row.position_level),
      city: clipOrDefault(row.city || "Ho Chi Minh", 100, "Ho Chi Minh"),
      experience: clip(row.experience || row.experience_level || "", 48),
      skills: row.skills || row.keywords || "",
      job_fields: clipOrDefault(row.job_fields || row.category || "", 255, ""),
      description:
        row.combined_text ||
        row.description ||
        row.job_description ||
        row.job_title ||
        "",
      requirements: row.requirements || null,
      benefits: row.benefits || null,
      salary_min: safeDecimal(row.salary_min_clean || row.salary_min),
      salary_max: safeDecimal(row.salary_max_clean || row.salary_max),
      unit: normalizeUnit(row.unit),
      status: "open",
    }));

    try {
      const result = await Job.bulkCreate(batch, { validate: true });
      imported += result.length;
      logger.info(`✓ Imported jobs ${imported}/${jobsData.length}`);
    } catch (error) {
      logger.error(
        `Error importing job batch starting at ${i}: ${error.message}`
      );
      throw error;
    }
  }

  logger.info(`✓ Imported ${imported} jobs total`);
  return imported;
};

/**
 * Import resumes from CSV and CV files
 */
const importResumes = async (candidateId) => {
  if (!fs.existsSync(RESUMES_CSV)) {
    logger.warn(`Resumes CSV not found at: ${RESUMES_CSV}`);
    return 0;
  }

  logger.info("Importing resumes from CSV...");

  const resumesData = await parseCSV(RESUMES_CSV);
  let imported = 0;

  for (const row of resumesData) {
    try {
      const category = row.Category || "GENERAL";
      const categoryDir = path.join(CV_DIR, category);

      let cvFilePath = null;
      let cvFileName = "resume.pdf";

      if (fs.existsSync(categoryDir)) {
        const files = fs
          .readdirSync(categoryDir)
          .filter((f) => !f.startsWith("."));
        if (files.length > 0) {
          cvFileName = files[Math.floor(Math.random() * files.length)];
          cvFilePath = path.join(categoryDir, cvFileName);
        }
      }

      if (!cvFilePath) {
        cvFileName = `resume_${row.ID || imported + 1}.pdf`;
        cvFilePath = path.join(CV_DIR, category, cvFileName);
      }

      await Resume.create({
        user_id: candidateId,
        file_name: cvFileName,
        file_path: cvFilePath,
        file_size: fs.existsSync(cvFilePath) ? fs.statSync(cvFilePath).size : 0,
        category,
        resume_text: row.cleaned_text || row.Resume_str || "",
        is_primary: imported === 0,
      });

      imported++;
      if (imported % 200 === 0) {
        logger.info(`✓ Imported resumes ${imported}/${resumesData.length}`);
      }
    } catch (error) {
      logger.error(
        `Error importing resume at row ${imported + 1}: ${error.message}`
      );
      throw error;
    }
  }

  logger.info(`✓ Imported ${imported} resumes total`);
  return imported;
};

/**
 * Main import function
 */
const importData = async () => {
  try {
    logger.info("=== Starting Data Import ===");

    // Test database connection
    await sequelize.authenticate();
    logger.info("✓ Database connected");

    // Clean existing data (order matters for FKs)
    await Application.destroy({ where: {} });
    await Resume.destroy({ where: {} });
    await Job.destroy({ where: {} });
    await User.destroy({ where: {} });
    logger.info("✓ Existing data cleared");

    // Sync database without altering schema
    await sequelize.sync({ alter: false });
    logger.info("✓ Database synced (schema intact)");

    // Create default users
    const users = await createDefaultUsers();

    // Import jobs
    const jobCount = await importJobs(users.recruiter.id);

    // Import resumes
    const resumeCount = await importResumes(users.candidate.id);

    logger.info("=== Data Import Completed ===");
    logger.info(`Total jobs imported: ${jobCount}`);
    logger.info(`Total resumes imported: ${resumeCount}`);
    logger.info("\nDefault credentials:");
    logger.info("Admin: admin@example.com / password123");
    logger.info("Recruiter: recruiter@example.com / password123");
    logger.info("Candidate: candidate@example.com / password123");

    process.exit(0);
  } catch (error) {
    logger.error("Import failed:", error);
    process.exit(1);
  }
};

// Run import
importData();
