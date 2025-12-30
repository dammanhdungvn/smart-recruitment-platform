const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const { sequelize, User, Job, Resume, Application } = require("../src/models");
const { hashPassword } = require("../src/utils/password.util");

const useMysqlForTest = process.env.USE_MYSQL_TEST === "true";

const seedMysqlTestData = async () => {
  // Seed baseline users
  const candidate = await User.create({
    email: "seed_candidate@example.com",
    password: await hashPassword("Password123!"),
    full_name: "Seed Candidate",
    role: "candidate",
    phone: "0900000001",
    is_active: true,
  });

  const recruiter = await User.create({
    email: "seed_recruiter@example.com",
    password: await hashPassword("Password123!"),
    full_name: "Seed Recruiter",
    role: "recruiter",
    phone: "0900000002",
    company: "Seed Corp",
    is_active: true,
  });

  await User.create({
    email: "seed_admin@example.com",
    password: await hashPassword("Password123!"),
    full_name: "Seed Admin",
    role: "admin",
    phone: "0900000003",
    is_active: true,
  });

  // Seed job for recruiter
  const job = await Job.create({
    user_id: recruiter.id,
    job_title: "Seed Job",
    job_type: "full-time",
    position_level: "junior",
    city: "Ho Chi Minh",
    experience: "1-2 years",
    skills: "Node.js, SQL",
    job_fields: "INFORMATION-TECHNOLOGY",
    description: "Seed job description",
    salary_min: 10000000,
    salary_max: 20000000,
    unit: "VND",
    status: "open",
  });

  // Seed resume for candidate
  const resume = await Resume.create({
    user_id: candidate.id,
    file_name: "seed-resume.pdf",
    file_path: "/uploads/resumes/seed-resume.pdf",
    file_size: 1024,
    category: "INFORMATION-TECHNOLOGY",
    resume_text: "Seed resume content",
    is_primary: true,
  });

  // Seed application linking candidate to job
  await Application.create({
    job_id: job.id,
    user_id: candidate.id,
    resume_id: resume.id,
    cover_letter: "I would like to join Seed Corp",
    status: "submitted",
  });
};

// Set test environment
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test_jwt_secret_key_for_testing";

// Global setup
beforeAll(async () => {
  // Connect to test database
  try {
    await sequelize.authenticate();
    console.log("✓ Test database connected");

    // Sync database (create tables)
    await sequelize.sync({ force: true });
    console.log("✓ Test database synced");

    // Seed minimal dataset for MySQL runs to validate constraints
    if (useMysqlForTest) {
      await seedMysqlTestData();
      console.log("✓ MySQL test data seeded");
    }
  } catch (error) {
    console.error("✗ Test database connection failed:", error);
    throw error;
  }
});

// Global teardown
afterAll(async () => {
  try {
    await sequelize.close();
    console.log("✓ Test database connection closed");
  } catch (error) {
    console.error("✗ Error closing test database:", error);
  }
});

// Global test timeout
jest.setTimeout(10000);
