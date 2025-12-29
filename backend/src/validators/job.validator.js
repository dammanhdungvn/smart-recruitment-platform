const { body } = require("express-validator");

const createJobValidator = [
  body("job_title")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("Job title is too long"),
  body("title")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("Job title is too long")
    .custom((value, { req }) => {
      if (!value && !req.body.job_title) {
        throw new Error("Job title is required");
      }
      return true;
    }),
  body("job_type")
    .optional()
    .isIn(["full-time", "part-time", "contract", "internship", "freelance"])
    .withMessage("Invalid job type"),
  body("position_level")
    .optional()
    .isIn([
      "intern",
      "fresher",
      "junior",
      "middle",
      "senior",
      "lead",
      "manager",
      "director",
    ])
    .withMessage("Invalid position level"),
  body("city").optional().trim(),
  body("location")
    .optional()
    .trim()
    .custom((value, { req }) => {
      if (!value && !req.body.city) {
        throw new Error("Location/city is required");
      }
      return true;
    }),
  body("salary_min")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Minimum salary must be a positive number"),
  body("salary_max")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Maximum salary must be a positive number")
    .custom((value, { req }) => {
      if (req.body.salary_min && value < req.body.salary_min) {
        throw new Error("Maximum salary must be greater than minimum salary");
      }
      return true;
    }),
  body("status")
    .optional()
    .isIn(["open", "closed", "draft"])
    .withMessage("Invalid status"),
];

const updateJobStatusValidator = [
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["open", "closed", "draft"])
    .withMessage("Invalid status"),
];

module.exports = {
  createJobValidator,
  updateJobStatusValidator,
};
