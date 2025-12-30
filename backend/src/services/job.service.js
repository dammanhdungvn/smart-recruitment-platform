const { Job, User, Application } = require("../models");
const { Op } = require("sequelize");

const PAGE_SIZE = 10;

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
  const where = { status: "open" };

  // Apply filters
  if (filters.city) {
    where.city = { [Op.like]: `%${filters.city}%` };
  }

  if (filters.job_type) {
    where.job_type = filters.job_type;
  }

  if (filters.position_level) {
    where.position_level = filters.position_level;
  }

  if (filters.job_fields) {
    where.job_fields = { [Op.like]: `%${filters.job_fields}%` };
  }

  if (filters.skills) {
    where.skills = { [Op.like]: `%${filters.skills}%` };
  }

  if (filters.search) {
    where[Op.or] = [
      { job_title: { [Op.like]: `%${filters.search}%` } },
      { description: { [Op.like]: `%${filters.search}%` } },
      { skills: { [Op.like]: `%${filters.search}%` } },
    ];
  }
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
const updateJobStatus = async (jobId, userId, status) => {
  const job = await Job.findByPk(jobId);

  if (!job) {
    throw new Error("Job not found");
  }

  // Check ownership
  if (job.user_id !== userId) {
    throw new Error("Unauthorized to update this job");
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
};
