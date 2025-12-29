const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { validate } = require("../middleware/validation.middleware");
const {
  registerValidator,
  loginValidator,
  changePasswordValidator,
} = require("../validators/auth.validator");

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, full_name, role]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *               full_name: { type: string }
 *               role: { type: string, enum: [candidate, recruiter] }
 *               phone: { type: string }
 *               company: { type: string }
 *     responses:
 *       201: { description: User registered }
 */
router.post("/register", registerValidator, validate, authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200: { description: Login successful }
 */
router.post("/login", loginValidator, validate, authController.login);

// Protected routes
/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     tags: [Auth]
 *     summary: Get user profile
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Profile retrieved }
 */
router.get("/profile", authenticate, authController.getProfile);

/**
 * @swagger
 * /api/auth/profile:
 *   put:
 *     tags: [Auth]
 *     summary: Update user profile
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Profile updated }
 */
router.put("/profile", authenticate, authController.updateProfile);
router.post(
  "/change-password",
  authenticate,
  changePasswordValidator,
  validate,
  authController.changePassword
);

module.exports = router;
