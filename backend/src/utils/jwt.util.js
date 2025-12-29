const jwt = require("jsonwebtoken");
const config = require("../config/config");

/**
 * Generate JWT access token
 */
const generateToken = (payload, expiresIn) => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: expiresIn || config.jwt.expiresIn,
  });
};

/**
 * Verify JWT token
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwt.secret);
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
