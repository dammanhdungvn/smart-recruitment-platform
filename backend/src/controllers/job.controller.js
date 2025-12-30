const jobService = require("../services/job.service");
const {
  sendSuccessResponse,
  sendErrorResponse,
} = require("../utils/response.util");

/**
 * Transform job object from DB format to API format
 */
const transformJobForAPI = (job) => {
  if (!job) return null;
  const jobData = job.toJSON ? job.toJSON() : { ...job };

  // Map DB fields to API fields but keep originals for backward compatibility
  if (jobData.job_title !== undefined && jobData.title === undefined) {
    jobData.title = jobData.job_title;
  }
  if (jobData.title !== undefined && jobData.job_title === undefined) {
    jobData.job_title = jobData.title;
  }

  if (jobData.city !== undefined && jobData.location === undefined) {
    jobData.location = jobData.city;
  }
  if (jobData.location !== undefined && jobData.city === undefined) {
    jobData.city = jobData.location;
  }

  if (jobData.user_id !== undefined && jobData.recruiter_id === undefined) {
    jobData.recruiter_id = jobData.user_id;
  }

  if (jobData.job_fields !== undefined && jobData.category === undefined) {
    jobData.category = jobData.job_fields; // Map job_fields to category for API
  }
  if (jobData.category !== undefined && jobData.job_fields === undefined) {
    jobData.job_fields = jobData.category;
  }

  if (jobData.createdAt && !jobData.created_at) {
    jobData.created_at = jobData.createdAt;
  }
  if (jobData.updatedAt && !jobData.updated_at) {
    jobData.updated_at = jobData.updatedAt;
  }

  // Extract company from recruiter association if present
  if (jobData.recruiter && jobData.recruiter.company) {
    jobData.company = jobData.recruiter.company;
  }

  return jobData;
};

/**
 * Create new job (recruiter)
 */
const createJob = async (req, res, next) => {
  try {
    // Normalize field names (title -> job_title, location -> city)
    const jobData = { ...req.body };
    if (jobData.title && !jobData.job_title) {
      jobData.job_title = jobData.title;
      delete jobData.title;
    }
    if (jobData.location && !jobData.city) {
      jobData.city = jobData.location;
      delete jobData.location;
    }

    const job = await jobService.createJob(req.user.id, jobData);
    const transformedJob = transformJobForAPI(job);
    sendSuccessResponse(
      res,
      { job: transformedJob },
      "Job created successfully",
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get all jobs (public)
 */
const getAllJobs = async (req, res, next) => {
  try {
    const pageParam = req.query.page;
    const limitParam = req.query.limit;
    let page = 1;
    let limit;

    if (pageParam !== undefined) {
      const parsedPage = Number.parseInt(pageParam, 10);
      if (Number.isNaN(parsedPage)) {
        return sendErrorResponse(res, "Invalid page parameter", 400);
      }
      page = parsedPage < 1 ? 1 : parsedPage;
    }

    if (limitParam !== undefined) {
      const parsedLimit = Number.parseInt(limitParam, 10);
      if (Number.isNaN(parsedLimit) || parsedLimit < 1) {
        return sendErrorResponse(res, "Invalid limit parameter", 400);
      }
      limit = parsedLimit;
    }

    const categoryParam = req.query.category || req.query.job_fields;
    let categories;
    let jobFields = undefined;

    if (Array.isArray(categoryParam)) {
      categories = categoryParam.filter(Boolean);
    } else if (typeof categoryParam === "string") {
      const parts = categoryParam
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      if (parts.length > 1) {
        categories = parts;
      } else if (parts.length === 1) {
        jobFields = parts[0];
      }
    }

    const filters = {
      city: req.query.city || req.query.location, // Accept both city and location
      job_type: req.query.job_type,
      position_level: req.query.position_level,
      job_fields: jobFields,
      categories,
      skills: req.query.skills,
      search: req.query.search,
      page,
      limit,
    };

    const {
      rows,
      count,
      limit: actualLimit,
    } = await jobService.getAllJobs({
      ...filters,
      withCount: true,
    });
    const transformedJobs = rows.map(transformJobForAPI);

    const pagination = {
      page,
      limit: actualLimit,
      total: count,
      totalPages: Math.ceil(count / actualLimit),
    };

    sendSuccessResponse(
      res,
      { jobs: transformedJobs, pagination },
      "Jobs retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get job by ID (public)
 */
const getJobById = async (req, res, next) => {
  try {
    const job = await jobService.getJobById(req.params.id);
    const transformedJob = transformJobForAPI(job);
    sendSuccessResponse(
      res,
      { job: transformedJob },
      "Job retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get recruiter's jobs
 */
const getMyJobs = async (req, res, next) => {
  try {
    const jobs = await jobService.getJobsByRecruiter(req.user.id);
    const transformedJobs = jobs.map(transformJobForAPI);
    sendSuccessResponse(
      res,
      { jobs: transformedJobs, count: transformedJobs.length },
      "Jobs retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Update job
 */
const updateJob = async (req, res, next) => {
  try {
    // Normalize field names
    const jobData = { ...req.body };
    if (jobData.title && !jobData.job_title) {
      jobData.job_title = jobData.title;
      delete jobData.title;
    }
    if (jobData.location && !jobData.city) {
      jobData.city = jobData.location;
      delete jobData.location;
    }

    const job = await jobService.updateJob(req.params.id, req.user.id, jobData);
    const transformedJob = transformJobForAPI(job);
    sendSuccessResponse(
      res,
      { job: transformedJob },
      "Job updated successfully"
    );
  } catch (error) {
    if (error.message === "Unauthorized to update this job") {
      return sendErrorResponse(res, error.message, 403);
    }
    next(error);
  }
};

/**
 * Delete job
 */
const deleteJob = async (req, res, next) => {
  try {
    await jobService.deleteJob(req.params.id, req.user.id);
    sendSuccessResponse(res, null, "Job deleted successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * Update job status
 */
const updateJobStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const job = await jobService.updateJobStatus(
      req.params.id,
      req.user.id,
      status,
      req.user?.role
    );
    const transformedJob = transformJobForAPI(job);
    sendSuccessResponse(
      res,
      { job: transformedJob },
      "Job status updated successfully"
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get distinct categories for filtering
 */
const getJobCategories = async (_req, res, next) => {
  try {
    const categories = await jobService.getJobCategories();
    sendSuccessResponse(
      res,
      { categories },
      "Job categories retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createJob,
  getAllJobs,
  getJobById,
  getMyJobs,
  updateJob,
  deleteJob,
  updateJobStatus,
  getJobCategories,
};
