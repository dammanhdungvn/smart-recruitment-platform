# Tài Liệu Thiết Kế Backend - Hệ Thống Tuyển Dụng Thông Minh

## 📋 Mục Lục
1. [Tổng Quan](#1-tổng-quan)
2. [Công Nghệ Sử Dụng](#2-công-nghệ-sử-dụng)
3. [Cấu Trúc Thư Mục](#3-cấu-trúc-thư-mục)
4. [API Endpoints](#4-api-endpoints)
5. [Authentication & Authorization](#5-authentication--authorization)
6. [Models & Database](#6-models--database)
7. [Services & Business Logic](#7-services--business-logic)
8. [File Upload](#8-file-upload)
9. [Error Handling](#9-error-handling)
10. [Setup và Triển Khai](#10-setup-và-triển-khai)

---

## 1. Tổng Quan

Backend được xây dựng bằng **Node.js** với framework **Express.js**, cung cấp RESTful API cho Frontend và tích hợp với AI Service để xử lý các tác vụ Machine Learning.

### 1.1. Trách Nhiệm Chính
- Xử lý authentication & authorization
- CRUD operations cho tất cả entities
- Tích hợp với AI Service
- Quản lý file upload (CV)
- Business logic và validation
- Database operations

---

## 2. Công Nghệ Sử Dụng

```json
{
  "runtime": "Node.js 18+",
  "framework": "Express.js 4.x",
  "language": "JavaScript hoặc TypeScript",
  "database": "MySQL 8.0+",
  "database_client": "mysql2",
  "orm": "Sequelize (optional)",
  "authentication": "JWT (jsonwebtoken)",
  "password_hashing": "bcrypt",
  "validation": "express-validator hoặc Joi",
  "file_upload": "multer",
  "cors": "cors",
  "environment": "dotenv",
  "logging": "winston hoặc morgan",
  "api_docs": "swagger-jsdoc + swagger-ui-express"
}
```

### 2.1. Dependencies

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mysql2": "^3.6.5",
    "sequelize": "^6.35.0",
    "jsonwebtoken": "^9.0.2",
    "bcrypt": "^5.1.1",
    "express-validator": "^7.0.1",
    "joi": "^17.11.0",
    "multer": "^1.4.5-lts.1",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "winston": "^3.11.0",
    "morgan": "^1.10.0",
    "axios": "^1.6.2",
    "nodemailer": "^6.9.7",
    "swagger-jsdoc": "^6.2.8",
    "swagger-ui-express": "^5.0.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.2",
    "jest": "^29.7.0",
    "supertest": "^6.3.3",
    "@types/express": "^4.17.21",
    "@types/node": "^20.10.5"
  }
}
```

---

## 3. Cấu Trúc Thư Mục

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js          # Database connection
│   │   ├── config.js            # App configuration
│   │   └── swagger.js           # Swagger configuration
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── candidate.controller.js
│   │   ├── recruiter.controller.js
│   │   ├── admin.controller.js
│   │   ├── job.controller.js
│   │   ├── application.controller.js
│   │   └── notification.controller.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Candidate.js
│   │   ├── Company.js
│   │   ├── Job.js
│   │   ├── Resume.js
│   │   ├── Application.js
│   │   ├── Skill.js
│   │   ├── Interview.js
│   │   └── index.js             # Model associations
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── candidate.routes.js
│   │   ├── recruiter.routes.js
│   │   ├── admin.routes.js
│   │   ├── public.routes.js
│   │   └── index.js
│   ├── middleware/
│   │   ├── auth.middleware.js   # JWT verification
│   │   ├── role.middleware.js   # Role-based access
│   │   ├── validation.middleware.js
│   │   ├── upload.middleware.js # File upload
│   │   ├── error.middleware.js  # Error handling
│   │   └── rateLimiter.middleware.js
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── ml.service.js        # Call AI Service
│   │   ├── email.service.js
│   │   ├── notification.service.js
│   │   └── storage.service.js
│   ├── utils/
│   │   ├── jwt.util.js
│   │   ├── password.util.js
│   │   ├── validator.util.js
│   │   ├── response.util.js
│   │   └── helpers.js
│   ├── validators/
│   │   ├── auth.validator.js
│   │   ├── job.validator.js
│   │   ├── resume.validator.js
│   │   └── application.validator.js
│   └── app.js                   # Express app setup
├── uploads/                     # Uploaded files
│   └── resumes/
├── logs/                        # Application logs
├── tests/
│   ├── unit/
│   └── integration/
├── .env
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── server.js                    # Entry point
```

---

## 4. API Endpoints

### 4.1. Authentication APIs

```javascript
// src/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { validateRegister, validateLogin } = require('../validators/auth.validator');
const { authenticate } = require('../middleware/auth.middleware');

/**
 * @route   POST /api/auth/register
 * @desc    Register new user
 * @access  Public
 */
router.post('/register', validateRegister, authController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', validateLogin, authController.login);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', authenticate, authController.logout);

/**
 * @route   POST /api/auth/refresh-token
 * @desc    Refresh access token
 * @access  Public
 */
router.post('/refresh-token', authController.refreshToken);

/**
 * @route   GET /api/auth/profile
 * @desc    Get user profile
 * @access  Private
 */
router.get('/profile', authenticate, authController.getProfile);

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', authenticate, authController.updateProfile);

/**
 * @route   POST /api/auth/change-password
 * @desc    Change password
 * @access  Private
 */
router.post('/change-password', authenticate, authController.changePassword);

module.exports = router;
```

### 4.2. Candidate APIs

```javascript
// src/routes/candidate.routes.js
const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidate.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { checkRole } = require('../middleware/role.middleware');
const { uploadResume } = require('../middleware/upload.middleware');

// All routes require authentication and candidate role
router.use(authenticate, checkRole('candidate'));

// Resume Management
router.post('/resumes', uploadResume, candidateController.uploadResume);
router.get('/resumes', candidateController.getResumes);
router.get('/resumes/:id', candidateController.getResumeDetail);
router.delete('/resumes/:id', candidateController.deleteResume);
router.put('/resumes/:id/primary', candidateController.setPrimaryResume);

// Job Search & Application
router.get('/jobs', candidateController.searchJobs);
router.get('/jobs/:id', candidateController.getJobDetail);
router.post('/applications', candidateController.applyJob);
router.get('/applications', candidateController.getApplications);
router.get('/applications/:id', candidateController.getApplicationDetail);
router.put('/applications/:id/withdraw', candidateController.withdrawApplication);

// Recommendations
router.get('/recommendations', candidateController.getJobRecommendations);

// Saved Jobs
router.post('/saved-jobs', candidateController.saveJob);
router.get('/saved-jobs', candidateController.getSavedJobs);
router.delete('/saved-jobs/:jobId', candidateController.unsaveJob);

// Profile & Skills
router.get('/profile', candidateController.getProfile);
router.put('/profile', candidateController.updateProfile);
router.post('/skills', candidateController.addSkill);
router.delete('/skills/:id', candidateController.removeSkill);

module.exports = router;
```

### 4.3. Recruiter APIs

```javascript
// src/routes/recruiter.routes.js
const express = require('express');
const router = express.Router();
const recruiterController = require('../controllers/recruiter.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { checkRole } = require('../middleware/role.middleware');

router.use(authenticate, checkRole('recruiter'));

// Job Management
router.post('/jobs', recruiterController.createJob);
router.get('/jobs', recruiterController.getJobs);
router.get('/jobs/:id', recruiterController.getJobDetail);
router.put('/jobs/:id', recruiterController.updateJob);
router.delete('/jobs/:id', recruiterController.deleteJob);
router.put('/jobs/:id/status', recruiterController.updateJobStatus);

// Application Management
router.get('/jobs/:jobId/applications', recruiterController.getJobApplications);
router.get('/applications/:id', recruiterController.getApplicationDetail);
router.put('/applications/:id/status', recruiterController.updateApplicationStatus);

// Candidate Search
router.get('/candidates', recruiterController.searchCandidates);
router.get('/candidates/:id', recruiterController.getCandidateDetail);
router.post('/candidates/search', recruiterController.advancedSearch);
router.get('/candidates/recommendations/:jobId', recruiterController.getCandidateRecommendations);

// Interview Management
router.get('/interviews', recruiterController.getInterviews);
router.post('/interviews', recruiterController.scheduleInterview);
router.put('/interviews/:id', recruiterController.updateInterview);
router.delete('/interviews/:id', recruiterController.cancelInterview);
router.post('/interviews/:id/feedback', recruiterController.submitFeedback);

// Company Management
router.get('/company', recruiterController.getCompany);
router.put('/company', recruiterController.updateCompany);

// Analytics
router.get('/analytics/overview', recruiterController.getOverviewAnalytics);
router.get('/analytics/jobs/:id', recruiterController.getJobAnalytics);

module.exports = router;
```

---

## 5. Authentication & Authorization

### 5.1. JWT Authentication

```javascript
// src/middleware/auth.middleware.js
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { sendErrorResponse } = require('../utils/response.util');

exports.authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendErrorResponse(res, 401, 'No token provided');
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password_hash'] }
    });

    if (!user || !user.is_active) {
      return sendErrorResponse(res, 401, 'Invalid token or user inactive');
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return sendErrorResponse(res, 401, 'Invalid token');
    }
    if (error.name === 'TokenExpiredError') {
      return sendErrorResponse(res, 401, 'Token expired');
    }
    return sendErrorResponse(res, 500, 'Authentication error');
  }
};
```

### 5.2. Role-Based Access Control

```javascript
// src/middleware/role.middleware.js
const { sendErrorResponse } = require('../utils/response.util');

exports.checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendErrorResponse(res, 401, 'Unauthorized');
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendErrorResponse(res, 403, 'Access denied');
    }

    next();
  };
};
```

### 5.3. Auth Controller

```javascript
// src/controllers/auth.controller.js
const bcrypt = require('bcrypt');
const { User, Candidate } = require('../models');
const { generateToken, generateRefreshToken } = require('../utils/jwt.util');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/response.util');

exports.register = async (req, res) => {
  try {
    const { email, password, full_name, role, phone } = req.body;

    // Check if email exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return sendErrorResponse(res, 400, 'Email already exists');
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      email,
      password_hash,
      full_name,
      role: role || 'candidate',
      phone
    });

    // Create candidate profile if role is candidate
    if (user.role === 'candidate') {
      await Candidate.create({ user_id: user.id });
    }

    // Generate tokens
    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    // Remove password from response
    const userResponse = user.toJSON();
    delete userResponse.password_hash;

    return sendSuccessResponse(res, {
      user: userResponse,
      token,
      refreshToken
    }, 'Registration successful', 201);
  } catch (error) {
    console.error('Register error:', error);
    return sendErrorResponse(res, 500, 'Server error');
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return sendErrorResponse(res, 401, 'Invalid credentials');
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return sendErrorResponse(res, 401, 'Invalid credentials');
    }

    // Check if user is active
    if (!user.is_active) {
      return sendErrorResponse(res, 403, 'Account is inactive');
    }

    // Update last login
    await user.update({ last_login: new Date() });

    // Generate tokens
    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    // Remove password from response
    const userResponse = user.toJSON();
    delete userResponse.password_hash;

    return sendSuccessResponse(res, {
      user: userResponse,
      token,
      refreshToken
    }, 'Login successful');
  } catch (error) {
    console.error('Login error:', error);
    return sendErrorResponse(res, 500, 'Server error');
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password_hash'] },
      include: [
        {
          model: Candidate,
          as: 'candidate',
          required: false
        }
      ]
    });

    return sendSuccessResponse(res, user, 'Profile retrieved successfully');
  } catch (error) {
    console.error('Get profile error:', error);
    return sendErrorResponse(res, 500, 'Server error');
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) {
      return sendErrorResponse(res, 401, 'Current password is incorrect');
    }

    // Hash new password
    const password_hash = await bcrypt.hash(newPassword, 10);

    // Update password
    await user.update({ password_hash });

    return sendSuccessResponse(res, null, 'Password changed successfully');
  } catch (error) {
    console.error('Change password error:', error);
    return sendErrorResponse(res, 500, 'Server error');
  }
};
```

---

## 6. Models & Database

### 6.1. User Model

```javascript
// src/models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING(255),
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('candidate', 'recruiter', 'admin'),
    defaultValue: 'candidate',
    allowNull: false
  },
  full_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING(20)
  },
  avatar_url: {
    type: DataTypes.STRING(500)
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  email_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  last_login: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'users',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = User;
```

### 6.2. Job Model

```javascript
// src/models/Job.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Job = sequelize.define('Job', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  company_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'companies',
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  requirements: {
    type: DataTypes.TEXT
  },
  benefits: {
    type: DataTypes.TEXT
  },
  job_type: {
    type: DataTypes.ENUM('full-time', 'part-time', 'contract', 'internship', 'freelance'),
    defaultValue: 'full-time'
  },
  position_level: {
    type: DataTypes.ENUM('intern', 'fresher', 'junior', 'middle', 'senior', 'lead', 'manager', 'director'),
    defaultValue: 'junior'
  },
  city: {
    type: DataTypes.STRING(100)
  },
  experience_required: {
    type: DataTypes.STRING(50)
  },
  salary_min: {
    type: DataTypes.DECIMAL(12, 2)
  },
  salary_max: {
    type: DataTypes.DECIMAL(12, 2)
  },
  salary_unit: {
    type: DataTypes.STRING(20),
    defaultValue: 'VND'
  },
  is_negotiable: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  number_of_positions: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  status: {
    type: DataTypes.ENUM('draft', 'active', 'closed', 'expired'),
    defaultValue: 'active'
  },
  view_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  application_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  expires_at: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'jobs',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Job;
```

### 6.3. Model Associations

```javascript
// src/models/index.js
const sequelize = require('../config/database');
const User = require('./User');
const Candidate = require('./Candidate');
const Company = require('./Company');
const Job = require('./Job');
const Resume = require('./Resume');
const Application = require('./Application');
const Skill = require('./Skill');
const Interview = require('./Interview');

// User associations
User.hasOne(Candidate, { foreignKey: 'user_id', as: 'candidate' });
Candidate.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Job associations
Job.belongsTo(User, { foreignKey: 'user_id', as: 'recruiter' });
Job.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });
Job.hasMany(Application, { foreignKey: 'job_id', as: 'applications' });

// Resume associations
Resume.belongsTo(Candidate, { foreignKey: 'candidate_id', as: 'candidate' });
Candidate.hasMany(Resume, { foreignKey: 'candidate_id', as: 'resumes' });

// Application associations
Application.belongsTo(Candidate, { foreignKey: 'candidate_id', as: 'candidate' });
Application.belongsTo(Job, { foreignKey: 'job_id', as: 'job' });
Application.belongsTo(Resume, { foreignKey: 'resume_id', as: 'resume' });

// Interview associations
Interview.belongsTo(Application, { foreignKey: 'application_id', as: 'application' });
Interview.belongsTo(User, { foreignKey: 'interviewer_id', as: 'interviewer' });

module.exports = {
  sequelize,
  User,
  Candidate,
  Company,
  Job,
  Resume,
  Application,
  Skill,
  Interview
};
```

---

## 7. Services & Business Logic

### 7.1. ML Service (Call AI Service)

```javascript
// src/services/ml.service.js
const axios = require('axios');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:5001';

class MLService {
  /**
   * Classify resume category
   */
  async classifyResume(resumeText) {
    try {
      const response = await axios.post(`${AI_SERVICE_URL}/classify-resume`, {
        resume_text: resumeText
      });
      return response.data;
    } catch (error) {
      console.error('ML Service - Classify Resume Error:', error.message);
      throw new Error('Failed to classify resume');
    }
  }

  /**
   * Get job recommendations for candidate
   */
  async recommendJobs(resumeText, skills, n = 10) {
    try {
      const response = await axios.post(`${AI_SERVICE_URL}/recommend-jobs`, {
        resume_text: resumeText,
        skills: skills,
        n: n
      });
      return response.data;
    } catch (error) {
      console.error('ML Service - Recommend Jobs Error:', error.message);
      throw new Error('Failed to get job recommendations');
    }
  }

  /**
   * Rank candidates for a job
   */
  async rankCandidates(jobDescription, jobSkills, candidatesData, n = 50) {
    try {
      const response = await axios.post(`${AI_SERVICE_URL}/rank-candidates`, {
        job_description: jobDescription,
        job_skills: jobSkills,
        candidates: candidatesData,
        n: n
      });
      return response.data;
    } catch (error) {
      console.error('ML Service - Rank Candidates Error:', error.message);
      throw new Error('Failed to rank candidates');
    }
  }

  /**
   * Predict salary range
   */
  async predictSalary(jobData) {
    try {
      const response = await axios.post(`${AI_SERVICE_URL}/predict-salary`, jobData);
      return response.data;
    } catch (error) {
      console.error('ML Service - Predict Salary Error:', error.message);
      throw new Error('Failed to predict salary');
    }
  }

  /**
   * Parse resume and extract information
   */
  async parseResume(resumeText) {
    try {
      const response = await axios.post(`${AI_SERVICE_URL}/parse-resume`, {
        resume_text: resumeText
      });
      return response.data;
    } catch (error) {
      console.error('ML Service - Parse Resume Error:', error.message);
      throw new Error('Failed to parse resume');
    }
  }
}

module.exports = new MLService();
```

---

## 8. File Upload

```javascript
// src/middleware/upload.middleware.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../../uploads/resumes');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `resume-${uniqueSuffix}${ext}`);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

// Upload middleware
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

exports.uploadResume = upload.single('resume');
```

---

## 9. Error Handling

```javascript
// src/middleware/error.middleware.js
const { sendErrorResponse } = require('../utils/response.util');

exports.errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Multer errors
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return sendErrorResponse(res, 400, 'File size too large (max 10MB)');
    }
    return sendErrorResponse(res, 400, err.message);
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return sendErrorResponse(res, 400, err.message);
  }

  // Database errors
  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors.map(e => e.message);
    return sendErrorResponse(res, 400, errors.join(', '));
  }

  // Default error
  return sendErrorResponse(res, err.status || 500, err.message || 'Internal server error');
};
```

---

## 10. Setup và Triển Khai

### 10.1. Environment Variables

```env
# .env
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=smart_job_user
DB_PASSWORD=your_password
DB_NAME=smart_job

# JWT
JWT_SECRET=your_jwt_secret_key_minimum_32_characters
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_refresh_secret_key_minimum_32_characters
JWT_REFRESH_EXPIRES_IN=30d

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760

# AI Service
AI_SERVICE_URL=http://localhost:5001

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=noreply@smartjob.com