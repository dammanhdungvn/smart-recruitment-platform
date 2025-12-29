/**
 * Send success response
 */
const sendSuccessResponse = (
  res,
  data = null,
  message = "Success",
  statusCode = 200
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Send error response
 */
const sendErrorResponse = (
  res,
  message = "Error",
  statusCode = 500,
  errors = null
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};

module.exports = {
  sendSuccessResponse,
  sendErrorResponse,
};
