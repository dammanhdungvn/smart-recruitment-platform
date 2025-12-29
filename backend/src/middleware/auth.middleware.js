const { verifyToken } = require("../utils/jwt.util");
const { sendErrorResponse } = require("../utils/response.util");
const { User } = require("../models");

/**
 * Authenticate JWT token
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return sendErrorResponse(res, "No token provided", 401);
    }

    const token = authHeader.substring(7);

    // Verify token
    const decoded = verifyToken(token);

    // Get user from database
    const user = await User.findByPk(decoded.userId, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return sendErrorResponse(res, "User not found", 404);
    }

    if (!user.is_active) {
      return sendErrorResponse(res, "User account is inactive", 403);
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    return sendErrorResponse(
      res,
      error.message || "Authentication failed",
      401
    );
  }
};

/**
 * Authenticate JWT token (alias for tests)
 */
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Access token is missing",
      });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Invalid token format",
      });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    const user = await User.findByPk(decoded.userId, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.is_active === false) {
      return res.status(401).json({
        success: false,
        message: "User account is inactive",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message || "Invalid token",
    });
  }
};

/**
 * Optional authentication - doesn't fail if no token
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      req.user = undefined;
      return next();
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    const user = await User.findByPk(decoded.userId, {
      attributes: { exclude: ["password"] },
    });

    if (user && user.is_active) {
      req.user = user;
    } else {
      req.user = undefined;
    }

    next();
  } catch (error) {
    // Continue without user if token is invalid
    req.user = undefined;
    next();
  }
};

module.exports = { authenticate, authenticateToken, optionalAuth };
