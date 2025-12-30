# Admin API Documentation

## Overview
This document provides detailed documentation for all Admin API endpoints in the Smart Recruitment Platform.

## Base URL
```
http://localhost:5000/api/admin
```

## Authentication
All admin endpoints require:
1. Valid JWT token in Authorization header
2. User role = "admin"

```
Authorization: Bearer <your-jwt-token>
```

---

## Endpoints

### 1. Get Statistics

Get platform-wide statistics for the admin dashboard.

**Endpoint:** `GET /api/admin/stats`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "users": {
      "total": 150,
      "candidates": 100,
      "recruiters": 50
    },
    "jobs": {
      "total": 75,
      "active": 60,
      "closed": 15
    },
    "resumes": {
      "total": 120
    },
    "applications": {
      "total": 300,
      "pending": 50,
      "accepted": 100,
      "rejected": 150
    }
  },
  "message": "Statistics retrieved successfully"
}
```

---

### 2. User Management

#### 2.1 Get All Users

List all users with pagination and filtering.

**Endpoint:** `GET /api/admin/users`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | integer | No | Page number (default: 1) |
| limit | integer | No | Items per page (default: 20) |
| role | string | No | Filter by role: candidate, recruiter, admin |
| search | string | No | Search by name or email |

**Example Request:**
```
GET /api/admin/users?page=1&limit=20&role=candidate&search=john
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": 1,
        "email": "user@example.com",
        "full_name": "John Doe",
        "role": "candidate",
        "status": "active",
        "phone": "+84123456789",
        "company": null,
        "avatar": null,
        "created_at": "2024-01-01T00:00:00.000Z",
        "updated_at": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 20,
      "totalPages": 5
    }
  },
  "message": "Users retrieved successfully"
}
```

#### 2.2 Update User Status

Update a user's status to active or inactive.

**Endpoint:** `PATCH /api/admin/users/:id/status`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | integer | Yes | User ID |

**Request Body:**
```json
{
  "status": "inactive"
}
```

**Allowed Values:** `"active"` or `"inactive"`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "full_name": "John Doe",
      "status": "inactive"
    }
  },
  "message": "User status updated successfully"
}
```

**Error Responses:**

**400 Bad Request** - Invalid status:
```json
{
  "success": false,
  "message": "Invalid status value"
}
```

**400 Bad Request** - Cannot modify own account:
```json
{
  "success": false,
  "message": "Cannot modify your own account"
}
```

**404 Not Found** - User doesn't exist:
```json
{
  "success": false,
  "message": "User not found"
}
```

#### 2.3 Delete User

Permanently delete a user account.

**Endpoint:** `DELETE /api/admin/users/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | integer | Yes | User ID |

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

**Error Responses:**

**400 Bad Request** - Cannot delete own account:
```json
{
  "success": false,
  "message": "Cannot delete your own account"
}
```

**404 Not Found** - User doesn't exist:
```json
{
  "success": false,
  "message": "User not found"
}
```

---

### 3. Job Management

#### 3.1 Get All Jobs

List all jobs with pagination and filtering.

**Endpoint:** `GET /api/admin/jobs`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | integer | No | Page number (default: 1) |
| limit | integer | No | Items per page (default: 20) |
| status | string | No | Filter by status: open, closed |

**Example Request:**
```
GET /api/admin/jobs?page=1&limit=20&status=open
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "jobs": [
      {
        "id": 1,
        "job_title": "Software Engineer",
        "description": "Job description...",
        "city": "Hanoi",
        "status": "open",
        "job_type": "full-time",
        "position_level": "senior",
        "experience": "3-5 years",
        "skills": "JavaScript, React, Node.js",
        "salary_min": 1000,
        "salary_max": 2000,
        "unit": "USD",
        "user_id": 5,
        "created_at": "2024-01-01T00:00:00.000Z",
        "recruiter": {
          "id": 5,
          "full_name": "Recruiter Name",
          "email": "recruiter@company.com",
          "company": "Tech Corporation"
        }
      }
    ],
    "pagination": {
      "total": 75,
      "page": 1,
      "limit": 20,
      "totalPages": 4
    }
  },
  "message": "Jobs retrieved successfully"
}
```

#### 3.2 Delete Job

Permanently delete a job posting.

**Endpoint:** `DELETE /api/admin/jobs/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | integer | Yes | Job ID |

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Job deleted successfully"
}
```

**Error Responses:**

**404 Not Found** - Job doesn't exist:
```json
{
  "success": false,
  "message": "Job not found"
}
```

---

### 4. Resume Management

#### 4.1 Get All Resumes

List all resumes with pagination.

**Endpoint:** `GET /api/admin/resumes`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | integer | No | Page number (default: 1) |
| limit | integer | No | Items per page (default: 20) |

**Example Request:**
```
GET /api/admin/resumes?page=1&limit=20
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "resumes": [
      {
        "id": 1,
        "file_name": "john_doe_resume.pdf",
        "file_path": "/uploads/resumes/resume-123456.pdf",
        "file_size": 524288,
        "category": "INFORMATION-TECHNOLOGY",
        "resume_text": "Extracted text...",
        "is_primary": true,
        "user_id": 10,
        "created_at": "2024-01-01T00:00:00.000Z",
        "user": {
          "id": 10,
          "full_name": "John Doe",
          "email": "john@example.com"
        }
      }
    ],
    "pagination": {
      "total": 120,
      "page": 1,
      "limit": 20,
      "totalPages": 6
    }
  },
  "message": "Resumes retrieved successfully"
}
```

#### 4.2 Delete Resume

Permanently delete a resume file.

**Endpoint:** `DELETE /api/admin/resumes/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | integer | Yes | Resume ID |

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Resume deleted successfully"
}
```

**Error Responses:**

**404 Not Found** - Resume doesn't exist:
```json
{
  "success": false,
  "message": "Resume not found"
}
```

---

### 5. Application Management

#### 5.1 Get All Applications

List all job applications with pagination and filtering.

**Endpoint:** `GET /api/admin/applications`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | integer | No | Page number (default: 1) |
| limit | integer | No | Items per page (default: 20) |
| status | string | No | Filter by status: pending, accepted, rejected, withdrawn, offered |

**Example Request:**
```
GET /api/admin/applications?page=1&limit=20&status=pending
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "applications": [
      {
        "id": 1,
        "status": "pending",
        "cover_letter": "I am interested in this position...",
        "user_id": 10,
        "job_id": 5,
        "resume_id": 8,
        "created_at": "2024-01-01T00:00:00.000Z",
        "updated_at": "2024-01-01T00:00:00.000Z",
        "user": {
          "id": 10,
          "full_name": "John Doe",
          "email": "john@example.com"
        },
        "job": {
          "id": 5,
          "job_title": "Software Engineer",
          "status": "open",
          "recruiter": {
            "id": 3,
            "full_name": "Recruiter Name",
            "email": "recruiter@company.com",
            "company": "Tech Corporation"
          }
        },
        "resume": {
          "id": 8,
          "file_name": "john_doe_resume.pdf"
        }
      }
    ],
    "pagination": {
      "total": 300,
      "page": 1,
      "limit": 20,
      "totalPages": 15
    }
  },
  "message": "Applications retrieved successfully"
}
```

---

## Error Responses

All endpoints follow the same error response format:

```json
{
  "success": false,
  "message": "Error description"
}
```

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success - Request completed successfully |
| 400 | Bad Request - Invalid input or business logic error |
| 401 | Unauthorized - Missing or invalid authentication token |
| 403 | Forbidden - Valid token but insufficient permissions (not admin) |
| 404 | Not Found - Requested resource doesn't exist |
| 500 | Internal Server Error - Server-side error |

### Common Error Messages

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "No token provided"
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "message": "Access denied. Admin role required."
}
```

---

## Security Notes

1. **Admin Role Required:** All endpoints enforce admin role via middleware
2. **Self-Action Prevention:** Admins cannot modify or delete their own accounts
3. **JWT Expiration:** Tokens expire after configured time (default: 24 hours)
4. **HTTPS Required:** Use HTTPS in production environments
5. **Rate Limiting:** Consider implementing rate limiting for production

---

## Swagger UI

Interactive API documentation is available at:
```
http://localhost:5000/api-docs
```

To test admin endpoints in Swagger:
1. Login with admin credentials via `/api/auth/login`
2. Copy the JWT token from the response
3. Click "Authorize" button in Swagger UI
4. Enter: `Bearer <your-token>`
5. Click "Authorize"
6. All admin endpoints are now accessible

---

## Frontend Integration

The frontend admin service (`frontend/src/services/adminService.ts`) provides TypeScript interfaces for all these endpoints:

```typescript
// Example usage
import adminService from '@/services/adminService';

// Get statistics
const stats = await adminService.getStats();

// Get users with pagination
const users = await adminService.getUsers({ page: 1, limit: 20, role: 'candidate' });

// Update user status
await adminService.updateUserStatus(userId, 'inactive');

// Delete user
await adminService.deleteUser(userId);
```

---

## Testing

All admin endpoints are tested in the backend test suite:

```bash
cd backend
npm test
```

Test coverage includes:
- Authentication and authorization
- Pagination
- Filtering
- Error handling
- Edge cases (self-modification, not found, etc.)

---

**Last Updated:** December 30, 2024
**API Version:** 1.0.0
