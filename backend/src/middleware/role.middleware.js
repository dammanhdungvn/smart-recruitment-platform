const { sendErrorResponse } = require("../utils/response.util");

/**
 * Check if user has required role
 */
const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendErrorResponse(res, "Unauthorized", 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendErrorResponse(
        res,
        "Access denied. Insufficient permissions",
        403
      );
    }

    next();
  };
};

/**
 * Require specific role(s) - alias for tests
 */
const requireRole = (roles) => {
  const allowedRoles = Array.isArray(roles) ? roles : [roles];

  return (req, res, next) => {
    if (!req.user) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Insufficient permissions.",
      });
    }

    // Admin has access to everything
    if (req.user.role === "admin") {
      return next();
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Insufficient permissions.",
      });
    }

    next();
  };
};

module.exports = { checkRole, requireRole };
