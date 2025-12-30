const { Job, User, Application } = require("../models");
const { Op } = require("sequelize");
const { sequelize } = require("../config/database");

const PAGE_SIZE = 10;

/**
 * Get distinct categories (both category and job_fields) for filters
 */
const getJobCategories = async () => {
  // Query distinct category and job_fields values (non-null)
  const [categoryRows, fieldRows] = await Promise.all([
    Job.findAll({
      attributes: [
        [sequelize.fn("DISTINCT", sequelize.col("category")), "category"],
      ],
      where: {
        status: "open",
        category: { [Op.ne]: null },
      },
      raw: true,
    }),
    Job.findAll({
      attributes: [
        [sequelize.fn("DISTINCT", sequelize.col("job_fields")), "job_fields"],
      ],
      where: {
        status: "open",
        job_fields: { [Op.ne]: null },
      },
      raw: true,
    }),
  ]);

  const categories = new Set();
  categoryRows.forEach((row) => {
    if (row.category) categories.add(row.category);
  });
  fieldRows.forEach((row) => {
    if (row.job_fields) categories.add(row.job_fields);
  });

  return Array.from(categories).sort((a, b) => a.localeCompare(b));
};

/**
 * Create new job
 */
const createJob = async (userId, jobData) => {
  const job = await Job.create({
    user_id: userId,
    ...jobData,
  });

  // Fetch with recruiter to include company info
  const jobWithRecruiter = await Job.findByPk(job.id, {
    include: [
      {
        model: User,
        as: "recruiter",
        attributes: ["id", "full_name", "company", "email"],
      },
    ],
  });

  return jobWithRecruiter;
};

/**
 * Get all jobs (public)
 */
const getAllJobs = async (filters = {}) => {
  const page = filters.page || 1;
  const limit = filters.limit || PAGE_SIZE;
  const offset = (page - 1) * limit;

  const andConditions = [{ status: "open" }];

  // Apply filters
  if (filters.city) {
    andConditions.push({ city: { [Op.like]: `%${filters.city}%` } });
  }

  if (filters.job_type) {
    andConditions.push({ job_type: filters.job_type });
  }

  if (filters.position_level) {
    andConditions.push({ position_level: filters.position_level });
  }

  if (filters.categories && filters.categories.length > 0) {
    andConditions.push({
      [Op.or]: [
        { category: { [Op.in]: filters.categories } },
        { job_fields: { [Op.in]: filters.categories } },
      ],
    });
  } else if (filters.job_fields) {
    andConditions.push({
      [Op.or]: [
        { job_fields: { [Op.like]: `%${filters.job_fields}%` } },
        { category: { [Op.like]: `%${filters.job_fields}%` } },
      ],
    });
  }

  if (filters.skills) {
    andConditions.push({ skills: { [Op.like]: `%${filters.skills}%` } });
  }

  if (filters.search) {
    andConditions.push({
      [Op.or]: [
        { job_title: { [Op.like]: `%${filters.search}%` } },
        { description: { [Op.like]: `%${filters.search}%` } },
        { skills: { [Op.like]: `%${filters.search}%` } },
      ],
    });
  }

  const where = { [Op.and]: andConditions };
  const result = await Job.findAndCountAll({
    where,
    include: [
      {
        model: User,
        as: "recruiter",
        attributes: ["id", "full_name", "email"],
      },
    ],
    order: [["created_at", "DESC"]],
    limit,
    offset,
  });

  // When withCount flag set (for pagination), return both rows and count
  if (filters.withCount) {
    return { rows: result.rows, count: result.count, page, limit };
  }

  // Backward-compatible default: return rows array
  return result.rows;
};

/**
 * Get job by ID
 */
const getJobById = async (jobId) => {
  const job = await Job.findByPk(jobId, {
    include: [
      {
        model: User,
        as: "recruiter",
        attributes: ["id", "full_name", "email", "phone"],
      },
    ],
  });

  if (!job) {
    throw new Error("Job not found");
  }

  return job;
};

/**
 * Get jobs by recruiter
 */
const getJobsByRecruiter = async (userId) => {
  const jobs = await Job.findAll({
    where: { user_id: userId },
    order: [["created_at", "DESC"]],
    include: [
      {
        model: Application,
        as: "applications",
      },
    ],
  });

  return jobs;
};

/**
 * Update job
 */
const updateJob = async (jobId, userId, updateData) => {
  const job = await Job.findByPk(jobId);

  if (!job) {
    throw new Error("Job not found");
  }

  // Check ownership
  if (job.user_id !== userId) {
    throw new Error("Unauthorized to update this job");
  }

  // Update job
  await job.update(updateData);

  return job;
};

/**
 * Delete job
 */
const deleteJob = async (jobId, userId) => {
  const job = await Job.findByPk(jobId);

  if (!job) {
    throw new Error("Job not found");
  }

  // Check ownership
  if (job.user_id !== userId) {
    throw new Error("Unauthorized to delete this job");
  }

  await job.destroy();

  return true;
};

/**
 * Update job status
 */
const updateJobStatus = async (jobId, userId, status, role = "candidate") => {
  const job = await Job.findByPk(jobId);

  if (!job) {
    throw new Error("Job not found");
  }

  const isAdmin = role === "admin";
  const requesterId = Number(userId);

  // Check ownership (admins can override)
  if (!isAdmin && job.user_id !== requesterId) {
    const err = new Error("Unauthorized to update this job");
    err.statusCode = 403;
    throw err;
  }

  job.status = status;
  await job.save();

  return job;
};

module.exports = {
  createJob,
  getAllJobs,
  getJobById,
  getJobsByRecruiter,
  updateJob,
  deleteJob,
  updateJobStatus,
  getJobCategories,
};
