const { User } = require("../models");
const { hashPassword, comparePassword } = require("../utils/password.util");
const { generateToken } = require("../utils/jwt.util");

/**
 * Register new user
 */
const register = async (userData) => {
  const { email, password, full_name, role, phone, company } = userData;

  // Check if email already exists
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error("Email already registered");
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user
  const user = await User.create({
    email,
    password: hashedPassword,
    full_name,
    role: role || "candidate",
    phone,
    company,
  });

  // Remove password from response
  const userResponse = user.toJSON();
  delete userResponse.password;

  // Generate token
  const token = generateToken({ userId: user.id, role: user.role });

  return { user: userResponse, token };
};

/**
 * Login user
 */
const login = async (email, password) => {
  // Find user by email
  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Check if user is active
  if (!user.is_active) {
    throw new Error("Account is inactive");
  }

  // Compare password
  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  // Remove password from response
  const userResponse = user.toJSON();
  delete userResponse.password;

  // Generate token
  const token = generateToken({ userId: user.id, role: user.role });

  return { user: userResponse, token };
};

/**
 * Get user profile
 */
const getProfile = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ["password"] },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

/**
 * Update user profile
 */
const updateProfile = async (userId, updateData) => {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error("User not found");
  }

  // Update allowed fields
  const allowedFields = ["full_name", "phone", "avatar"];
  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      user[field] = updateData[field];
    }
  });

  await user.save();

  const userResponse = user.toJSON();
  delete userResponse.password;

  return userResponse;
};

/**
 * Change password
 */
const changePassword = async (userId, oldPassword, newPassword) => {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error("User not found");
  }

  // Verify old password
  const isPasswordValid = await comparePassword(oldPassword, user.password);

  if (!isPasswordValid) {
    throw new Error("Current password is incorrect");
  }

  // Hash new password
  user.password = await hashPassword(newPassword);
  await user.save();

  return true;
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
};
