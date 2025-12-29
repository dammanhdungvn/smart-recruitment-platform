const express = require("express");
const router = express.Router();

const authRoutes = require("./auth.routes");
const jobRoutes = require("./job.routes");
const resumeRoutes = require("./resume.routes");
const applicationRoutes = require("./application.routes");

// Mount routes
router.use("/auth", authRoutes);
router.use("/jobs", jobRoutes);
router.use("/resumes", resumeRoutes);
router.use("/applications", applicationRoutes);

module.exports = router;
