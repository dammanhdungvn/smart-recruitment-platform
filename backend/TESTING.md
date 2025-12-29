# Backend Testing Guide

## Overview
Comprehensive unit and integration tests for Smart Recruitment Platform backend using Jest and Supertest.

## Test Structure

```
backend/tests/
├── setup.js                          # Global test setup and teardown
├── helpers/
│   └── testHelpers.js               # Reusable test helper functions
├── unit/
│   ├── services/                    # Service layer unit tests
│   │   ├── auth.service.test.js     # Authentication service tests
│   │   ├── job.service.test.js      # Job management tests
│   │   ├── application.service.test.js  # Application tests
│   │   └── resume.service.test.js   # Resume management tests
│   ├── middleware/                  # Middleware unit tests
│   │   ├── auth.middleware.test.js  # JWT authentication tests
│   │   └── role.middleware.test.js  # Role-based access tests
│   └── utils/                       # Utility function tests
│       ├── jwt.util.test.js         # JWT token tests
│       └── password.util.test.js    # Password hashing tests
└── integration/                     # API integration tests
    ├── auth.api.test.js             # Auth endpoints tests
    ├── job.api.test.js              # Job endpoints tests
    ├── application.api.test.js      # Application endpoints tests
    └── resume.api.test.js           # Resume endpoints tests
```

## Prerequisites

1. **Node.js** (v18 or higher)
2. **MySQL** (v8.0 or higher)
3. **Database Configuration**

## Database Setup

### 1. Create Test Database

```bash
mysql -u root -p
```

```sql
-- Create test database
CREATE DATABASE smart_recruitment_test;

-- Create test user (optional, recommended for security)
CREATE USER 'test_user'@'localhost' IDENTIFIED BY 'test_password';
GRANT ALL PRIVILEGES ON smart_recruitment_test.* TO 'test_user'@'localhost';
FLUSH PRIVILEGES;
```

### 2. Configure Environment Variables

Create `.env.test` file in backend directory:

```env
# Test Environment Configuration
NODE_ENV=test

# Test Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=smart_recruitment_test
DB_USER=root
DB_PASSWORD=your_mysql_password

# Or use test user
# DB_USER=test_user
# DB_PASSWORD=test_password

# JWT Secret for testing
JWT_SECRET=test_jwt_secret_key_for_testing_only
JWT_EXPIRES_IN=24h

# Server
PORT=3001
```

### 3. Update Database Config

The `src/config/database.js` should automatically use test database when `NODE_ENV=test`.

## Installation

```bash
# Install dependencies
npm install

# Install test dependencies (if not already installed)
npm install --save-dev jest supertest @types/jest @types/supertest
```

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Run Specific Test Suite
```bash
# Unit tests only
npm test -- tests/unit/

# Integration tests only
npm test -- tests/integration/

# Specific test file
npm test -- tests/unit/services/auth.service.test.js
```

### Run Tests with Verbose Output
```bash
npm test -- --verbose
```

## Test Coverage

Current test coverage includes:

### Unit Tests (8 files)

1. **Service Layer**
   - `auth.service.test.js` (15+ tests)
     - User registration
     - Login with credentials
     - Profile management
     - Password change
   
   - `job.service.test.js` (15+ tests)
     - Job CRUD operations
     - Job filtering and search
     - Pagination
     - Authorization checks
   
   - `application.service.test.js` (13 tests)
     - Application submission
     - Duplicate prevention
     - Status updates
     - Withdrawal logic
   
   - `resume.service.test.js` (15+ tests)
     - Resume upload
     - Primary resume management
     - Resume listing and deletion

2. **Middleware**
   - `auth.middleware.test.js` (8 tests)
     - JWT token validation
     - User authentication
     - Optional authentication
   
   - `role.middleware.test.js` (9 tests)
     - Role-based access control
     - Multiple role permissions
     - Authorization failures

3. **Utilities**
   - `jwt.util.test.js` (10 tests)
     - Token generation
     - Token verification
     - Expiration handling
   
   - `password.util.test.js` (13 tests)
     - Password hashing
     - Password comparison
     - Security validation

### Integration Tests (4 files)

1. `auth.api.test.js` (15+ tests)
   - POST /api/auth/register
   - POST /api/auth/login
   - GET /api/auth/profile
   - PUT /api/auth/profile
   - PUT /api/auth/change-password

2. `job.api.test.js` (15+ tests)
   - POST /api/jobs
   - GET /api/jobs (with filters)
   - GET /api/jobs/:id
   - PUT /api/jobs/:id
   - DELETE /api/jobs/:id
   - GET /api/jobs/my/jobs

3. `application.api.test.js` (20+ tests)
   - POST /api/applications
   - GET /api/applications/my
   - GET /api/applications/:id
   - GET /api/applications/job/:jobId
   - PUT /api/applications/:id/status
   - DELETE /api/applications/:id

4. `resume.api.test.js` (12+ tests)
   - POST /api/resumes/upload
   - GET /api/resumes
   - GET /api/resumes/:id
   - DELETE /api/resumes/:id
   - PUT /api/resumes/:id/primary
   - GET /api/resumes/primary

**Total: 100+ test cases**

## Test Helpers

### Available Helper Functions

```javascript
// Create test user (candidate, recruiter, or admin)
const user = await createTestUser({
  email: 'test@example.com',
  role: 'candidate',
  password: 'Password123!'
});

// Create test job
const job = await createTestJob(recruiterId, {
  title: 'Software Engineer',
  status: 'open'
});

// Create test resume
const resume = await createTestResume(userId, {
  is_primary: true,
  category: 'INFORMATION-TECHNOLOGY'
});

// Create test application
const application = await createTestApplication(userId, jobId, resumeId, {
  status: 'submitted'
});

// Generate authentication token
const token = generateAuthToken(user);

// Cleanup all database tables
await cleanupDatabase();
```

## Common Issues and Solutions

### 1. Database Connection Error

**Error:** `Access denied for user 'root'@'localhost'`

**Solution:**
- Update `.env.test` with correct MySQL credentials
- Ensure MySQL server is running: `sudo systemctl status mysql`
- Verify test database exists: `SHOW DATABASES;`

### 2. Port Already in Use

**Error:** `EADDRINUSE: address already in use`

**Solution:**
- Stop existing server: `pkill -f node`
- Or use different port in `.env.test`

### 3. Tests Timing Out

**Error:** `Exceeded timeout of 5000 ms`

**Solution:**
- Increase timeout in `jest.config.js`:
  ```javascript
  testTimeout: 10000 // 10 seconds
  ```
- Check database connection speed

### 4. Mock File Upload Issues

**Error:** File upload tests failing

**Solution:**
- Ensure `tests/fixtures` directory exists
- Check file permissions for test fixtures
- Verify multer configuration

## Writing New Tests

### Unit Test Template

```javascript
const serviceName = require('../../../src/services/service-name.service');
const { createTestUser, cleanupDatabase } = require('../../helpers/testHelpers');

describe('Service Name', () => {
  beforeEach(async () => {
    await cleanupDatabase();
  });

  describe('functionName', () => {
    it('should perform expected action', async () => {
      // Arrange
      const user = await createTestUser();

      // Act
      const result = await serviceName.functionName(user.id);

      // Assert
      expect(result).toBeDefined();
    });
  });
});
```

### Integration Test Template

```javascript
const request = require('supertest');
const app = require('../../src/app');
const { cleanupDatabase, createTestUser } = require('../helpers/testHelpers');

describe('API Endpoint Tests', () => {
  let user, token;

  beforeEach(async () => {
    await cleanupDatabase();
    user = await createTestUser();
    
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: user.email,
        password: 'Password123!'
      });
    token = loginResponse.body.data.token;
  });

  describe('GET /api/endpoint', () => {
    it('should return expected data', async () => {
      const response = await request(app)
        .get('/api/endpoint')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });
});
```

## Best Practices

1. **Isolation**: Each test should be independent
2. **Cleanup**: Always clean database before each test
3. **Descriptive Names**: Use clear test descriptions
4. **Arrange-Act-Assert**: Follow AAA pattern
5. **Mock External Dependencies**: Don't make real external API calls
6. **Fast Tests**: Keep unit tests under 100ms
7. **Comprehensive**: Test both success and failure cases

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Backend Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: test_password
          MYSQL_DATABASE: smart_recruitment_test
        ports:
          - 3306:3306
        options: >-
          --health-cmd "mysqladmin ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
        working-directory: ./backend
      - name: Run tests
        run: npm test
        working-directory: ./backend
        env:
          DB_HOST: localhost
          DB_PORT: 3306
          DB_USER: root
          DB_PASSWORD: test_password
          DB_NAME: smart_recruitment_test
          JWT_SECRET: test_secret
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          directory: ./backend/coverage
```

## Continuous Improvement

- [ ] Add more edge case tests
- [ ] Improve test coverage to 90%+
- [ ] Add performance benchmarks
- [ ] Add E2E tests with Playwright
- [ ] Add load testing with k6
- [ ] Add security testing

## Support

For issues or questions about tests:
1. Check this README
2. Review test examples in existing test files
3. Check Jest documentation: https://jestjs.io/
4. Check Supertest documentation: https://github.com/visionmedia/supertest
