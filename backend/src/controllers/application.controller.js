const applicationService = require("../services/application.service");
const {
  sendSuccessResponse,
  sendErrorResponse,
} = require("../utils/response.util");

/**
 * Create application (candidate)
 */
const createApplication = async (req, res, next) => {
  try {
    const application = await applicationService.createApplication(
      req.user.id,
      req.body
    );
    sendSuccessResponse(
      res,
      { application },
      "Application submitted successfully",
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get user applications (candidate)
 */
const getUserApplications = async (req, res, next) => {
  try {
    const applications = await applicationService.getUserApplications(
      req.user.id
    );
    sendSuccessResponse(
      res,
      { applications, count: applications.length },
      "Applications retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get application by ID
 */
const getApplicationById = async (req, res, next) => {
  try {
    const application = await applicationService.getApplicationById(
      req.params.id,
      req.user.id
    );
    sendSuccessResponse(
      res,
      { application },
      "Application retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get job applications (recruiter)
 */
const getJobApplications = async (req, res, next) => {
  try {
    const applications = await applicationService.getJobApplications(
      req.params.jobId,
      req.user.id
    );
    sendSuccessResponse(
      res,
      { applications, count: applications.length },
      "Applications retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Update application status (recruiter)
 */
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    const application = await applicationService.updateApplicationStatus(
      req.params.id,
      req.user.id,
      status,
      notes
    );
    sendSuccessResponse(
      res,
      { application },
      "Application status updated successfully"
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Withdraw application (candidate)
 */
const withdrawApplication = async (req, res, next) => {
  try {
    const application = await applicationService.withdrawApplication(
      req.params.id,
      req.user.id
    );
    sendSuccessResponse(
      res,
      { application },
      "Application withdrawn successfully"
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createApplication,
  getUserApplications,
  getApplicationById,
  getJobApplications,
  updateApplicationStatus,
  withdrawApplication,
};
