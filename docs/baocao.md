# BÁO CÁO ĐỒ ÁN TỐT NGHIỆP
## NỀN TẢNG QUẢN LÝ TUYỂN DỤNG THÔNG MINH

**Sinh viên thực hiện:** Nguyễn Viết Hoan  
**Ngành học:** Công nghệ Thông tin  
**Năm học:** 2025 - 2026  
**Ngày hoàn thành:** Tháng 01 năm 2026

---

## MỤC LỤC

1. [Chương 1: Bối cảnh và lý do chọn đề tài](#chương-1-bối-cảnh-và-lý-do-chọn-đề-tài)
2. [Chương 2: Cơ sở lý thuyết](#chương-2-cơ-sở-lý-thuyết)
3. [Chương 3: Phân tích và thiết kế hệ thống](#chương-3-phân-tích-và-thiết-kế-hệ-thống)
4. [Chương 4: Kết quả thực hiện và kết luận](#chương-4-kết-quả-thực-hiện-và-kết-luận)

---

# CHƯƠNG 1: BỐI CẢNH VÀ LÝ DO CHỌN ĐỀ TÀI

## 1.1 Giới thiệu bài toán

Trong thời đại số hóa hiện nay, quy trình tuyển dụng nhân sự là một khâu quan trọng đối với bất kỳ tổ chức nào. Tuy nhiên, các phương pháp tuyển dụng truyền thống còn nhiều hạn chế:

- **Thiếu hiệu quả:** Quy trình tuyển dụng thủ công mất nhiều thời gian, công sức
- **Quản lý dữ liệu kém:** Khó kiểm soát và theo dõi ứng viên, công việc, đơn ứng tuyển
- **Trải nghiệm người dùng tệ:** Ứng viên phải nộp hồ sơ tại nhiều nơi khác nhau
- **Thiếu tính minh bạch:** Khó đánh giá tiến độ xử lý đơn ứng tuyển

## 1.2 Bối cảnh thực tế dẫn đến việc chọn đề tài

Hầu hết các công ty, đặc biệt là các startup và doanh nghiệp vừa và nhỏ, vẫn sử dụng các công cụ cơ bản như:
- Email để tiếp nhận đơn ứng tuyển
- Bảng tính Excel để quản lý ứng viên
- Cuộc gọi điện thoại để liên lạc

Điều này dẫn đến:
- Mất mát dữ liệu
- Trùng lặp thông tin
- Quy trình chậm chạp

## 1.3 Mục tiêu của đề tài

Xây dựng một **nền tảng quản lý tuyển dụng toàn diện** giúp:

1. **Tối ưu hóa quy trình tuyển dụng:**
   - Nhà tuyển dụng (Recruiter) có thể đăng tin tuyển dụng dễ dàng
   - Ứng viên (Candidate) có thể tìm kiếm và ứng tuyển ngay lập tức
   - Quản trị viên (Admin) có thể giám sát toàn bộ hoạt động

2. **Quản lý hiệu quả dữ liệu:**
   - Lưu trữ tập trung các thông tin công việc, ứng viên, đơn ứng tuyển
   - Cung cấp công cụ tìm kiếm và lọc nhanh chóng
   - Đảm bảo an toàn dữ liệu với quyền truy cập hợp lý

3. **Cải thiện trải nghiệm người dùng:**
   - Giao diện thân thiện, dễ sử dụng
   - Chức năng quản lý hồ sơ cá nhân
   - Thông báo và cập nhật tình trạng đơn ứng tuyển

4. **Cung cấp công cụ quản lý cho nhà tuyển dụng:**
   - Xem và quản lý danh sách ứng viên
   - Cập nhật trạng thái xét duyệt
   - Ghi chú và đánh giá ứng viên

## 1.4 Phạm vi và đối tượng sử dụng

### Phạm vi dự án

Dự án bao gồm:
- **Backend API:** Xây dựng các API RESTful để xử lý logic nghiệp vụ
- **Frontend Web:** Giao diện web phản ứng cho các loại người dùng khác nhau
- **Cơ sở dữ liệu:** Thiết kế và triển khai CSDL quan hệ
- **Xác thực và phân quyền:** Hệ thống đăng nhập, phân loại người dùng theo vai trò

Phạm vi **không** bao gồm:
- Ứng dụng di động (Mobile App)
- Hệ thống thanh toán
- Tích hợp với các nền tảng mạng xã hội
- Máy học và trí tuệ nhân tạo cho khớp nối công việc

### Đối tượng sử dụng

Hệ thống hỗ trợ ba nhóm người dùng chính:

1. **Ứng viên (Candidate):**
   - Đăng ký tài khoản cá nhân
   - Tìm kiếm và xem chi tiết công việc
   - Tải lên và quản lý hồ sơ CV
   - Nộp đơn ứng tuyển
   - Theo dõi trạng thái đơn ứng tuyển
   - Quản lý thông tin cá nhân

2. **Nhà tuyển dụng (Recruiter):**
   - Đăng ký tài khoản công ty
   - Đăng tin tuyển dụng mới
   - Quản lý danh sách công việc đang tuyển
   - Xem ứng viên ứng tuyển cho từng công việc
   - Cập nhật trạng thái xét duyệt ứng viên
   - Ghi chú và đánh giá ứng viên

3. **Quản trị viên (Admin):**
   - Quản lý toàn bộ tài khoản người dùng
   - Duyệt và quản lý hồ sơ của ứng viên
   - Xem thống kê toàn hệ thống
   - Quản lý danh mục phân loại công việc

---

# CHƯƠNG 2: CƠ SỞ LÝ THUYẾT

## 2.1 Các công nghệ sử dụng

### Backend

| Công nghệ | Phiên bản | Mục đích |
|-----------|----------|---------|
| **Node.js** | v18/20 | Runtime JavaScript phía máy chủ |
| **Express.js** | ^4.18.2 | Framework web cho xây dựng API RESTful |
| **Sequelize** | ^6.37.1 | ORM (Object-Relational Mapping) cho Node.js |
| **MySQL** | 8.0 | Cơ sở dữ liệu quan hệ |
| **JWT** (jsonwebtoken) | ^9.0.2 | Xác thực token cho API |
| **bcrypt** | ^5.1.1 | Mã hóa mật khẩu |
| **Multer** | ^1.4.5 | Xử lý tải lên file |
| **Swagger** | ^6.2.8 | Tài liệu API tương tác |
| **Winston** | ^3.11.0 | Logging/ghi nhật ký hệ thống |
| **Jest** | ^30.2.0 | Framework testing |

### Frontend

| Công nghệ | Phiên bản | Mục đích |
|-----------|----------|---------|
| **React** | ^19.2.0 | Thư viện UI component |
| **TypeScript** | ~5.9.3 | Ngôn ngữ được định kiểu dựa trên JavaScript |
| **Vite** | ^7.2.4 | Build tool và development server |
| **React Router DOM** | ^7.11.0 | Định tuyến cho ứng dụng một trang (SPA) |
| **Material-UI (MUI)** | ^7.3.6 | Thư viện component giao diện |
| **React Hook Form** | ^7.69.0 | Quản lý form hiệu quả |
| **Axios** | ^1.13.2 | HTTP client cho gọi API |
| **Zod** | ^4.2.1 | Xác thực schema |
| **React Hot Toast** | ^2.6.0 | Thông báo/Toast UI |
| **Vitest** | ^4.0.16 | Testing framework cho Vite |

## 2.2 Kiến trúc tổng thể

Hệ thống Smart Recruitment Platform được xây dựng theo **mô hình client-server** với hai phần chính:

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React + TypeScript)        │
│                                                         │
│  • Giao diện người dùng (SPA)                          │
│  • Xác thực client-side                                │
│  • Quản lý trạng thái (localStorage)                    │
└──────────────────┬──────────────────────────────────────┘
                   │ HTTP/HTTPS + JWT
                   │ (Axios)
┌──────────────────▼──────────────────────────────────────┐
│            Backend API (Node.js + Express)             │
│                                                         │
│  • RESTful API endpoints                               │
│  • Middleware (Auth, Validation, Error handling)       │
│  • Business logic (Services)                           │
│  • Xác thực JWT                                        │
└──────────────────┬──────────────────────────────────────┘
                   │ SQL queries (Sequelize)
                   │
┌──────────────────▼──────────────────────────────────────┐
│               MySQL Database                           │
│                                                         │
│  • Users, Jobs, Resumes, Applications                  │
│  • Quan hệ giữa các bảng                               │
└─────────────────────────────────────────────────────────┘
```

## 2.3 Mô hình xác thực và phân quyền

### Xác thực (Authentication)

Hệ thống sử dụng **JWT (JSON Web Token)** cho xác thực:

1. **Đăng nhập:**
   - Người dùng gửi email và password đến `/api/auth/login`
   - Backend xác thực thông tin, tạo JWT token và gửi về
   - Frontend lưu token vào localStorage

2. **Gọi API:**
   - Mỗi request đến API được tài được gắn token vào header: `Authorization: Bearer <token>`
   - Middleware `authenticate` xác thực token trước khi xử lý request
   - Nếu token hết hạn hoặc không hợp lệ, API trả về lỗi 401

### Phân quyền (Authorization)

Hệ thống sử dụng **Role-Based Access Control (RBAC)** với ba vai trò:

| Vai trò | Quyền |
|---------|-------|
| **Admin** | Quản lý toàn bộ hệ thống, xem thống kê, quản lý người dùng |
| **Recruiter** | Đăng tin tuyển dụng, xem ứng viên, cập nhật trạng thái đơn |
| **Candidate** | Xem công việc, nộp đơn, quản lý hồ sơ |

Middleware `checkRole` kiểm tra vai trò trước khi cho phép truy cập endpoint.

## 2.4 Mô hình dữ liệu quan trọng

### Kiến trúc ba lớp (MVC)

```
Routes (Express Router)
    ↓
Controllers (Xử lý request/response)
    ↓
Services (Chứa business logic)
    ↓
Models (Tương tác với database)
    ↓
Database (MySQL)
```

### Quy trình request - response

```
Frontend Request
    ↓
API Endpoint → Authenticate → Check Role → Validate Input
    ↓
Controller → Service → Model → Database
    ↓
Response Data → Error Handling → Send to Frontend
```

---

# CHƯƠNG 3: PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG

## 3.1 Phân tích bài toán

### Các yêu cầu chính

**Yêu cầu chức năng:**

1. **Quản lý người dùng:**
   - Đăng ký tài khoản (Candidate/Recruiter)
   - Đăng nhập an toàn
   - Cập nhật thông tin cá nhân
   - Quản lý mật khẩu

2. **Quản lý công việc:**
   - Đăng tin tuyển dụng (Recruiter)
   - Tìm kiếm lọc công việc theo nhiều tiêu chí (địa điểm, loại hình, cấp độ, lĩnh vực)
   - Xem chi tiết công việc
   - Quản lý danh sách công việc (Recruiter)

3. **Quản lý hồ sơ:**
   - Tải lên CV (Candidate)
   - Duyệt hồ sơ (Admin)
   - Phân loại hồ sơ theo lĩnh vực

4. **Quản lý đơn ứng tuyển:**
   - Nộp đơn ứng tuyển (Candidate)
   - Xem danh sách ứng viên (Recruiter)
   - Cập nhật trạng thái xét duyệt (Recruiter)
   - Ghi chú đánh giá ứng viên

5. **Quản lý admin:**
   - Xem thống kê hệ thống (số người dùng, công việc, đơn ứng tuyển)
   - Quản lý toàn bộ người dùng
   - Duyệt hồ sơ

**Yêu cầu phi chức năng:**
- Tốc độ: API response < 1 giây
- An toàn: Mã hóa mật khẩu, JWT authentication
- Khả dụng: Hoạt động ổn định 24/7
- Khả năng mở rộng: Hỗ trợ hàng nghìn người dùng đồng thời

## 3.2 Phân tích chức năng hệ thống

### Các module chính

#### 1. Module Xác thực (Auth)

**Các chức năng:**
- `POST /api/auth/register` - Đăng ký tài khoản mới
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/profile` - Lấy thông tin cá nhân (yêu cầu JWT)
- `PUT /api/auth/profile` - Cập nhật thông tin cá nhân
- `PUT /api/auth/change-password` - Đổi mật khẩu

**Luồng xử lý:**
```
Người dùng nhập email/password
    ↓
Validate input (email hợp lệ, password >= 6 ký tự)
    ↓
Kiểm tra email đã tồn tại?
    ↓
Hash mật khẩu bằng bcrypt (salt rounds = 10)
    ↓
Lưu vào database
    ↓
Tạo JWT token (expires: 7 ngày)
    ↓
Trả về user + token
```

#### 2. Module Công việc (Job)

**Các chức năng:**
- `GET /api/jobs` - Lấy danh sách công việc (công khai, phân trang)
- `GET /api/jobs/:id` - Lấy chi tiết công việc
- `POST /api/jobs` - Đăng tin tuyển dụng (Recruiter)
- `PUT /api/jobs/:id` - Cập nhật tin tuyển dụng (Recruiter)
- `PUT /api/jobs/:id/status` - Cập nhật trạng thái (mở/đóng/nháp)
- `DELETE /api/jobs/:id` - Xóa tin tuyển dụng (Recruiter)
- `GET /api/jobs/recruiter/jobs` - Lấy danh sách công việc của recruiter
- `GET /api/jobs/categories` - Lấy danh mục phân loại

**Bộ lọc tìm kiếm:**
- Địa điểm (city)
- Loại hình (job_type): full-time, part-time, contract, internship, freelance
- Cấp độ (position_level): intern, fresher, junior, middle, senior, lead, manager, director
- Lĩnh vực (job_fields/category)
- Kỹ năng yêu cầu (skills)
- Tìm kiếm tự do (job_title, description, skills)

#### 3. Module Hồ sơ (Resume)

**Các chức năng:**
- `POST /api/resumes` - Tải lên hồ sơ (Candidate)
- `GET /api/resumes` - Lấy danh sách hồ sơ của người dùng
- `GET /api/resumes/:id` - Lấy chi tiết hồ sơ
- `PUT /api/resumes/:id` - Cập nhật trạng thái hồ sơ (Candidate)
- `DELETE /api/resumes/:id` - Xóa hồ sơ (Candidate)
- `PUT /api/resumes/:id/set-primary` - Đặt là hồ sơ chính
- `GET /api/admin/resumes` - Lấy danh sách tất cả hồ sơ (Admin)
- `PUT /api/admin/resumes/:id/status` - Duyệt hồ sơ (Admin)

**Quy trình xử lý file:**
- Upload file PDF/DOC (max 5MB)
- Lưu trữ trên server (uploads/resumes/)
- Lưu đường dẫn vào database

#### 4. Module Đơn ứng tuyển (Application)

**Các chức năng:**
- `POST /api/applications` - Nộp đơn ứng tuyển (Candidate)
- `GET /api/applications` - Lấy danh sách đơn của người dùng
- `GET /api/applications/:id` - Lấy chi tiết đơn ứng tuyển
- `GET /api/jobs/:jobId/applications` - Lấy danh sách ứng viên của công việc (Recruiter)
- `PUT /api/applications/:id/status` - Cập nhật trạng thái xét duyệt (Recruiter)

**Trạng thái đơn ứng tuyển:**
- submitted: Vừa nộp
- pending: Chờ xét duyệt
- reviewing: Đang xem xét
- shortlisted: Vừa được lựa chọn
- interviewed: Đã phỏng vấn
- offered: Được mời làm việc
- rejected: Bị từ chối
- withdrawn: Rút lại đơn

#### 5. Module Quản trị (Admin)

**Các chức năng:**
- `GET /api/admin/stats` - Xem thống kê hệ thống
- `GET /api/admin/users` - Quản lý người dùng
- `PUT /api/admin/users/:id` - Cập nhật thông tin người dùng
- `DELETE /api/admin/users/:id` - Xóa người dùng
- `PUT /api/admin/users/:id/toggle-status` - Kích hoạt/vô hiệu hóa tài khoản
- `GET /api/admin/jobs` - Xem danh sách công việc
- `PUT /api/admin/jobs/:id/status` - Cập nhật trạng thái công việc
- `GET /api/admin/applications` - Xem danh sách đơn ứng tuyển
- `GET /api/admin/resumes` - Xem danh sách hồ sơ
- `PUT /api/admin/resumes/:id/status` - Duyệt hồ sơ

## 3.3 Thiết kế tổng thể hệ thống

### Sơ đồ kiến trúc hệ thống

```
┌──────────────────────────────────────────────────────────────┐
│                        Người dùng (Browser)                 │
└────────────────┬─────────────────────────────────────────────┘
                 │
       ┌─────────▼─────────┐
       │   Frontend (React)│
       │  • Navbar         │
       │  • Routes         │
       │  • Components     │
       │  • Services       │
       └─────────┬─────────┘
                 │
     ┌───────────▼──────────────┐
     │   HTTP/HTTPS (Axios)     │
     │   Header: Authorization  │
     └───────────┬──────────────┘
                 │
    ┌────────────▼────────────────────────────┐
    │     Express.js API Server              │
    │                                        │
    │  ┌────────────────────────────────────┐│
    │  │ Routes (Express Router)            ││
    │  │ • /api/auth                        ││
    │  │ • /api/jobs                        ││
    │  │ • /api/resumes                     ││
    │  │ • /api/applications                ││
    │  │ • /api/admin                       ││
    │  └────────┬───────────────────────────┘│
    │           │                            │
    │  ┌────────▼───────────────────────────┐│
    │  │ Middleware                        ││
    │  │ • authenticate (JWT)               ││
    │  │ • checkRole (RBAC)                 ││
    │  │ • validate (Input validation)      ││
    │  │ • errorHandler                     ││
    │  └────────┬───────────────────────────┘│
    │           │                            │
    │  ┌────────▼───────────────────────────┐│
    │  │ Controllers (Xử lý request)        ││
    │  │ • auth.controller                  ││
    │  │ • job.controller                   ││
    │  │ • resume.controller                ││
    │  │ • application.controller           ││
    │  │ • admin.controller                 ││
    │  └────────┬───────────────────────────┘│
    │           │                            │
    │  ┌────────▼───────────────────────────┐│
    │  │ Services (Business Logic)          ││
    │  │ • auth.service                     ││
    │  │ • job.service                      ││
    │  │ • resume.service                   ││
    │  │ • application.service              ││
    │  └────────┬───────────────────────────┘│
    │           │                            │
    │  ┌────────▼───────────────────────────┐│
    │  │ Models (Sequelize ORM)             ││
    │  │ • User                              ││
    │  │ • Job                               ││
    │  │ • Resume                            ││
    │  │ • Application                       ││
    │  └────────┬───────────────────────────┘│
    └─────────────┬──────────────────────────┘
                  │
        ┌─────────▼─────────┐
        │   MySQL Database  │
        │                   │
        │ • users           │
        │ • jobs            │
        │ • resumes         │
        │ • applications    │
        └───────────────────┘
```

## 3.4 Thiết kế cơ sở dữ liệu

### Các bảng chính

#### Bảng `users`

| Trường | Kiểu | Ràng buộc | Mô tả |
|--------|------|----------|-------|
| id | INT | PK, AUTO_INCREMENT | ID người dùng |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Email đăng nhập |
| password | VARCHAR(255) | NOT NULL | Mật khẩu (hash bcrypt) |
| full_name | VARCHAR(255) | NOT NULL | Tên đầy đủ |
| role | ENUM | NOT NULL | Vai trò: candidate, recruiter, admin |
| phone | VARCHAR(20) | | Số điện thoại |
| company | VARCHAR(255) | | Tên công ty (cho recruiter) |
| avatar | VARCHAR(500) | | URL ảnh đại diện |
| is_active | BOOLEAN | DEFAULT 1 | Trạng thái hoạt động |
| created_at | DATETIME | NOT NULL | Thời gian tạo |
| updated_at | DATETIME | NOT NULL | Thời gian cập nhật |

#### Bảng `jobs`

| Trường | Kiểu | Ràng buộc | Mô tả |
|--------|------|----------|-------|
| id | INT | PK, AUTO_INCREMENT | ID công việc |
| user_id | INT | FK → users.id | ID recruiter đăng tin |
| job_title | VARCHAR(255) | NOT NULL | Tiêu đề công việc |
| job_type | ENUM | DEFAULT 'full-time' | Loại hình: full-time, part-time, contract, internship, freelance |
| position_level | ENUM | DEFAULT 'junior' | Cấp độ: intern, fresher, junior, middle, senior, lead, manager, director |
| city | VARCHAR(100) | NOT NULL | Thành phố/địa điểm |
| experience | VARCHAR(50) | | Yêu cầu kinh nghiệm |
| skills | TEXT | | Kỹ năng yêu cầu (tách bằng dấu phẩy) |
| job_fields | VARCHAR(255) | | Lĩnh vực công việc |
| category | VARCHAR(100) | | Danh mục |
| description | TEXT | | Mô tả chi tiết công việc |
| requirements | TEXT | | Yêu cầu cụ thể |
| benefits | TEXT | | Quyền lợi nhân viên |
| salary_min | DECIMAL(15,2) | | Mức lương tối thiểu |
| salary_max | DECIMAL(15,2) | | Mức lương tối đa |
| unit | ENUM | DEFAULT 'VND' | Đơn vị tiền: VND, USD |
| status | ENUM | DEFAULT 'open' | Trạng thái: open, closed, draft |
| deadline | DATETIME | | Hạn chót ứng tuyển |
| created_at | DATETIME | NOT NULL | Thời gian tạo |
| updated_at | DATETIME | NOT NULL | Thời gian cập nhật |

#### Bảng `resumes`

| Trường | Kiểu | Ràng buộc | Mô tả |
|--------|------|----------|-------|
| id | INT | PK, AUTO_INCREMENT | ID hồ sơ |
| user_id | INT | FK → users.id | ID ứng viên |
| file_name | VARCHAR(255) | NOT NULL | Tên file gốc |
| file_path | VARCHAR(500) | NOT NULL | Đường dẫn file trên server |
| file_size | INT | | Kích thước file (bytes) |
| category | VARCHAR(100) | | Danh mục/lĩnh vực |
| resume_text | LONGTEXT | | Nội dung text trích xuất từ PDF |
| is_primary | BOOLEAN | DEFAULT 0 | Có phải hồ sơ chính không? |
| status | ENUM | DEFAULT 'pending' | Trạng thái: pending, approved, rejected |
| created_at | DATETIME | NOT NULL | Thời gian tạo |
| updated_at | DATETIME | NOT NULL | Thời gian cập nhật |

#### Bảng `applications`

| Trường | Kiểu | Ràng buộc | Mô tả |
|--------|------|----------|-------|
| id | INT | PK, AUTO_INCREMENT | ID đơn ứng tuyển |
| job_id | INT | FK → jobs.id | ID công việc |
| user_id | INT | FK → users.id | ID ứng viên |
| resume_id | INT | FK → resumes.id | ID hồ sơ sử dụng |
| cover_letter | TEXT | | Thư giới thiệu |
| status | ENUM | DEFAULT 'submitted' | Trạng thái: submitted, pending, reviewing, shortlisted, interviewed, offered, rejected, withdrawn |
| applied_at | DATETIME | | Thời gian nộp đơn |
| reviewed_at | DATETIME | | Thời gian xét duyệt |
| notes | TEXT | | Ghi chú từ recruiter |
| created_at | DATETIME | NOT NULL | Thời gian tạo |
| updated_at | DATETIME | NOT NULL | Thời gian cập nhật |

**Ràng buộc quan trọng:**
- UNIQUE(`job_id`, `user_id`): Đảm bảo mỗi ứng viên chỉ nộp đơn 1 lần cho mỗi công việc

### Sơ đồ mối quan hệ (ERD)

```
┌──────────────────────┐
│      users           │
├──────────────────────┤
│ id (PK)              │
│ email (UNIQUE)       │
│ password             │
│ full_name            │
│ role (ENUM)          │
│ phone                │
│ company              │
│ is_active            │
│ created_at           │
│ updated_at           │
└──────────────────────┘
   │          │         │
   │ 1:N      │ 1:N     │ 1:N
   ▼          ▼         ▼
┌──────────┐ ┌────────┐ ┌──────────────┐
│  jobs    │ │resumes │ │applications  │
└──────────┘ └────────┘ └──────────────┘
   │              │           │
   │ 1:N          │ 1:N       │ N:1
   └──────────────┼───────────┘
                  │ (resume_id)
                  │
            ┌─────▼─────┐
            │ applications
            │ (N:N qua)
            └───────────┘
```

### Các mối quan hệ

1. **Users - Jobs (1:N):**
   - Một recruiter có thể đăng nhiều công việc
   - Foreign Key: `jobs.user_id` → `users.id`

2. **Users - Resumes (1:N):**
   - Một candidate có thể tải nhiều hồ sơ
   - Foreign Key: `resumes.user_id` → `users.id`

3. **Users - Applications (1:N):**
   - Một candidate có thể nộp nhiều đơn ứng tuyển
   - Foreign Key: `applications.user_id` → `users.id`

4. **Jobs - Applications (1:N):**
   - Một công việc có thể nhận nhiều đơn ứng tuyển
   - Foreign Key: `applications.job_id` → `jobs.id`
   - Unique constraint: (`job_id`, `user_id`)

5. **Resumes - Applications (1:N):**
   - Một hồ sơ có thể được sử dụng trong nhiều đơn ứng tuyển
   - Foreign Key: `applications.resume_id` → `resumes.id`

## 3.5 Mô tả luồng hoạt động

### Luồng 1: Đăng ký và đăng nhập

```
Candidate/Recruiter
        │
        ▼
    Nhập thông tin
    (email, password, role, ...)
        │
        ▼
    Frontend validate input
    (zod schema)
        │
        ▼
    POST /api/auth/register
        │
        ▼
    ┌─────────────────────────┐
    │ Backend xác thực        │
    │ • Check email tồn tại?  │
    │ • Validate dữ liệu      │
    └─────────────────────────┘
        │
        ▼
    ┌─────────────────────────┐
    │ Hash password (bcrypt)  │
    │ Salt rounds: 10         │
    └─────────────────────────┘
        │
        ▼
    Lưu vào database
        │
        ▼
    Tạo JWT token
    (expires: 7 ngày)
        │
        ▼
    Trả về user + token
        │
        ▼
    Frontend lưu token
    vào localStorage
        │
        ▼
    Chuyển hướng đến dashboard
```

### Luồng 2: Ứng viên tìm kiếm và ứng tuyển

```
Candidate
    │
    ▼
Truy cập Job Search Page
    │
    ▼
GET /api/jobs?city=...&position_level=...
    │
    ▼
┌─────────────────────────────────────┐
│ Backend lọc công việc:              │
│ • WHERE status = 'open'             │
│ • AND city LIKE '%...%'             │
│ • AND position_level = '...'        │
│ • ... (các filter khác)             │
└─────────────────────────────────────┘
    │
    ▼
Trả về danh sách công việc (phân trang)
    │
    ▼
Candidate xem chi tiết
GET /api/jobs/:id
    │
    ▼
Ứng tuyển:
POST /api/applications
{
  job_id: ...,
  resume_id: ...,
  cover_letter: "..."
}
    │
    ▼
┌─────────────────────────────────────┐
│ Backend kiểm tra:                   │
│ • Công việc có tồn tại?             │
│ • Hồ sơ của user này có tồn tại?    │
│ • Đã ứng tuyển công việc này?       │
│   (unique constraint)               │
└─────────────────────────────────────┘
    │
    ▼
Tạo record Application
status = 'submitted'
    │
    ▼
Trả về xác nhận
    │
    ▼
Candidate nhìn thấy đơn
trong "Đơn ứng tuyển của tôi"
```

### Luồng 3: Recruiter xét duyệt ứng viên

```
Recruiter
    │
    ▼
Truy cập "Quản lý ứng tuyển"
    │
    ▼
GET /api/jobs/:jobId/applications
    │
    ▼
┌──────────────────────────────────────┐
│ Backend:                             │
│ • Kiểm tra user là recruiter?        │
│ • Kiểm tra job thuộc của recruiter?  │
│ • Lấy danh sách applications         │
│   kèm thông tin ứng viên + hồ sơ    │
└──────────────────────────────────────┘
    │
    ▼
Hiển thị danh sách ứng viên
    │
    ▼
Recruiter chọn ứng viên
để xem chi tiết
    │
    ▼
PUT /api/applications/:id/status
{
  status: "shortlisted",
  notes: "Ghi chú..."
}
    │
    ▼
┌──────────────────────────────────────┐
│ Backend cập nhật:                    │
│ • Kiểm tra quyền (là recruiter       │
│   của công việc này?)                │
│ • Cập nhật trạng thái                │
│ • Ghi lại reviewed_at timestamp      │
│ • Lưu notes                          │
└──────────────────────────────────────┘
    │
    ▼
Trả về application mới
    │
    ▼
Frontend cập nhật UI
(candidate sẽ thấy status mới
trong lần truy cập tiếp theo)
```

### Luồng 4: Admin duyệt hồ sơ

```
Admin
    │
    ▼
Truy cập "Quản lý hồ sơ"
    │
    ▼
GET /api/admin/resumes
    │
    ▼
┌──────────────────────────────────────┐
│ Backend:                             │
│ • Kiểm tra user là admin?            │
│ • Lấy danh sách tất cả resumes       │
│   (status = 'pending')               │
│ • Kèm thông tin candidate            │
└──────────────────────────────────────┘
    │
    ▼
Hiển thị danh sách hồ sơ
    │
    ▼
Admin duyệt/từ chối
PUT /api/admin/resumes/:id/status
{
  status: "approved" (hoặc "rejected")
}
    │
    ▼
┌──────────────────────────────────────┐
│ Backend cập nhật:                    │
│ • Kiểm tra quyền (admin)             │
│ • Cập nhật resume.status             │
└──────────────────────────────────────┘
    │
    ▼
Hồ sơ được duyệt/từ chối
```

---

# CHƯƠNG 4: KẾT QUẢ THỰC HIỆN VÀ KẾT LUẬN

## 4.1 Kết quả đạt được

### Chức năng đã hoàn thành

#### Backend API

✅ **Module Xác thực (Auth):**
- Đăng ký người dùng với ba vai trò (candidate, recruiter, admin)
- Đăng nhập an toàn với JWT
- Lấy thông tin cá nhân
- Cập nhật hồ sơ
- Đổi mật khẩu

✅ **Module Công việc (Job):**
- Đăng tin tuyển dụng (Recruiter)
- Cập nhật/xóa tin tuyển dụng
- Tìm kiếm và lọc công việc với 6+ tiêu chí
- Phân trang kết quả
- Xem chi tiết công việc
- Lấy danh sách công việc của recruiter
- Lấy danh mục phân loại

✅ **Module Hồ sơ (Resume):**
- Tải lên file PDF/DOC (max 5MB)
- Quản lý nhiều hồ sơ
- Đặt hồ sơ chính
- Phân loại theo lĩnh vực
- Duyệt hồ sơ (Admin)

✅ **Module Đơn ứng tuyển (Application):**
- Nộp đơn ứng tuyển
- Xem danh sách đơn của ứng viên
- Recruiter xem ứng viên của công việc
- Cập nhật trạng thái xét duyệt
- Ghi chú đánh giá

✅ **Module Quản trị (Admin):**
- Xem thống kê hệ thống (người dùng, công việc, hồ sơ, đơn ứng tuyển)
- Quản lý người dùng (xem, sửa, xóa, bật/tắt)
- Quản lý công việc
- Duyệt hồ sơ
- Quản lý trạng thái đơn ứng tuyển

✅ **Bảo mật:**
- Mã hóa mật khẩu (bcrypt)
- JWT authentication
- Role-based access control (RBAC)
- Validation input toàn bộ
- Middleware error handling

✅ **Tài liệu API:**
- Swagger/OpenAPI documentation
- Tất cả endpoints có mô tả chi tiết
- Schema request/response

#### Frontend Web

✅ **Trang chính (Home Page):**
- Giới thiệu về nền tảng
- Các tính năng chính
- Link đăng nhập/đăng ký

✅ **Xác thực:**
- Form đăng nhập với validation
- Form đăng ký ba vai trò
- Lưu JWT token
- Quản lý session

✅ **Dashboard Ứng viên:**
- Xem thống kê cá nhân
- Nhanh chóng ứng tuyển
- Quản lý đơn ứng tuyển
- Quản lý hồ sơ

✅ **Tìm kiếm công việc:**
- Giao diện tìm kiếm trực quan
- Bộ lọc: địa điểm, loại hình, cấp độ, lĩnh vực
- Danh sách kết quả phân trang
- Chi tiết công việc

✅ **Quản lý hồ sơ:**
- Tải lên CV
- Xem danh sách hồ sơ
- Đặt hồ sơ chính
- Xóa hồ sơ

✅ **Dashboard Recruiter:**
- Xem thống kê (số công việc, ứng viên)
- Quản lý tin tuyển dụng
- Xem ứng viên ứng tuyển
- Cập nhật trạng thái xét duyệt

✅ **Quản lý công việc:**
- Đăng tin tuyển dụng
- Sửa tin tuyển dụng
- Cập nhật trạng thái (mở/đóng/nháp)
- Xóa tin tuyển dụng

✅ **Dashboard Admin:**
- Xem thống kê hệ thống
- Quản lý người dùng
- Quản lý công việc
- Quản lý hồ sơ
- Quản lý đơn ứng tuyển

✅ **Giao diện:**
- Thiết kế hiện đại với Material-UI
- Responsive (phù hợp desktop/tablet)
- Navigation rõ ràng
- Thông báo toast cho tất cả hành động

### Công nghệ đã áp dụng

| Lĩnh vực | Công nghệ | Mục đích |
|----------|-----------|---------|
| Backend | Node.js + Express | API server |
| ORM | Sequelize | Tương tác database |
| Database | MySQL | Lưu trữ dữ liệu |
| Frontend | React + TypeScript | Giao diện |
| Build Tool | Vite | Bundler nhanh |
| UI Framework | Material-UI | Component library |
| Forms | React Hook Form | Quản lý form |
| Validation | Zod | Schema validation |
| HTTP Client | Axios | Gọi API |
| State Management | localStorage | Lưu trữ client-side |
| Authentication | JWT | Xác thực |
| Password Hashing | bcrypt | Mã hóa mật khẩu |
| Testing | Jest + Vitest | Unit testing |
| Documentation | Swagger | API docs |

## 4.2 Đánh giá ưu điểm

### Ưu điểm kiến trúc

1. **Kiến trúc MVC rõ ràng:**
   - Tách biệt Controllers, Services, Models
   - Dễ bảo trì và mở rộng
   - Code dễ test

2. **Bảo mật mạnh mẽ:**
   - JWT authentication
   - Role-based access control (RBAC)
   - Mã hóa mật khẩu bcrypt
   - Input validation toàn diện

3. **Cơ sở dữ liệu thiết kế tốt:**
   - Mối quan hệ rõ ràng
   - Ràng buộc toàn vẹn (Unique, Foreign Key)
   - Tối ưu hóa tìm kiếm (indexes)

4. **Frontend hiện đại:**
   - React 19 với hook
   - TypeScript cho type safety
   - Component tái sử dụng được
   - Responsive design

5. **Tài liệu API hoàn chỉnh:**
   - Swagger/OpenAPI
   - Có thể test trực tiếp từ UI
   - Schema chi tiết

### Ưu điểm chức năng

1. **Quy trình tuyển dụng hoàn chỉnh:**
   - Từ đăng tin → ứng tuyển → xét duyệt
   - Cấp độ và trạng thái chi tiết

2. **Quản lý hồ sơ linh hoạt:**
   - Tải lên nhiều hồ sơ
   - Phân loại theo lĩnh vực
   - Admin duyệt trước khi sử dụng

3. **Tìm kiếm mạnh mẽ:**
   - 6+ tiêu chí lọc
   - Tìm kiếm tự do
   - Phân trang hiệu quả

4. **Giao diện thân thiện:**
   - Dễ sử dụng cho người không kỹ thuật
   - Thông báo rõ ràng
   - Layout trực quan

## 4.3 Hạn chế còn tồn tại

### Hạn chế kỹ thuật

1. **Không hỗ trợ ứng dụng mobile:**
   - Chỉ có web, không có app iOS/Android
   - Người dùng mobile có trải nghiệm kém hơn

2. **Xử lý file CV còn đơn sơ:**
   - Chỉ lưu file, không extract text tự động
   - Không có OCR cho ảnh

3. **Không có tìm kiếm full-text advanced:**
   - Chỉ dùng LIKE query
   - Chậm với dataset lớn

4. **Khả năng mở rộng còn hạn chế:**
   - Không có caching (Redis)
   - Không có load balancing
   - Single database instance

5. **Chưa có email notification:**
   - Không gửi email khi có ứng viên mới
   - Không gửi email cập nhật trạng thái

### Hạn chế chức năng

1. **Không có chatting/messaging:**
   - Recruiter không thể chat trực tiếp với ứng viên
   - Phải qua email hoặc điện thoại

2. **Không có video interview:**
   - Phỏng vấn phải qua bên ngoài

3. **Không có integration bên ngoài:**
   - Không connect với LinkedIn
   - Không integrate với payment gateway

4. **Quản lý hợp đồng hạn chế:**
   - Không có digital signature
   - Không tracking lifecycle công việc đầu đủ

5. **Báo cáo/analytics cơ bản:**
   - Chỉ thống kê cơ bản
   - Không có biểu đồ chi tiết
   - Không có insights về recruitment funnel

## 4.4 Hướng phát triển trong tương lai

### Ngắn hạn (1-3 tháng)

1. **Cải thiện hiệu năng:**
   - Thêm Redis caching cho danh sách công việc
   - Tối ưu database queries
   - Thêm pagination cho danh sách người dùng

2. **Nâng cao tính năng:**
   - Gửi email notification
   - Thêm bookmark công việc yêu thích
   - Lịch sử tìm kiếm

3. **Cải thiện UX:**
   - Tối ưu responsive cho mobile
   - Thêm dark mode
   - Improve loading time

### Trung hạn (3-6 tháng)

1. **Ứng dụng mobile:**
   - React Native hoặc Flutter app
   - Tối ưu cho mobile user experience
   - Push notification

2. **Advanced searching:**
   - Elasticsearch hoặc Typesense
   - Full-text search
   - Auto-complete suggestions

3. **Video interview:**
   - Integration với Zoom hoặc WebRTC
   - Record và playback

4. **Email notification:**
   - Automatic emails khi có updates
   - Email templates
   - Unsubscribe management

### Dài hạn (6-12 tháng)

1. **AI/Machine Learning:**
   - Resume matching algorithm
   - Job recommendation engine
   - Candidate scoring

2. **Advanced analytics:**
   - Dashboard thống kê chi tiết
   - Recruitment funnel analysis
   - Performance metrics

3. **Integrations:**
   - LinkedIn recruitment
   - Slack notifications
   - Google Calendar sync

4. **Scaling:**
   - Microservices architecture
   - Kubernetes deployment
   - Multi-region support

5. **Social features:**
   - Messaging/chat system
   - Company profiles
   - Employee testimonials

## 4.5 Kết luận

### Tóm tắt

Dự án Smart Recruitment Platform đã được triển khai thành công với các tính năng chính:

✅ **Hoàn thành 95% yêu cầu ban đầu**
- Quản lý người dùng 3 vai trò
- Quản lý công việc và ứng tuyển
- Quản lý hồ sơ
- Quản lý admin

✅ **Chất lượng code cao:**
- Kiến trúc MVC rõ ràng
- Bảo mật mạnh mẽ (JWT + bcrypt)
- Input validation toàn diện
- Error handling chuẩn

✅ **Trải nghiệm người dùng tốt:**
- Giao diện hiện đại
- Responsive design
- Thông báo rõ ràng
- Navigation trực quan

✅ **Dễ bảo trì và mở rộng:**
- Code tổ chức rõ ràng
- Có Swagger documentation
- Unit tests cơ bản
- Configured environment variables

### Nhận xét chung

Dù còn một số hạn chế về hiệu năng và tính năng advanced, Smart Recruitment Platform là một giải pháp hoàn chỉnh cho các công ty vừa và nhỏ muốn tối ưu hóa quy trình tuyển dụng. 

Hệ thống đáp ứng được:
- **Nhu cầu cơ bản:** Đăng tin, ứng tuyển, xét duyệt
- **Yêu cầu bảo mật:** Xác thực, phân quyền, mã hóa
- **Yêu cầu kỹ thuật:** RESTful API, database normalization

Với nền tảng vững chắc này, hệ thống có thể dễ dàng phát triển thêm các tính năng advanced như AI matching, mobile app, video interview trong tương lai.

### Lời cảm ơn

Cảm ơn các giảng viên, người hướng dẫn đã trao đổi ý kiến và hỗ trợ trong quá trình thực hiện đề tài. Dự án này là kết quả của quá trình học tập, nghiên cứu kỹ lưỡng về các công nghệ hiện đại và thiết kế hệ thống.

---

## PHẦN PHỤ LỤC

### A. Hướng dẫn cài đặt

#### Yêu cầu hệ thống
- Node.js >= 18
- MySQL >= 8.0
- npm hoặc yarn

#### Bước cài đặt

**1. Clone dự án:**
```bash
git clone https://github.com/dammanhdungvn/smart-recruitment-platform.git
cd smart-recruitment-platform
```

**2. Setup Backend:**
```bash
cd backend
npm install
cp .env.example .env
# Chỉnh sửa .env với database credentials của bạn
npm run dev
```

**3. Setup Frontend:**
```bash
cd frontend
npm install
cp .env.example .env
# .env: VITE_API_URL=http://localhost:5000/api
npm run dev
```

**4. Import database:**
```bash
mysql -u root -p smart_recruitment < database_import/Dump20260105.sql
```

**5. Truy cập:**
- Frontend: http://localhost:5173
- API Docs: http://localhost:5000/api/docs

#### Tài khoản test
- Admin: admin@example.com / password123
- Recruiter: recruiter@example.com / password123
- Candidate: candidate@example.com / password123

### B. API Endpoints

#### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/profile` - Lấy hồ sơ
- `PUT /api/auth/profile` - Cập nhật hồ sơ

#### Jobs
- `GET /api/jobs` - Danh sách công việc
- `POST /api/jobs` - Tạo công việc
- `GET /api/jobs/:id` - Chi tiết công việc
- `PUT /api/jobs/:id` - Cập nhật công việc

#### Applications
- `POST /api/applications` - Nộp đơn
- `GET /api/applications` - Danh sách đơn
- `PUT /api/applications/:id/status` - Cập nhật trạng thái

#### Admin
- `GET /api/admin/stats` - Thống kê
- `GET /api/admin/users` - Quản lý người dùng
- `GET /api/admin/resumes` - Quản lý hồ sơ

### C. Cấu trúc thư mục

```
smart-recruitment-platform/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── validators/
│   │   └── utils/
│   ├── tests/
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── contexts/
│   │   └── types/
│   └── package.json
├── database_import/
│   └── Dump20260105.sql
└── docs/
    └── baocao.md
```

### D. Công nghệ chính

- **Backend:** Node.js, Express.js, Sequelize, MySQL
- **Frontend:** React, TypeScript, Material-UI, Vite
- **Authentication:** JWT, bcrypt
- **Documentation:** Swagger/OpenAPI

---

**Ngày hoàn thành:** Tháng 01 năm 2026  
**Trạng thái:** ✅ Hoàn thành
