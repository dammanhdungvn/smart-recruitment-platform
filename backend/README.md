# Smart Recruitment Platform - Backend

Backend API for Smart Recruitment Platform built with Node.js and Express.js.

## Features

- RESTful API architecture
- JWT authentication
- Role-based authorization (candidate, recruiter, admin)
- File upload for resumes
- MySQL database with Sequelize ORM
- Input validation
- Centralized error handling
- Request logging

## Tech Stack

- Node.js
- Express.js
- MySQL
- Sequelize ORM
- JWT (jsonwebtoken)
- bcrypt
- multer (file upload)
- express-validator
- winston (logging)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Configure environment variables in `.env`:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=smart_recruitment
JWT_SECRET=your_secret_key
```

4. Create MySQL database:
```sql
CREATE DATABASE smart_recruitment;
```

## Running the Application

### Development mode:
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

The server will start on http://localhost:5000

## Import Sample Data

To import jobs and resumes from CSV files:

```bash
npm run import
```

This will:
- Create default users (recruiter & candidate)
- Import jobs from `data/jobs.csv`
- Import resumes from `data/resumes.csv` and `data/cv/` folder

Default credentials after import:
- Recruiter: `recruiter@example.com` / `password123`
- Candidate: `candidate@example.com` / `password123`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (authenticated)
- `PUT /api/auth/profile` - Update user profile (authenticated)
- `POST /api/auth/change-password` - Change password (authenticated)

### Jobs
- `GET /api/jobs` - Get all jobs (public)
- `GET /api/jobs/:id` - Get job by ID (public)
- `POST /api/jobs` - Create job (recruiter)
- `GET /api/jobs/my/jobs` - Get recruiter's jobs (recruiter)
- `PUT /api/jobs/:id` - Update job (recruiter)
- `DELETE /api/jobs/:id` - Delete job (recruiter)
- `PATCH /api/jobs/:id/status` - Update job status (recruiter)

### Resumes
- `POST /api/resumes` - Upload resume (candidate)
- `GET /api/resumes` - Get user resumes (candidate)
- `GET /api/resumes/:id` - Get resume by ID (candidate)
- `DELETE /api/resumes/:id` - Delete resume (candidate)
- `PATCH /api/resumes/:id/primary` - Set primary resume (candidate)

### Applications
- `POST /api/applications` - Apply for job (candidate)
- `GET /api/applications` - Get user applications (candidate)
- `GET /api/applications/:id` - Get application by ID
- `PATCH /api/applications/:id/withdraw` - Withdraw application (candidate)
- `GET /api/applications/job/:jobId` - Get job applications (recruiter)
- `PATCH /api/applications/:id/status` - Update application status (recruiter)

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   ├── validators/      # Input validators
│   └── app.js           # Express app setup
├── scripts/             # Utility scripts
│   └── import-data.js   # Data import script
├── uploads/             # Uploaded files
├── logs/                # Application logs
├── .env.example         # Environment template
├── .gitignore
├── package.json
├── server.js            # Entry point
└── README.md
```

## License

ISC
