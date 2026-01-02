# Startup Scripts

Scripts để khởi động Smart Recruitment Platform cho cả Linux/Mac và Windows.

## 🐧 Linux / Mac

### Chạy Tất Cả (Khuyên dùng)
```bash
./scripts/start-all.sh
```

### Chạy Riêng Lẻ
```bash
# Backend only
./scripts/start-backend.sh

# Frontend only
./scripts/start-frontend.sh
```

**Lưu ý:** Cần chmod +x nếu chưa có quyền thực thi:
```bash
chmod +x scripts/*.sh
```

---

## 🪟 Windows

### Chạy Tất Cả (Khuyên dùng)
Double-click vào: `scripts\start-all.bat`

Hoặc từ Command Prompt:
```cmd
scripts\start-all.bat
```

### Chạy Riêng Lẻ
```cmd
REM Backend only
scripts\start-backend.bat

REM Frontend only
scripts\start-frontend.bat
```

---

## ✨ Features

### start-all
- ✅ Tự động kiểm tra và cài dependencies
- ✅ Start cả backend và frontend cùng lúc
- ✅ Background processes (Linux/Mac) hoặc separate windows (Windows)
- ✅ URLs hiển thị sau khi start

### start-backend
- ✅ Kiểm tra node_modules → install nếu cần
- ✅ Kiểm tra .env file (required)
- ✅ Start backend server trên port 5000

### start-frontend
- ✅ Kiểm tra node_modules → install nếu cần
- ✅ Kiểm tra dist folder → build nếu cần
- ✅ Chọn giữa dev mode hoặc preview production build
- ✅ Dev: port 5173, Preview: port 4173

---

## 🔧 Requirements

### Backend (.env file required)
Tạo file `backend/.env`:
```env
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=smart_recruitment
JWT_SECRET=your-secret-key
PORT=5000
```

### Software
- Node.js >= 16.x
- npm
- MySQL >= 5.7

---

## 📦 First Time Setup

1. **Clone/Download project**
2. **Setup database:**
   ```sql
   CREATE DATABASE smart_recruitment;
   ```
3. **Create backend/.env** (see above)
4. **Run startup script:**
   - Linux/Mac: `./scripts/start-all.sh`
   - Windows: Double-click `scripts\start-all.bat`

Scripts sẽ tự động:
- Install dependencies (nếu cần)
- Build frontend (nếu cần)
- Start servers

---

## 🌐 URLs

Sau khi start:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **Swagger Docs:** http://localhost:5000/api/docs

---

## 🛑 Stopping Servers

### Linux/Mac
- `start-all.sh`: Press Ctrl+C trong terminal
- Individual scripts: Press Ctrl+C

### Windows
- `start-all.bat`: Close server windows
- Individual scripts: Press Ctrl+C trong Command Prompt window

---

## 💡 Tips

### Linux/Mac
- Chạy trong background: `./scripts/start-all.sh &`
- Xem logs: Check terminal output
- Kill processes: `pkill -f "node.*server.js"` (backend), `pkill -f "vite"` (frontend)

### Windows
- Backend chạy trong separate window → dễ monitor logs
- Frontend chạy trong separate window → dễ monitor HMR
- Có thể minimize windows để chạy background

---

## 🐛 Troubleshooting

### "node_modules not found"
→ Script tự động install, nếu fail:
```bash
cd backend && npm install
cd ../frontend && npm install
```

### ".env file not found"
→ Tạo file `backend/.env` theo template ở trên

### "Port already in use"
→ Kill process đang dùng port:
```bash
# Linux/Mac
lsof -ti:5000 | xargs kill  # Backend
lsof -ti:5173 | xargs kill  # Frontend

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### "Database connection failed"
→ Kiểm tra:
- MySQL đang chạy
- Database `smart_recruitment` đã tạo
- Credentials trong .env đúng
