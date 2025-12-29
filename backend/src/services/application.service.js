const { Application, Job, User, Resume } = require("../models");

/**
 * Create application
 */
const createApplication = async (userId, applicationData) => {
  const { job_id, resume_id, cover_letter } = applicationData;

  // Check if job exists and is open
  const job = await Job.findByPk(job_id);
  if (!job) {
    const err = new Error("Job not found");
    err.statusCode = 404;
    throw err;
  }

  if (job.status !== "open") {
    const err = new Error("Job is not accepting applications");
    err.statusCode = 400;
    throw err;
  }

  // Check if resume belongs to user
  const resume = await Resume.findOne({
    where: { id: resume_id, user_id: userId },
  });

  if (!resume) {
    const err = new Error("Resume not found");
    err.statusCode = 404;
    throw err;
  }

  // Check if already applied
  const existingApplication = await Application.findOne({
    where: { job_id, user_id: userId },
  });

  if (existingApplication) {
    const err = new Error("You have already applied for this job");
    err.statusCode = 400;
    throw err;
  }

  // Create application
  const application = await Application.create({
    job_id,
    user_id: userId,
    resume_id,
    cover_letter,
    status: "submitted",
  });

  return application;
};

/**
 * Get user applications
 */
const getUserApplications = async (userId, status = null) => {
  const whereClause = { user_id: userId };
  if (status) {
    whereClause.status = status;
  }

  const applications = await Application.findAll({
    where: whereClause,
    include: [
      {
        model: Job,
        as: "job",
        include: [
          {
            model: User,
            as: "recruiter",
            attributes: ["id", "full_name", "email"],
          },
        ],
      },
      {
        model: Resume,
        as: "resume",
        attributes: ["id", "file_name"],
      },
    ],
    order: [["created_at", "DESC"]],
  });

  return applications;
};

/**
 * Get application by ID
 */
const getApplicationById = async (applicationId, userId = null) => {
  const application = await Application.findByPk(applicationId, {
    include: [
      {
        model: Job,
        as: "job",
        include: [
          {
            model: User,
            as: "recruiter",
            attributes: ["id", "full_name", "email", "phone"],
          },
        ],
      },
      {
        model: User,
        as: "candidate",
        attributes: ["id", "full_name", "email", "phone"],
      },
      {
        model: Resume,
        as: "resume",
      },
    ],
  });

  if (!application) {
    const err = new Error("Application not found");
    err.statusCode = 404;
    throw err;
  }

  // Check access permission
  if (
    userId &&
    application.user_id !== userId &&
    application.job.user_id !== userId
  ) {
    const err = new Error("Unauthorized to view this application");
    err.statusCode = 403;
    throw err;
  }

  return application;
};

/**
 * Get job applications (for recruiter)
 */
const getJobApplications = async (jobId, recruiterId) => {
  // Verify job ownership
  const job = await Job.findByPk(jobId);
  if (!job) {
    const err = new Error("Job not found");
    err.statusCode = 404;
    throw err;
  }

  if (job.user_id !== recruiterId) {
    const err = new Error("Unauthorized to view applications for this job");
    err.statusCode = 403;
    throw err;
  }

  const applications = await Application.findAll({
    where: { job_id: jobId },
    include: [
      {
        model: User,
        as: "candidate",
        attributes: ["id", "full_name", "email", "phone"],
      },
      {
        model: Resume,
        as: "resume",
      },
    ],
    order: [["created_at", "DESC"]],
  });

  return applications;
};

/**
 * Update application status (recruiter only)
 */
const updateApplicationStatus = async (
  applicationId,
  recruiterId,
  status,
  notes = null
) => {
  const application = await Application.findByPk(applicationId, {
    include: [
      {
        model: Job,
        as: "job",
      },
    ],
  });

  if (!application) {
    const err = new Error("Application not found");
    err.statusCode = 404;
    throw err;
  }

  // Check if recruiter owns the job
  if (application.job.user_id !== recruiterId) {
    const err = new Error("Unauthorized to update this application");
    err.statusCode = 403;
    throw err;
  }

  const allowedStatuses = [
    "submitted",
    "pending",
    "reviewing",
    "shortlisted",
    "interviewed",
    "offered",
    "rejected",
    "withdrawn",
  ];

  if (!allowedStatuses.includes(status)) {
    const err = new Error("Invalid application status");
    err.statusCode = 400;
    throw err;
  }

  application.status = status;
  application.reviewed_at = new Date();
  if (notes) {
    application.notes = notes;
  }

  await application.save();

  return application;
};

/**
 * Withdraw application (candidate only)
 */
const withdrawApplication = async (applicationId, userId) => {
  const application = await Application.findByPk(applicationId);

  if (!application) {
    const err = new Error("Application not found");
    err.statusCode = 404;
    throw err;
  }

  if (application.user_id !== userId) {
    const err = new Error("Unauthorized to withdraw this application");
    err.statusCode = 403;
    throw err;
  }

  if (["rejected", "withdrawn", "offered"].includes(application.status)) {
    const err = new Error("Application cannot be withdrawn");
    err.statusCode = 400;
    throw err;
  }

  application.status = "withdrawn";
  await application.save();

  return application;
};

module.exports = {
  createApplication,
  getUserApplications,
  getApplicationById,
  getJobApplications,
  updateApplicationStatus,
  withdrawApplication,
};
