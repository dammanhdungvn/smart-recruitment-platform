const authService = require("../services/auth.service");
const {
  sendSuccessResponse,
  sendErrorResponse,
} = require("../utils/response.util");

/**
 * Register new user
 */
const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    sendSuccessResponse(res, result, "Registration successful", 201);
  } catch (error) {
    // Handle duplicate email with 409 status
    if (error.message === "Email already registered") {
      return sendErrorResponse(res, error.message, 409);
    }
    next(error);
  }
};

/**
 * Login user
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    sendSuccessResponse(res, result, "Login successful");
  } catch (error) {
    // Handle authentication errors with 401 status
    if (
      error.message === "Invalid email or password" ||
      error.message === "Account is inactive"
    ) {
      return sendErrorResponse(res, error.message, 401);
    }
    next(error);
  }
};

/**
 * Get user profile
 */
const getProfile = async (req, res, next) => {
  try {
    const user = await authService.getProfile(req.user.id);
    sendSuccessResponse(res, { user }, "Profile retrieved successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * Update user profile
 */
const updateProfile = async (req, res, next) => {
  try {
    const user = await authService.updateProfile(req.user.id, req.body);
    sendSuccessResponse(res, { user }, "Profile updated successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * Change password
 */
const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, currentPassword, newPassword } = req.body;
    const password = oldPassword || currentPassword;
    await authService.changePassword(req.user.id, password, newPassword);
    sendSuccessResponse(res, null, "Password changed successfully");
  } catch (error) {
    // Handle authentication errors with 400 status for incorrect password
    if (error.message === "Current password is incorrect") {
      return sendErrorResponse(res, error.message, 400);
    }
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
};
