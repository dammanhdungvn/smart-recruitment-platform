const express = require("express");
const router = express.Router();
const applicationController = require("../controllers/application.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { checkRole } = require("../middleware/role.middleware");
const { validate } = require("../middleware/validation.middleware");
const {
  createApplicationValidator,
  updateApplicationStatusValidator,
} = require("../validators/application.validator");

/**
 * @swagger
 * tags:
 *   name: Applications
 *   description: Job application management
 */

/**
 * @swagger
 * /api/applications:
 *   post:
 *     summary: Apply to a job
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [job_id, resume_id]
 *             properties:
 *               job_id:
 *                 type: integer
 *               resume_id:
 *                 type: integer
 *               cover_letter:
 *                 type: string
 *     responses:
 *       201:
 *         description: Application created
 *       400:
 *         description: Validation error or job not open
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

// Candidate routes
router.post(
  "/",
  authenticate,
  checkRole("candidate", "admin"),
  createApplicationValidator,
  validate,
  applicationController.createApplication
);

/**
 * @swagger
 * /api/applications:
 *   get:
 *     summary: Get applications of current candidate
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, reviewing, shortlisted, interviewed, offered, rejected, withdrawn]
 *     responses:
 *       200:
 *         description: Applications retrieved
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get(
  "/",
  authenticate,
  checkRole("candidate", "admin"),
  applicationController.getUserApplications
);

/**
 * @swagger
 * /api/applications/{id}/withdraw:
 *   patch:
 *     summary: Withdraw an application
 *     tags: [Applications]
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
 *         description: Application withdrawn
 *       400:
 *         description: Cannot withdraw
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Application not found
 */
router.patch(
  "/:id/withdraw",
  authenticate,
  checkRole("candidate", "admin"),
  applicationController.withdrawApplication
);

/**
 * @swagger
 * /api/applications/job/{jobId}:
 *   get:
 *     summary: Get applications for a job (owner recruiter/admin)
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Applications retrieved
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Job not found
 */
// Recruiter routes
router.get(
  "/job/:jobId",
  authenticate,
  checkRole("recruiter", "admin"),
  applicationController.getJobApplications
);

/**
 * @swagger
 * /api/applications/{id}/status:
 *   patch:
 *     summary: Update application status
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, reviewing, shortlisted, interviewed, offered, rejected, withdrawn]
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Application status updated
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Application not found
 */
router.patch(
  "/:id/status",
  authenticate,
  checkRole("recruiter", "admin"),
  updateApplicationStatusValidator,
  validate,
  applicationController.updateApplicationStatus
);

/**
 * @swagger
 * /api/applications/{id}:
 *   get:
 *     summary: Get application by id (owner candidate or job owner recruiter)
 *     tags: [Applications]
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
 *         description: Application retrieved
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Application not found
 */
router.get("/:id", authenticate, applicationController.getApplicationById);

module.exports = router;
