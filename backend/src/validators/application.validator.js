const { body } = require("express-validator");

const createApplicationValidator = [
  body("job_id")
    .notEmpty()
    .withMessage("Job ID is required")
    .isInt({ min: 1 })
    .withMessage("Invalid job ID"),
  body("resume_id")
    .notEmpty()
    .withMessage("Resume ID is required")
    .isInt({ min: 1 })
    .withMessage("Invalid resume ID"),
  body("cover_letter")
    .optional()
    .isLength({ max: 5000 })
    .withMessage("Cover letter is too long"),
];

const updateApplicationStatusValidator = [
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn([
      "pending",
      "reviewing",
      "shortlisted",
      "interviewed",
      "offered",
      "rejected",
      "withdrawn",
    ])
    .withMessage("Invalid status"),
  body("notes")
    .optional()
    .isLength({ max: 2000 })
    .withMessage("Notes are too long"),
];

module.exports = {
  createApplicationValidator,
  updateApplicationStatusValidator,
};
