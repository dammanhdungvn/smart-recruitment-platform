const { Resume, User } = require("../models");
const fs = require("fs");
const path = require("path");

const PAGE_SIZE = 60;

/**
 * Upload resume
 */
const uploadResume = async (userId, fileData, metadata = {}) => {
  // Set other resumes as non-primary if this is primary
  if (metadata.is_primary) {
    await Resume.update({ is_primary: false }, { where: { user_id: userId } });
  }

  const resume = await Resume.create({
    user_id: userId,
    file_name: fileData.originalname,
    file_path: fileData.path,
    file_size: fileData.size,
    category: metadata.category,
    resume_text: metadata.resume_text,
    is_primary: metadata.is_primary || false,
  });

  return resume;
};

/**
 * Get user resumes
 */
const getUserResumes = async (userId, options = {}) => {
  const page = options.page || 1;
  const limit = PAGE_SIZE;
  const offset = (page - 1) * limit;

  const result = await Resume.findAndCountAll({
    where: { user_id: userId },
    order: [
      ["is_primary", "DESC"],
      ["created_at", "DESC"],
    ],
    limit,
    offset,
  });

  return { rows: result.rows, count: result.count, page, limit };
};

/**
 * Get resume by ID
 */
const getResumeById = async (resumeId, userId) => {
  const resume = await Resume.findOne({
    where: { id: resumeId, user_id: userId },
  });

  if (!resume) {
    throw new Error("Resume not found");
  }

  return resume;
};

/**
 * Delete resume
 */
const deleteResume = async (resumeId, userId) => {
  const resume = await Resume.findOne({
    where: { id: resumeId, user_id: userId },
  });

  if (!resume) {
    throw new Error("Resume not found");
  }

  // Delete file from filesystem
  try {
    if (fs.existsSync(resume.file_path)) {
      fs.unlinkSync(resume.file_path);
    }
  } catch (error) {
    console.error("Error deleting file:", error);
  }

  await resume.destroy();

  return true;
};

/**
 * Set primary resume
 */
const setPrimaryResume = async (resumeId, userId) => {
  const resume = await Resume.findOne({
    where: { id: resumeId, user_id: userId },
  });

  if (!resume) {
    throw new Error("Resume not found");
  }

  // Set all resumes as non-primary
  await Resume.update({ is_primary: false }, { where: { user_id: userId } });

  // Set this resume as primary
  resume.is_primary = true;
  await resume.save();

  return resume;
};

/**
 * Get primary resume
 */
const getPrimaryResume = async (userId) => {
  const resume = await Resume.findOne({
    where: { user_id: userId, is_primary: true },
  });

  return resume;
};

module.exports = {
  uploadResume,
  getUserResumes,
  getResumeById,
  deleteResume,
  setPrimaryResume,
  getPrimaryResume,
};
