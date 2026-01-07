const express = require("express");
const router = express.Router();
const jobController = require("../controllers/job.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { checkRole } = require("../middleware/role.middleware");
const { validate } = require("../middleware/validation.middleware");
const {
  createJobValidator,
  updateJobStatusValidator,
} = require("../validators/job.validator");

/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: Job management
 */

/**
 * @swagger
 * /api/jobs:
 *   get:
 *     summary: Get public job list (status=open)
 *     tags: [Jobs]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number (default 1)
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *       - in: query
 *         name: job_type
 *         schema:
 *           type: string
 *           enum: [full-time, part-time, contract, internship, freelance]
 *       - in: query
 *         name: position_level
 *         schema:
 *           type: string
 *           enum: [intern, fresher, junior, middle, senior, lead, manager, director]
 *       - in: query
 *         name: job_fields
 *         schema:
 *           type: string
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: skills
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Jobs retrieved successfully
 *       400:
 *         description: Invalid query
 */

/**
 * @swagger
 * /api/jobs/categories:
 *   get:
 *     summary: Get distinct job categories
 *     tags: [Jobs]
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/jobs/{id}:
 *   get:
 *     summary: Get job by id
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Job retrieved
 *       404:
 *         description: Job not found
 */

// Public routes
router.get("/", jobController.getAllJobs);
router.get("/categories", jobController.getJobCategories);
router.get("/:id", jobController.getJobById);

/**
 * @swagger
 * /api/jobs:
 *   post:
 *     summary: Create job
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               job_title:
 *                 type: string
 *               title:
 *                 type: string
 *               city:
 *                 type: string
 *               location:
 *                 type: string
 *               job_type:
 *                 type: string
 *                 enum: [full-time, part-time, contract, internship, freelance]
 *               position_level:
 *                 type: string
 *                 enum: [intern, fresher, junior, middle, senior, lead, manager, director]
 *               job_fields:
 *                 type: string
 *               category:
 *                 type: string
 *               experience:
 *                 type: string
 *               skills:
 *                 type: string
 *               description:
 *                 type: string
 *               requirements:
 *                 type: string
 *               benefits:
 *                 type: string
 *               salary_min:
 *                 type: number
 *               salary_max:
 *                 type: number
 *               unit:
 *                 type: string
 *                 enum: [VND, USD]
 *               status:
 *                 type: string
 *                 enum: [open, closed, draft]
 *               deadline:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Job created
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

// Recruiter routes
router.post(
  "/",
  authenticate,
  checkRole("recruiter", "admin"),
  createJobValidator,
  validate,
  jobController.createJob
);

/**
 * @swagger
 * /api/jobs/my/jobs:
 *   get:
 *     summary: Get jobs created by current recruiter (paginated)
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number (default 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Page size (default 20)
 *     responses:
 *       200:
 *         description: Jobs retrieved
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get(
  "/my/jobs",
  authenticate,
  checkRole("recruiter", "admin"),
  jobController.getMyJobs
);

/**
 * @swagger
 * /api/jobs/{id}:
 *   put:
 *     summary: Update job
 *     tags: [Jobs]
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
 *             properties:
 *               job_title:
 *                 type: string
 *               title:
 *                 type: string
 *               city:
 *                 type: string
 *               location:
 *                 type: string
 *               job_type:
 *                 type: string
 *                 enum: [full-time, part-time, contract, internship, freelance]
 *               position_level:
 *                 type: string
 *                 enum: [intern, fresher, junior, middle, senior, lead, manager, director]
 *               job_fields:
 *                 type: string
 *               category:
 *                 type: string
 *               experience:
 *                 type: string
 *               skills:
 *                 type: string
 *               description:
 *                 type: string
 *               requirements:
 *                 type: string
 *               benefits:
 *                 type: string
 *               salary_min:
 *                 type: number
 *               salary_max:
 *                 type: number
 *               unit:
 *                 type: string
 *                 enum: [VND, USD]
 *               status:
 *                 type: string
 *                 enum: [open, closed, draft]
 *               deadline:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Job updated
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Job not found
 */
router.put(
  "/:id",
  authenticate,
  checkRole("recruiter", "admin"),
  createJobValidator,
  validate,
  jobController.updateJob
);

/**
 * @swagger
 * /api/jobs/{id}:
 *   delete:
 *     summary: Delete job
 *     tags: [Jobs]
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
 *         description: Job deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Job not found
 */
router.delete(
  "/:id",
  authenticate,
  checkRole("recruiter", "admin"),
  jobController.deleteJob
);

/**
 * @swagger
 * /api/jobs/{id}/status:
 *   patch:
 *     summary: Update job status
 *     tags: [Jobs]
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
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [open, closed, draft]
 *             required: [status]
 *     responses:
 *       200:
 *         description: Job status updated
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Job not found
 */
router.patch(
  "/:id/status",
  authenticate,
  checkRole("recruiter", "admin"),
  updateJobStatusValidator,
  validate,
  jobController.updateJobStatus
);

module.exports = router;
