const { User, Job, Resume, Application } = require("../../src/models");
const { hashPassword } = require("../../src/utils/password.util");
const { generateToken } = require("../../src/utils/jwt.util");

/**
 * Create test user
 */
const createTestUser = async (overrides = {}) => {
  // Default password in plaintext
  const plainPassword = overrides.password || "Password123!";

  const defaultData = {
    email: `test${Date.now()}@example.com`,
    password: await hashPassword(plainPassword),
    full_name: "Test User",
    role: "candidate",
    phone: "0123456789",
    is_active: true,
  };

  const userData = { ...defaultData, ...overrides };

  // If password was provided, hash it
  if (overrides.password) {
    userData.password = await hashPassword(overrides.password);
  }

  const user = await User.create(userData);
  return user;
};

/**
 * Create test job
 */
const createTestJob = async (userId, overrides = {}) => {
  const defaultData = {
    user_id: userId,
    job_title: "Test Job",
    job_type: "full-time",
    position_level: "junior",
    city: "Ho Chi Minh",
    experience: "1-2 years",
    skills: "JavaScript, Node.js",
    job_fields: "IT",
    description: "Test job description",
    salary_min: 10000000,
    salary_max: 20000000,
    unit: "VND",
    status: "open",
  };

  // Normalize common test-friendly aliases
  const normalized = { ...overrides };
  if (overrides.title) {
    normalized.job_title = overrides.title;
    delete normalized.title;
  }
  if (overrides.location) {
    normalized.city = overrides.location;
    delete normalized.location;
  }
  if (overrides.category) {
    normalized.job_fields = overrides.category;
    delete normalized.category;
  }

  const job = await Job.create({ ...defaultData, ...normalized });
  // Expose API-friendly aliases for downstream assertions in tests
  job.setDataValue("title", job.job_title);
  job.setDataValue("location", job.city);
  job.setDataValue("category", job.job_fields);
  job.title = job.job_title;
  job.location = job.city;
  job.category = job.job_fields;
  return job;
};

/**
 * Create test resume
 */
const createTestResume = async (userId, overrides = {}) => {
  const defaultData = {
    user_id: userId,
    file_name: "test-resume.pdf",
    file_path: "/uploads/resumes/test-resume.pdf",
    file_size: 1024,
    category: "INFORMATION-TECHNOLOGY",
    resume_text: "Test resume content",
    is_primary: false,
  };

  const resume = await Resume.create({ ...defaultData, ...overrides });
  return resume;
};

/**
 * Create test application
 */
const createTestApplication = async (a, b, c, overrides = {}) => {
  // Support both legacy order (jobId, userId, resumeId) and expected order (userId, jobId, resumeId)
  let userId;
  let jobId;
  let resumeId;

  const userA = await User.findByPk(a);
  const jobB = await Job.findByPk(b);
  const jobA = await Job.findByPk(a);
  const userB = await User.findByPk(b);

  if (userA && jobB) {
    // Expected order: (userId, jobId, resumeId)
    userId = a;
    jobId = b;
    resumeId = c;
  } else if (jobA && userB) {
    // Legacy order: (jobId, userId, resumeId)
    jobId = a;
    userId = b;
    resumeId = c;
  } else {
    // Fallback to expected order
    userId = a;
    jobId = b;
    resumeId = c;
  }

  const defaultData = {
    job_id: jobId,
    user_id: userId,
    resume_id: resumeId,
    cover_letter: "Test cover letter",
    status: "submitted",
  };

  const application = await Application.create({
    ...defaultData,
    ...overrides,
  });
  return application;
};

/**
 * Generate auth token for user
 */
const generateAuthToken = (user) => {
  return generateToken({ userId: user.id, role: user.role });
};

/**
 * Clean up database
 */
const cleanupDatabase = async () => {
  await Application.destroy({ where: {}, force: true });
  await Resume.destroy({ where: {}, force: true });
  await Job.destroy({ where: {}, force: true });
  await User.destroy({ where: {}, force: true });
};

module.exports = {
  createTestUser,
  createTestJob,
  createTestResume,
  createTestApplication,
  generateAuthToken,
  cleanupDatabase,
};
