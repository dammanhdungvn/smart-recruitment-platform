const { validationResult } = require("express-validator");
const { sendErrorResponse } = require("../utils/response.util");

/**
 * Validate request based on express-validator rules
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return sendErrorResponse(
      res,
      "Validation failed",
      400,
      errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      }))
    );
  }

  next();
};

module.exports = { validate };
