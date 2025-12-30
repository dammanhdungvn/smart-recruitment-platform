const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",

  jwt: {
    secret: process.env.JWT_SECRET || "default_secret_key",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  },

  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB
    uploadPath: process.env.UPLOAD_PATH || "uploads/resumes",
    allowedTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
  },
};
