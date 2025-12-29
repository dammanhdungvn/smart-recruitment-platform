## Smart Recruitment Backend API Specification

### 1. Tổng quan
- **Base URL**: `http://localhost:5000/api`
- **Auth**: JWT Bearer. Header: `Authorization: Bearer <token>` cho các endpoint yêu cầu đăng nhập.
- **Response format**:
  - Success: `{ "success": true, "message": string, "data": object|null }`
  - Error: `{ "success": false, "message": string, "errors": null|array }`

### 2. Authentication APIs
#### POST /auth/register
- Mô tả: Đăng ký người dùng mới (mặc định role=candidate nếu không truyền).
- Headers: `Content-Type: application/json`
- Body: `email` (required), `password` (required), `full_name` (required), `role` (candidate|recruiter|admin, optional), `phone` (optional), `company` (optional).
- Success 201 (ví dụ):
```
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": { "id": 1, "email": "user@example.com", "full_name": "User", "role": "candidate" },
    "token": "<jwt>"
  }
}
```
- Error: 400 dữ liệu không hợp lệ; 409 email đã tồn tại; 500 server.

#### POST /auth/login
- Mô tả: Đăng nhập lấy token.
- Headers: `Content-Type: application/json`
- Body: `email`, `password`
- Success 200: `data.user`, `data.token`.
- Error: 401 sai thông tin hoặc tài khoản inactive; 500.

#### GET /auth/profile
- Mô tả: Lấy hồ sơ hiện tại.
- Headers: `Authorization: Bearer <token>`
- Success 200: `data.user` (không chứa password).
- Error: 401 thiếu/invalid token; 500.

#### PUT /auth/profile
- Mô tả: Cập nhật hồ sơ (không đổi email).
- Headers: `Authorization`, `Content-Type: application/json`
- Body cho phép: `full_name`, `phone`, `avatar`.
- Success 200: `data.user`.
- Error: 400 dữ liệu không hợp lệ; 401/403; 500.

#### POST /auth/change-password
- Mô tả: Đổi mật khẩu.
- Headers: `Authorization`, `Content-Type: application/json`
- Body: `oldPassword` hoặc `currentPassword`, và `newPassword`.
- Success 200: message success.
- Error: 400 current password sai; 500.

### 3. Job APIs (page size cố định 60)
Pagination: `page` (number, default 1, <1 ép về 1). Response metadata: `{ page, limit, total, totalPages }` với `limit=60`.

#### GET /jobs
- Public, trả về job status=open.
- Query: `page`; filters hợp lệ: `city` hoặc `location`, `job_type`, `position_level`, `job_fields` hoặc `category`, `skills`, `search`.
- Success 200 (ví dụ rút gọn):
```
{
  "success": true,
  "message": "Jobs retrieved successfully",
  "data": {
    "jobs": [ { "id": 1, "title": "...", "location": "...", "recruiter": {"id": 8, "full_name": "...", "email": "..."}, "category": "..." } ],
    "pagination": { "page": 1, "limit": 60, "total": 85294, "totalPages": 1422 }
  }
}
```
- Error: 400 page không hợp lệ; 500.

#### GET /jobs/:id
- Public, xem chi tiết job.
- Success 200: `data.job`.
- Error: 404 không thấy; 500.

#### POST /jobs
- Role: recruiter|admin.
- Headers: `Authorization`, `Content-Type: application/json`
- Body (các field đang dùng): `job_title` (hoặc alias `title`), `city` (hoặc alias `location`), `job_type`, `position_level`, `job_fields` (hoặc alias `category`), `experience`, `skills`, `description`, `requirements`, `benefits`, `salary_min`, `salary_max`, `unit` (VND|USD), `status` (open|closed|draft), `deadline`.
- Success 201: `data.job`.
- Error: 400 validate; 401/403; 500.

#### PUT /jobs/:id
- Role: recruiter|admin (owner).
- Headers: `Authorization`
- Body: như POST (các field trên).
- Success 200: `data.job`.
- Error: 404; 403 không phải owner; 400 validate; 500.

#### DELETE /jobs/:id
- Role: recruiter|admin (owner).
- Headers: `Authorization`
- Success 200.
- Error: 404; 403; 500.

#### PATCH /jobs/:id/status
- Role: recruiter|admin (owner).
- Headers: `Authorization`, `Content-Type: application/json`
- Body: `status` (open|closed|draft).
- Success 200: `data.job`.
- Error: 404; 403; 400 status không hợp lệ; 500.

#### GET /jobs/my/jobs
- Role: recruiter|admin.
- Headers: `Authorization`
- Success 200: `data.jobs`, `data.count`.
- Error: 401/403; 500.

### 4. Resume APIs (page size cố định 60)
Pagination: `page` (number, default 1, <1 ép về 1). Response metadata: `{ page, limit, total, totalPages }` với `limit=60`.

#### GET /resumes
- Role: candidate|admin (chỉ resumes của chính user).
- Headers: `Authorization`
- Query: `page`.
- Success 200 (ví dụ rút gọn):
```
{
  "success": true,
  "message": "Resumes retrieved successfully",
  "data": {
    "resumes": [ { "id": 1, "file_name": "...", "is_primary": true, "category": "..." } ],
    "count": 2483,
    "pagination": { "page": 1, "limit": 60, "total": 2483, "totalPages": 42 }
  }
}
```
- Error: 400 page không hợp lệ; 401/403; 500.

#### POST /resumes/upload
- Role: candidate|admin.
- Headers: `Authorization`, `Content-Type: multipart/form-data`
- Form fields: `resume` (file PDF, required, ≤10MB), `category` (optional), `resume_text` (optional), `is_primary` ("true"/"false").
- Success 201: `data.resume`.
- Error: 400 thiếu file/sai loại/validate; 401/403; 500.

#### GET /resumes/:id
- Role: candidate|admin (chỉ resume sở hữu).
- Headers: `Authorization`
- Success 200: `data.resume`.
- Error: 404 không thấy/không sở hữu; 401/403; 500.

#### DELETE /resumes/:id
- Role: candidate|admin (sở hữu).
- Headers: `Authorization`
- Success 200.
- Error: 404; 401/403; 500.

#### PUT /resumes/:id/primary
- Role: candidate|admin (sở hữu).
- Headers: `Authorization`
- Success 200: `data.resume`.
- Error: 404; 401/403; 500.

#### GET /resumes/primary
- Role: candidate|admin.
- Headers: `Authorization`
- Success 200: `data.resume`.
- Error: 404 chưa có primary; 401/403; 500.

### 5. Application APIs
Trạng thái hợp lệ: `submitted`, `pending`, `reviewing`, `shortlisted`, `interviewed`, `offered`, `rejected`, `withdrawn`.

#### POST /applications
- Role: candidate|admin.
- Headers: `Authorization`, `Content-Type: application/json`
- Body: `job_id`, `resume_id`, `cover_letter` (optional).
- Success 201: `data.application`.
- Error: 404 job không tồn tại hoặc resume không thuộc user; 400 job không open hoặc đã ứng tuyển; 401/403; 500.

#### GET /applications
- Role: candidate|admin.
- Headers: `Authorization`
- (Có thể filter status nếu query validator cho phép `status`).
- Success 200: `data.applications`, `data.count`.
- Error: 401/403; 500.

#### GET /applications/:id
- Role: candidate (owner) | recruiter (owner job) | admin.
- Headers: `Authorization`
- Success 200: `data.application`.
- Error: 404 không thấy; 403 không có quyền; 500.

#### GET /applications/job/:jobId
- Role: recruiter (owner job) | admin.
- Headers: `Authorization`
- Success 200: `data.applications`, `data.count`.
- Error: 404 job không thấy; 403 không phải owner; 500.

#### PATCH /applications/:id/status
- Role: recruiter (owner job) | admin.
- Headers: `Authorization`, `Content-Type: application/json`
- Body: `status` (trong danh sách hợp lệ), `notes` (optional).
- Success 200: `data.application`.
- Error: 404 application không thấy; 403 không phải owner; 400 status không hợp lệ; 500.

#### PATCH /applications/:id/withdraw
- Role: candidate (owner) | admin.
- Headers: `Authorization`
- Mô tả: Rút application nếu chưa ở trạng thái rejected/withdrawn/offered.
- Success 200: `data.application`.
- Error: 404 không thấy; 403 không sở hữu; 400 không thể rút; 500.

### 6. Role & Permission Matrix
| API                                     | Candidate | Recruiter | Admin |
|-----------------------------------------|-----------|-----------|-------|
| POST /auth/register/login/profile       | ✔️        | ✔️        | ✔️    |
| POST /auth/change-password              | ✔️        | ✔️        | ✔️    |
| GET /jobs, GET /jobs/:id                | ✔️        | ✔️        | ✔️    |
| POST /jobs                              | ❌        | ✔️        | ✔️    |
| PUT /jobs/:id, DELETE /jobs/:id         | ❌        | ✔️ (owner) | ✔️    |
| PATCH /jobs/:id/status                  | ❌        | ✔️ (owner) | ✔️    |
| GET /jobs/my/jobs                       | ❌        | ✔️        | ✔️    |
| GET /resumes                            | ✔️ (self) | ❌        | ✔️    |
| POST /resumes/upload                    | ✔️        | ❌        | ✔️    |
| GET /resumes/:id                        | ✔️ (self) | ❌        | ✔️    |
| DELETE /resumes/:id                     | ✔️ (self) | ❌        | ✔️    |
| PUT /resumes/:id/primary                | ✔️ (self) | ❌        | ✔️    |
| GET /resumes/primary                    | ✔️ (self) | ❌        | ✔️    |
| POST /applications                      | ✔️        | ❌        | ✔️    |
| GET /applications (self)                | ✔️        | ❌        | ✔️    |
| GET /applications/:id                   | ✔️ (owner) | ✔️ (owner job) | ✔️ |
| GET /applications/job/:jobId            | ❌        | ✔️ (owner) | ✔️    |
| PATCH /applications/:id/status          | ❌        | ✔️ (owner) | ✔️    |
| PATCH /applications/:id/withdraw        | ✔️ (owner) | ❌        | ✔️    |

### 7. Common Error Codes (ngữ cảnh hệ thống)
- **400 Bad Request**: Dữ liệu/validator sai, status không hợp lệ, apply trùng, job không open, page không hợp lệ.
- **401 Unauthorized**: Thiếu token, token sai/hết hạn.
- **403 Forbidden**: Có token nhưng không đủ quyền hoặc không phải owner.
- **404 Not Found**: Tài nguyên không tồn tại hoặc không thuộc về người gọi.
- **500 Internal Server Error**: Lỗi hệ thống không lường trước.

