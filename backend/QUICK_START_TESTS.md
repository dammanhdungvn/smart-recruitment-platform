# ⚡ Quick Test Setup & Run Guide

## 1️⃣ One-Time Setup (5 minutes)

### Step 1: Create Test Database
```bash
mysql -u root -p
```
```sql
CREATE DATABASE smart_recruitment_test;
exit;
```

### Step 2: Create .env.test File
```bash
cd backend
cat > .env.test << 'EOF'
NODE_ENV=test
DB_HOST=localhost
DB_PORT=3306
DB_NAME=smart_recruitment_test
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD_HERE
JWT_SECRET=test_jwt_secret_12345
JWT_EXPIRES_IN=24h
PORT=3001
EOF
```

**⚠️ IMPORTANT:** Replace `YOUR_MYSQL_PASSWORD_HERE` with your actual MySQL password!

### Step 3: Verify Dependencies
```bash
npm install
```

## 2️⃣ Run Tests

### Run All Tests
```bash
npm test
```

### Run with Coverage
```bash
npm run test:coverage
```

### Run in Watch Mode (for development)
```bash
npm run test:watch
```

### Run Specific Test File
```bash
# Auth tests only
npm test -- tests/unit/services/auth.service.test.js

# Integration tests only
npm test -- tests/integration/

# Unit tests only
npm test -- tests/unit/
```

## 3️⃣ Understanding Test Output

### ✅ Successful Test Output
```
PASS  tests/unit/services/auth.service.test.js
  Auth Service
    register
      ✓ should register new user successfully (45ms)
      ✓ should reject duplicate email (32ms)
    login
      ✓ should login with valid credentials (28ms)
```

### ❌ Failed Test Output
```
FAIL  tests/unit/services/auth.service.test.js
  Auth Service
    login
      ✕ should login with valid credentials (150ms)
        
        Expected: { success: true }
        Received: { success: false, message: "Invalid credentials" }
```

## 4️⃣ Common Issues & Quick Fixes

### Issue 1: Database Connection Error
```
Error: Access denied for user 'root'@'localhost'
```
**Fix:**
1. Open `.env.test`
2. Update `DB_PASSWORD` with correct password
3. Run: `mysql -u root -p` to verify password

### Issue 2: Database Doesn't Exist
```
Error: Unknown database 'smart_recruitment_test'
```
**Fix:**
```bash
mysql -u root -p -e "CREATE DATABASE smart_recruitment_test;"
```

### Issue 3: MySQL Not Running
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
**Fix:**
```bash
# Ubuntu/Debian
sudo systemctl start mysql

# macOS
brew services start mysql

# Windows
net start MySQL
```

### Issue 4: Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3001
```
**Fix:**
```bash
# Find and kill process using port 3001
lsof -ti:3001 | xargs kill -9
```

## 5️⃣ Test File Organization

```
tests/
├── setup.js                              # 🔧 Test environment setup
├── helpers/testHelpers.js                # 🛠️ Reusable test utilities
├── unit/                                 # 🧪 Unit tests
│   ├── services/                         # Business logic tests
│   │   ├── auth.service.test.js          # ✅ 15+ tests
│   │   ├── job.service.test.js           # ✅ 15+ tests
│   │   ├── application.service.test.js   # ✅ 13 tests
│   │   └── resume.service.test.js        # ✅ 15+ tests
│   ├── middleware/                       # Middleware tests
│   │   ├── auth.middleware.test.js       # ✅ 8 tests
│   │   └── role.middleware.test.js       # ✅ 9 tests
│   └── utils/                            # Utility tests
│       ├── jwt.util.test.js              # ✅ 10 tests
│       └── password.util.test.js         # ✅ 13 tests
└── integration/                          # 🌐 API tests
    ├── auth.api.test.js                  # ✅ 15+ tests
    ├── job.api.test.js                   # ✅ 15+ tests
    ├── application.api.test.js           # ✅ 20+ tests
    └── resume.api.test.js                # ✅ 12+ tests
```

## 6️⃣ What Each Test Suite Covers

| Test Suite | Tests | Coverage |
|------------|-------|----------|
| **auth.service** | 15+ | Register, login, profile, password |
| **job.service** | 15+ | CRUD, search, filter, pagination |
| **application.service** | 13 | Submit, status, withdraw |
| **resume.service** | 15+ | Upload, list, primary, delete |
| **auth.middleware** | 8 | JWT validation, authentication |
| **role.middleware** | 9 | Role-based access control |
| **jwt.util** | 10 | Token generation, verification |
| **password.util** | 13 | Hashing, comparison, security |
| **auth.api** | 15+ | Auth endpoints E2E |
| **job.api** | 15+ | Job endpoints E2E |
| **application.api** | 20+ | Application endpoints E2E |
| **resume.api** | 12+ | Resume endpoints E2E |

**Total: 100+ tests**

## 7️⃣ Test Coverage Report

After running tests with coverage:
```bash
npm run test:coverage
```

View the HTML report:
```bash
# Linux/macOS
open coverage/lcov-report/index.html

# Windows
start coverage/lcov-report/index.html
```

## 8️⃣ Before Committing Code

### Checklist
- [ ] All tests pass: `npm test`
- [ ] No console errors
- [ ] Code coverage > 80%
- [ ] New features have tests
- [ ] Bug fixes have regression tests

### Quick Pre-Commit Test
```bash
npm test && echo "✅ All tests passed - ready to commit!"
```

## 9️⃣ Need More Help?

1. 📖 **Detailed Guide**: Read `TESTING.md`
2. 📋 **Test Summary**: Check `TEST_SUMMARY.md`
3. 💡 **Examples**: Look at existing test files
4. 🛠️ **Helpers**: Review `tests/helpers/testHelpers.js`

## 🎯 Success Criteria

Your tests are working when you see:
```
Test Suites: 12 passed, 12 total
Tests:       100+ passed, 100+ total
Snapshots:   0 total
Time:        XX.XXs
```

---

**🚀 You're all set! Happy testing!**
