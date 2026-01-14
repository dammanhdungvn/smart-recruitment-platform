# 🚀 Hướng dẫn chạy dự án

## 📦 Yêu cầu môi trường

* Git
* Database (MySQL)
* Node.js / Backend runtime (theo dự án)
* Hệ điều hành: **Windows** hoặc **Linux**

---

## ⚙️ Setup lần đầu

### Bước 1: Clone source code

```bash
git clone <repository-url>
cd <project-folder>
```

### Bước 2: Import database

* Vào thư mục:

  ```bash
  database_import
  ```

* Import file `.sql` vào database của bạn

### Bước 3: Cấu hình môi trường

* Cập nhật các file `.env` theo cấu hình local của bạn:

  * Database
  * Port
  * Secret key (nếu có)

### Bước 4: Khởi chạy dự án

* **Windows**

  ```bash
  cd .\scripts

  .\start.cmd

  ```

* **Linux / MacOS**

  ```bash
  chmod +x scripts/start-all.sh
  ./scripts/start-all.sh
  ```

---

## 🔐 Tài khoản đăng nhập demo

| Role      | Email                                                 | Password    |
| --------- | ----------------------------------------------------- | ----------- |
| Admin     | [admin@example.com](mailto:admin@example.com)         | password123 |
| Recruiter | [recruiter@example.com](mailto:recruiter@example.com) | password123 |
| Candidate | [candidate@example.com](mailto:candidate@example.com) | password123 |

---

## 🌐 Các đường dẫn quan trọng

* **Backend**:
  👉 [http://localhost:5000](http://localhost:5000)

* **Frontend**:
  👉 [http://localhost:5173](http://localhost:5173)

* **API**:
  👉 [http://localhost:5000/api](http://localhost:5000/api)

* **Swagger Docs**:
  👉 [http://localhost:5000/api/docs](http://localhost:5000/api/docs)

---

## 📌 Ghi chú

* Đảm bảo các service cần thiết (database, backend, frontend) đã được cài đặt trước khi chạy.
* Nếu gặp lỗi quyền khi chạy file `.sh`, hãy kiểm tra lại quyền thực thi (`chmod +x`).

---

