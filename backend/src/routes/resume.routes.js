const express = require("express");
const router = express.Router();
const resumeController = require("../controllers/resume.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { checkRole } = require("../middleware/role.middleware");
const { uploadResume } = require("../middleware/upload.middleware");

/**
 * @swagger
 * tags:
 *   name: Resumes
 *   description: Resume management
 */

/**
 * @swagger
 * /api/resumes/upload:
 *   post:
 *     summary: Upload resume
 *     tags: [Resumes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               resume:
 *                 type: string
 *                 format: binary
 *                 description: PDF resume file
 *               category:
 *                 type: string
 *               resume_text:
 *                 type: string
 *               is_primary:
 *                 type: string
 *                 enum: ["true", "false"]
 *             required:
 *               - resume
 *     responses:
 *       201:
 *         description: Resume uploaded
 *       400:
 *         description: Missing file or validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

// All routes require authentication and candidate role
router.use(authenticate);
router.use(checkRole("candidate", "admin"));

router.post("/upload", uploadResume, resumeController.uploadResume);

/**
 * @swagger
 * /api/resumes:
 *   get:
 *     summary: Get resumes of current user
 *     tags: [Resumes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Resumes retrieved
 *       400:
 *         description: Invalid page
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get("/", resumeController.getUserResumes);

/**
 * @swagger
 * /api/resumes/primary:
 *   get:
 *     summary: Get primary resume of current user
 *     tags: [Resumes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Primary resume retrieved
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Resume not found
 */
router.get("/primary", resumeController.getPrimaryResume);

/**
 * @swagger
 * /api/resumes/{id}/primary:
 *   put:
 *     summary: Set primary resume
 *     tags: [Resumes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Primary resume set
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Resume not found
 */
router.put("/:id/primary", resumeController.setPrimaryResume);

/**
 * @swagger
 * /api/resumes/{id}:
 *   get:
 *     summary: Get resume by id (owned by current user)
 *     tags: [Resumes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Resume retrieved
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Resume not found
 */
router.get("/:id", resumeController.getResumeById);

/**
 * @swagger
 * /api/resumes/{id}:
 *   delete:
 *     summary: Delete resume
 *     tags: [Resumes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Resume deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Resume not found
 */
router.delete("/:id", resumeController.deleteResume);

module.exports = router;
