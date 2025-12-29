# API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

All authenticated endpoints require Bearer token in Authorization header:
```
Authorization: Bearer <your_token>
```

---

## 1. Authentication APIs

### 1.1. Register User
**POST** `/auth/register`

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "John Doe",
  "role": "candidate",
  "phone": "0123456789"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "full_name": "John Doe",
      "role": "candidate"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 1.2. Login
**POST** `/auth/login`

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### 1.3. Get Profile
**GET** `/auth/profile`

**Headers:** `Authorization: Bearer <token>`

### 1.4. Update Profile
**PUT** `/auth/profile`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "full_name": "John Updated",
  "phone": "0987654321"
}
```

### 1.5. Change Password
**POST** `/auth/change-password`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "oldPassword": "password123",
  "newPassword": "newpassword456"
}
```

---

## 2. Jobs APIs

### 2.1. Get All Jobs (Public)
**GET** `/jobs`

**Query Parameters:**
- `city` - Filter by city
- `job_type` - Filter by job type
- `position_level` - Filter by position level
- `job_fields` - Filter by job field
- `skills` - Filter by skills
- `search` - Search in title/description
- `limit` - Results per page (default: 50)
- `offset` - Pagination offset (default: 0)

**Example:**
```
GET /jobs?city=Ho Chi Minh&job_type=full-time&limit=20
```

### 2.2. Get Job by ID (Public)
**GET** `/jobs/:id`

### 2.3. Create Job (Recruiter)
**POST** `/jobs`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "job_title": "Senior Backend Developer",
  "job_type": "full-time",
  "position_level": "senior",
  "city": "Ho Chi Minh",
  "experience": "3-5 years",
  "skills": "Node.js, Express, MySQL, AWS",
  "job_fields": "IT",
  "description": "We are looking for...",
  "requirements": "- 3+ years experience...",
  "benefits": "- Competitive salary...",
  "salary_min": 30000000,
  "salary_max": 50000000,
  "unit": "VND",
  "status": "open"
}
```

### 2.4. Get My Jobs (Recruiter)
**GET** `/jobs/my/jobs`

**Headers:** `Authorization: Bearer <token>`

### 2.5. Update Job (Recruiter)
**PUT** `/jobs/:id`

**Headers:** `Authorization: Bearer <token>`

### 2.6. Delete Job (Recruiter)
**DELETE** `/jobs/:id`

**Headers:** `Authorization: Bearer <token>`

### 2.7. Update Job Status (Recruiter)
**PATCH** `/jobs/:id/status`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "status": "closed"
}
```

---

## 3. Resumes APIs

### 3.1. Upload Resume (Candidate)
**POST** `/resumes`

**Headers:** `Authorization: Bearer <token>`

**Content-Type:** `multipart/form-data`

**Form Data:**
- `resume` (file) - PDF or DOC/DOCX file
- `category` (string) - Resume category
- `resume_text` (string) - Extracted text from resume
- `is_primary` (boolean) - Set as primary resume

### 3.2. Get User Resumes (Candidate)
**GET** `/resumes`

**Headers:** `Authorization: Bearer <token>`

### 3.3. Get Resume by ID (Candidate)
**GET** `/resumes/:id`

**Headers:** `Authorization: Bearer <token>`

### 3.4. Delete Resume (Candidate)
**DELETE** `/resumes/:id`

**Headers:** `Authorization: Bearer <token>`

### 3.5. Set Primary Resume (Candidate)
**PATCH** `/resumes/:id/primary`

**Headers:** `Authorization: Bearer <token>`

---

## 4. Applications APIs

### 4.1. Apply for Job (Candidate)
**POST** `/applications`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "job_id": 1,
  "resume_id": 1,
  "cover_letter": "I am interested in this position..."
}
```

### 4.2. Get User Applications (Candidate)
**GET** `/applications`

**Headers:** `Authorization: Bearer <token>`

### 4.3. Get Application by ID
**GET** `/applications/:id`

**Headers:** `Authorization: Bearer <token>`

### 4.4. Withdraw Application (Candidate)
**PATCH** `/applications/:id/withdraw`

**Headers:** `Authorization: Bearer <token>`

### 4.5. Get Job Applications (Recruiter)
**GET** `/applications/job/:jobId`

**Headers:** `Authorization: Bearer <token>`

### 4.6. Update Application Status (Recruiter)
**PATCH** `/applications/:id/status`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "status": "shortlisted",
  "notes": "Good candidate for next round"
}
```

**Status values:**
- `pending` - Initial status
- `reviewing` - Under review
- `shortlisted` - Selected for interview
- `interviewed` - Interview completed
- `offered` - Job offer sent
- `rejected` - Application rejected
- `withdrawn` - Candidate withdrawn

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email address"
    }
  ]
}
```

Common HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (authentication failed)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate entry)
- `500` - Internal Server Error
