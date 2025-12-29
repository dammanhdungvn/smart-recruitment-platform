const resumeService = require("../services/resume.service");
const {
  sendSuccessResponse,
  sendErrorResponse,
} = require("../utils/response.util");

/**
 * Upload resume
 */
const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return sendErrorResponse(res, "No file uploaded", 400);
    }

    const metadata = {
      category: req.body.category,
      resume_text: req.body.resume_text,
      is_primary: req.body.is_primary === "true",
    };

    const resume = await resumeService.uploadResume(
      req.user.id,
      req.file,
      metadata
    );
    sendSuccessResponse(res, { resume }, "Resume uploaded successfully", 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Get user resumes
 */
const getUserResumes = async (req, res, next) => {
  try {
    const pageParam = req.query.page;
    let page = 1;

    if (pageParam !== undefined) {
      const parsedPage = Number.parseInt(pageParam, 10);
      if (Number.isNaN(parsedPage)) {
        return sendErrorResponse(res, "Invalid page parameter", 400);
      }
      page = parsedPage < 1 ? 1 : parsedPage;
    }

    const { rows, count, limit } = await resumeService.getUserResumes(
      req.user.id,
      { page }
    );
    sendSuccessResponse(
      res,
      {
        resumes: rows,
        count,
        pagination: {
          page,
          limit,
          total: count,
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
 * Get resume by ID
 */
const getResumeById = async (req, res, next) => {
  try {
    const resume = await resumeService.getResumeById(
      req.params.id,
      req.user.id
    );
    sendSuccessResponse(res, { resume }, "Resume retrieved successfully");
  } catch (error) {
    if (error.message === "Resume not found") {
      return sendErrorResponse(res, error.message, 404);
    }
    next(error);
  }
};

/**
 * Delete resume
 */
const deleteResume = async (req, res, next) => {
  try {
    await resumeService.deleteResume(req.params.id, req.user.id);
    sendSuccessResponse(res, null, "Resume deleted successfully");
  } catch (error) {
    if (error.message === "Resume not found") {
      return sendErrorResponse(res, error.message, 404);
    }
    next(error);
  }
};

/**
 * Set primary resume
 */
const setPrimaryResume = async (req, res, next) => {
  try {
    const resume = await resumeService.setPrimaryResume(
      req.params.id,
      req.user.id
    );
    sendSuccessResponse(res, { resume }, "Primary resume set successfully");
  } catch (error) {
    if (error.message === "Resume not found") {
      return sendErrorResponse(res, error.message, 404);
    }
    next(error);
  }
};

const getPrimaryResume = async (req, res, next) => {
  try {
    const resume = await resumeService.getPrimaryResume(req.user.id);
    if (!resume) {
      return sendErrorResponse(res, "Resume not found", 404);
    }
    sendSuccessResponse(
      res,
      { resume },
      "Primary resume retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadResume,
  getUserResumes,
  getResumeById,
  deleteResume,
  setPrimaryResume,
  getPrimaryResume,
};
