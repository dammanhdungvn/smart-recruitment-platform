const { User, Job, Resume, Application } = require("../models");
const { Op } = require("sequelize");
const {
  sendSuccessResponse,
  sendErrorResponse,
} = require("../utils/response.util");

/**
 * Get admin statistics
 */
const getStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalJobs,
      totalResumes,
      totalApplications,
      activeJobs,
      pendingApplications,
    ] = await Promise.all([
      User.count(),
      Job.count(),
      Resume.count(),
      Application.count(),
      Job.count({ where: { status: "open" } }),
      Application.count({ where: { status: "pending" } }),
    ]);

    const stats = {
      users: {
        total: totalUsers,
        candidates: await User.count({ where: { role: "candidate" } }),
        recruiters: await User.count({ where: { role: "recruiter" } }),
      },
      jobs: {
        total: totalJobs,
        active: activeJobs,
        closed: totalJobs - activeJobs,
      },
      resumes: {
        total: totalResumes,
      },
      applications: {
        total: totalApplications,
        pending: pendingApplications,
        accepted: await Application.count({ where: { status: "accepted" } }),
        rejected: await Application.count({ where: { status: "rejected" } }),
      },
    };

    sendSuccessResponse(res, stats, "Statistics retrieved successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * Get all users with pagination
 */
const getAllUsers = async (req, res, next) => {
  try {
    const page = Number.parseInt(req.query.page, 10) || 1;
    const limit = Number.parseInt(req.query.limit, 10) || 20;
    const offset = (page - 1) * limit;
    const role = req.query.role;
    const search = req.query.search;

    const where = {};
    if (role) {
      where.role = role;
    }
    if (search) {
      where[Op.or] = [
        { full_name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }

    const { count, rows } = await User.findAndCountAll({
      where,
      attributes: { exclude: ["password"] },
      limit,
      offset,
      order: [["created_at", "DESC"]],
    });

    sendSuccessResponse(
      res,
      {
        users: rows,
        pagination: {
          total: count,
          page,
          limit,
          totalPages: Math.ceil(count / limit),
        },
      },
      "Users retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Update user status (active/inactive)
 */
const updateUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return sendErrorResponse(res, "User not found", 404);
    }

    // Prevent admin from deactivating themselves
    if (user.id === req.user.id) {
      return sendErrorResponse(res, "Cannot modify your own account", 400);
    }

    user.is_active = is_active;
    await user.save();

    const userResponse = user.toJSON();
    delete userResponse.password;

    sendSuccessResponse(
      res,
      { user: userResponse },
      "User status updated successfully"
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Update user role
 */
const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["candidate", "recruiter", "admin"].includes(role)) {
      return sendErrorResponse(res, "Invalid role value", 400);
    }

    const user = await User.findByPk(id);
    if (!user) {
      return sendErrorResponse(res, "User not found", 404);
    }

    // Prevent admin from changing their own role
    if (user.id === req.user.id) {
      return sendErrorResponse(res, "Cannot modify your own role", 400);
    }

    user.role = role;
    await user.save();

    const userResponse = user.toJSON();
    delete userResponse.password;

    sendSuccessResponse(
      res,
      { user: userResponse },
      "User role updated successfully"
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user
 */
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return sendErrorResponse(res, "User not found", 404);
    }

    // Prevent admin from deleting themselves
    if (user.id === req.user.id) {
      return sendErrorResponse(res, "Cannot delete your own account", 400);
    }

    await user.destroy();

    sendSuccessResponse(res, null, "User deleted successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * Get all jobs with pagination
 */
const getAllJobs = async (req, res, next) => {
  try {
    const page = Number.parseInt(req.query.page, 10) || 1;
    const limit = Number.parseInt(req.query.limit, 10) || 20;
    const offset = (page - 1) * limit;
    const status = req.query.status;

    const where = {};
    if (status) {
      where.status = status;
    }

    const { count, rows } = await Job.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: "recruiter",
          attributes: ["id", "full_name", "email", "company"],
        },
      ],
      limit,
      offset,
      order: [["created_at", "DESC"]],
    });

    sendSuccessResponse(
      res,
      {
        jobs: rows,
        pagination: {
          total: count,
          page,
          limit,
          totalPages: Math.ceil(count / limit),
        },
      },
      "Jobs retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Delete job
 */
const deleteJob = async (req, res, next) => {
  try {
    const { id } = req.params;

    const job = await Job.findByPk(id);
    if (!job) {
      return sendErrorResponse(res, "Job not found", 404);
    }

    await job.destroy();

    sendSuccessResponse(res, null, "Job deleted successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * Get all resumes with pagination
 */
const getAllResumes = async (req, res, next) => {
  try {
    const page = Number.parseInt(req.query.page, 10) || 1;
    const limit = Number.parseInt(req.query.limit, 10) || 20;
    const offset = (page - 1) * limit;

    const { count, rows } = await Resume.findAndCountAll({
      include: [
        {
          model: User,
          as: "candidate",
          attributes: ["id", "full_name", "email"],
        },
      ],
      limit,
      offset,
      order: [["created_at", "DESC"]],
    });

    sendSuccessResponse(
      res,
      {
        resumes: rows,
        pagination: {
          total: count,
          page,
          limit,
          totalPages: Math.ceil(count / limit),
        },
      },
      "Resumes retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Delete resume
 */
const deleteResume = async (req, res, next) => {
  try {
    const { id } = req.params;

    const resume = await Resume.findByPk(id);
    if (!resume) {
      return sendErrorResponse(res, "Resume not found", 404);
    }

    await resume.destroy();

    sendSuccessResponse(res, null, "Resume deleted successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * Update resume status
 */
const updateResumeStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return sendErrorResponse(res, "Invalid status value", 400);
    }

    const resume = await Resume.findByPk(id);
    if (!resume) {
      return sendErrorResponse(res, "Resume not found", 404);
    }

    resume.status = status;
    await resume.save();

    sendSuccessResponse(res, { resume }, "Resume status updated successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * Get all applications with pagination
 */
const getAllApplications = async (req, res, next) => {
  try {
    const page = Number.parseInt(req.query.page, 10) || 1;
    const limit = Number.parseInt(req.query.limit, 10) || 20;
    const offset = (page - 1) * limit;
    const status = req.query.status;

    const where = {};
    if (status) {
      where.status = status;
    }

    const { count, rows } = await Application.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: "candidate",
          attributes: ["id", "full_name", "email"],
        },
        {
          model: Job,
          as: "job",
          attributes: ["id", "job_title", "status"],
          include: [
            {
              model: User,
              as: "recruiter",
              attributes: ["id", "full_name", "email", "company"],
            },
          ],
        },
        {
          model: Resume,
          as: "resume",
          attributes: ["id", "file_name"],
        },
      ],
      limit,
      offset,
      order: [["created_at", "DESC"]],
    });

    sendSuccessResponse(
      res,
      {
        applications: rows,
        pagination: {
          total: count,
          page,
          limit,
          totalPages: Math.ceil(count / limit),
        },
      },
      "Applications retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStats,
  getAllUsers,
  updateUserStatus,
  updateUserRole,
  deleteUser,
  getAllJobs,
  deleteJob,
  getAllResumes,
  updateResumeStatus,
  deleteResume,
  getAllApplications,
};
