# Tài Liệu Thiết Kế Frontend - Hệ Thống Tuyển Dụng Thông Minh

## 📋 Mục Lục
1. [Tổng Quan](#1-tổng-quan)
2. [Công Nghệ Sử Dụng](#2-công-nghệ-sử-dụng)
3. [Cấu Trúc Thư Mục](#3-cấu-trúc-thư-mục)
4. [Các Components Chính](#4-các-components-chính)
5. [State Management](#5-state-management)
6. [Routing](#6-routing)
7. [API Integration](#7-api-integration)
8. [UI/UX Design](#8-uiux-design)
9. [Setup và Triển Khai](#9-setup-và-triển-khai)

---

## 1. Tổng Quan

Frontend của hệ thống được xây dựng bằng **React 18+** với **TypeScript**, sử dụng **Vite** làm build tool. Giao diện được thiết kế theo hướng **responsive**, hỗ trợ đầy đủ trên Desktop, Tablet và Mobile.

### 1.1. Mục Tiêu
- Giao diện người dùng trực quan, dễ sử dụng
- Hiệu năng cao, tải trang nhanh
- Responsive design cho mọi thiết bị
- Tích hợp mượt mà với Backend API và AI Service
- Type-safe với TypeScript

### 1.2. Người Dùng
- **Ứng viên**: Tìm việc, upload CV, ứng tuyển
- **Nhà tuyển dụng**: Đăng tin, quản lý ứng viên
- **Admin**: Quản trị hệ thống

---

## 2. Công Nghệ Sử Dụng

```json
{
  "framework": "React 18+",
  "language": "TypeScript",
  "build_tool": "Vite",
  "ui_library": "Material-UI (MUI) hoặc Tailwind CSS + shadcn/ui",
  "state_management": "React Context API + useReducer",
  "http_client": "Axios",
  "routing": "React Router v6",
  "form_handling": "React Hook Form + Zod",
  "charts": "Recharts",
  "date_picker": "@mui/x-date-pickers hoặc react-datepicker",
  "icons": "React Icons hoặc MUI Icons",
  "notifications": "react-hot-toast hoặc notistack"
}
```

### 2.1. Dependencies Chính

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "axios": "^1.6.0",
    "@mui/material": "^5.14.0",
    "@mui/icons-material": "^5.14.0",
    "@emotion/react": "^11.11.0",
    "@emotion/styled": "^11.11.0",
    "react-hook-form": "^7.48.0",
    "zod": "^3.22.0",
    "@hookform/resolvers": "^3.3.0",
    "recharts": "^2.10.0",
    "react-hot-toast": "^2.4.0",
    "date-fns": "^2.30.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "@vitejs/plugin-react": "^4.2.0",
    "typescript": "^5.2.0",
    "vite": "^5.0.0",
    "eslint": "^8.55.0",
    "prettier": "^3.1.0"
  }
}
```

---

## 3. Cấu Trúc Thư Mục

```
frontend/
├── public/
│   ├── favicon.ico
│   └── logo.png
├── src/
│   ├── assets/              # Images, fonts, etc.
│   │   ├── images/
│   │   └── styles/
│   ├── components/          # React components
│   │   ├── common/          # Shared components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Loading.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── SearchBar.tsx
│   │   ├── candidate/       # Candidate-specific
│   │   │   ├── ResumeUpload.tsx
│   │   │   ├── JobCard.tsx
│   │   │   ├── ApplicationList.tsx
│   │   │   └── JobRecommendations.tsx
│   │   ├── recruiter/       # Recruiter-specific
│   │   │   ├── JobForm.tsx
│   │   │   ├── CandidateCard.tsx
│   │   │   ├── ApplicationManager.tsx
│   │   │   └── InterviewScheduler.tsx
│   │   └── admin/           # Admin-specific
│   │       ├── UserTable.tsx
│   │       ├── StatsCard.tsx
│   │       └── SkillManager.tsx
│   ├── pages/               # Page components
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   └── ForgotPasswordPage.tsx
│   │   ├── candidate/
│   │   │   ├── CandidateDashboard.tsx
│   │   │   ├── JobSearchPage.tsx
│   │   │   ├── JobDetailPage.tsx
│   │   │   ├── ResumeManagementPage.tsx
│   │   │   ├── ApplicationsPage.tsx
│   │   │   └── ProfilePage.tsx
│   │   ├── recruiter/
│   │   │   ├── RecruiterDashboard.tsx
│   │   │   ├── JobManagementPage.tsx
│   │   │   ├── CandidateSearchPage.tsx
│   │   │   ├── ApplicationsPage.tsx
│   │   │   └── InterviewsPage.tsx
│   │   ├── admin/
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── UserManagementPage.tsx
│   │   │   └── AnalyticsPage.tsx
│   │   ├── HomePage.tsx
│   │   └── NotFoundPage.tsx
│   ├── contexts/            # React Context
│   │   ├── AuthContext.tsx
│   │   ├── NotificationContext.tsx
│   │   └── ThemeContext.tsx
│   ├── hooks/               # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── useApi.ts
│   │   ├── useDebounce.ts
│   │   └── usePagination.ts
│   ├── services/            # API services
│   │   ├── api.ts           # Axios instance
│   │   ├── authService.ts
│   │   ├── candidateService.ts
│   │   ├── recruiterService.ts
│   │   ├── adminService.ts
│   │   └── mlService.ts
│   ├── types/               # TypeScript types
│   │   ├── user.types.ts
│   │   ├── job.types.ts
│   │   ├── resume.types.ts
│   │   ├── application.types.ts
│   │   └── api.types.ts
│   ├── utils/               # Utility functions
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   ├── constants.ts
│   │   └── helpers.ts
│   ├── App.tsx              # Main App component
│   ├── main.tsx             # Entry point
│   └── vite-env.d.ts
├── .env                     # Environment variables
├── .env.example
├── .eslintrc.json
├── .prettierrc
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

---

## 4. Các Components Chính

### 4.1. Common Components

#### Button Component
```typescript
// src/components/common/Button.tsx
import React from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  onClick,
  children,
  type = 'button'
}) => {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`btn btn-${variant} btn-${size}`}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
};
```

#### SearchBar Component
```typescript
// src/components/common/SearchBar.tsx
import React, { useState } from 'react';
import { useDebounce } from '../../hooks/useDebounce';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  debounceMs?: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Tìm kiếm...',
  onSearch,
  debounceMs = 500
}) => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, debounceMs);

  React.useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  return (
    <div className="search-bar">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="search-input"
      />
    </div>
  );
};
```

#### Modal Component
```typescript
// src/components/common/Modal.tsx
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Button } from './Button';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth = 'sm'
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth={maxWidth} fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      {actions && <DialogActions>{actions}</DialogActions>}
    </Dialog>
  );
};
```

### 4.2. Candidate Components

#### JobCard Component
```typescript
// src/components/candidate/JobCard.tsx
import React from 'react';
import { Job } from '../../types/job.types';
import { formatSalary, formatDate } from '../../utils/formatters';

interface JobCardProps {
  job: Job;
  onApply?: (jobId: number) => void;
  onSave?: (jobId: number) => void;
  isSaved?: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  onApply,
  onSave,
  isSaved = false
}) => {
  return (
    <div className="job-card">
      <div className="job-card-header">
        <h3>{job.title}</h3>
        <button onClick={() => onSave?.(job.id)}>
          {isSaved ? '❤️' : '🤍'}
        </button>
      </div>
      
      <div className="job-card-body">
        <p className="company">{job.company?.name}</p>
        <p className="location">📍 {job.city}</p>
        <p className="salary">💰 {formatSalary(job.salary_min, job.salary_max)}</p>
        <p className="posted-date">📅 {formatDate(job.created_at)}</p>
        
        <div className="skills">
          {job.skills?.split(',').slice(0, 3).map((skill, idx) => (
            <span key={idx} className="skill-tag">{skill.trim()}</span>
          ))}
        </div>
      </div>
      
      <div className="job-card-footer">
        <button onClick={() => onApply?.(job.id)} className="btn-apply">
          Ứng tuyển ngay
        </button>
      </div>
    </div>
  );
};
```

#### ResumeUpload Component
```typescript
// src/components/candidate/ResumeUpload.tsx
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { candidateService } from '../../services/candidateService';
import toast from 'react-hot-toast';

export const ResumeUpload: React.FC = () => {
  const [uploading, setUploading] = useState(false);

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    
    if (!file) return;
    
    if (file.type !== 'application/pdf') {
      toast.error('Chỉ chấp nhận file PDF');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File không được vượt quá 10MB');
      return;
    }

    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('resume', file);
      
      const response = await candidateService.uploadResume(formData);
      
      toast.success('Upload CV thành công!');
      console.log('CV đã được phân loại:', response.data.predicted_category);
    } catch (error) {
      toast.error('Upload thất bại. Vui lòng thử lại!');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1
  });

  return (
    <div
      {...getRootProps()}
      className={`resume-upload ${isDragActive ? 'active' : ''}`}
    >
      <input {...getInputProps()} />
      {uploading ? (
        <p>Đang upload...</p>
      ) : isDragActive ? (
        <p>Thả file vào đây...</p>
      ) : (
        <div>
          <p>Kéo thả file CV (PDF) vào đây</p>
          <p>hoặc click để chọn file</p>
        </div>
      )}
    </div>
  );
};
```

### 4.3. Recruiter Components

#### JobForm Component
```typescript
// src/components/recruiter/JobForm.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { JobFormData } from '../../types/job.types';

const jobSchema = z.object({
  title: z.string().min(5, 'Tiêu đề phải có ít nhất 5 ký tự'),
  description: z.string().min(50, 'Mô tả phải có ít nhất 50 ký tự'),
  requirements: z.string().optional(),
  job_type: z.enum(['full-time', 'part-time', 'contract', 'internship', 'freelance']),
  position_level: z.string(),
  city: z.string().min(1, 'Vui lòng chọn thành phố'),
  salary_min: z.number().min(0),
  salary_max: z.number().min(0),
  experience_required: z.string(),
  skills: z.string()
});

interface JobFormProps {
  initialData?: Partial<JobFormData>;
  onSubmit: (data: JobFormData) => Promise<void>;
  loading?: boolean;
}

export const JobForm: React.FC<JobFormProps> = ({
  initialData,
  onSubmit,
  loading = false
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: initialData
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="job-form">
      <div className="form-group">
        <label>Tiêu đề công việc *</label>
        <input {...register('title')} />
        {errors.title && <span className="error">{errors.title.message}</span>}
      </div>

      <div className="form-group">
        <label>Mô tả công việc *</label>
        <textarea {...register('description')} rows={5} />
        {errors.description && <span className="error">{errors.description.message}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Loại hợp đồng *</label>
          <select {...register('job_type')}>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
            <option value="freelance">Freelance</option>
          </select>
        </div>

        <div className="form-group">
          <label>Thành phố *</label>
          <input {...register('city')} />
          {errors.city && <span className="error">{errors.city.message}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Lương tối thiểu (VND)</label>
          <input type="number" {...register('salary_min', { valueAsNumber: true })} />
        </div>

        <div className="form-group">
          <label>Lương tối đa (VND)</label>
          <input type="number" {...register('salary_max', { valueAsNumber: true })} />
        </div>
      </div>

      <div className="form-group">
        <label>Kỹ năng yêu cầu (phân cách bằng dấu phẩy)</label>
        <input {...register('skills')} placeholder="React, Node.js, MySQL, ..." />
      </div>

      <button type="submit" disabled={loading} className="btn-submit">
        {loading ? 'Đang xử lý...' : 'Đăng tin tuyển dụng'}
      </button>
    </form>
  );
};
```

---

## 5. State Management

### 5.1. Auth Context

```typescript
// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/user.types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: any) => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('token');
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = async () => {
    try {
      const response = await authService.getProfile();
      setUser(response.data);
    } catch (error) {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await authService.login(email, password);
    localStorage.setItem('token', response.data.token);
    setUser(response.data.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const register = async (data: any) => {
    const response = await authService.register(data);
    localStorage.setItem('token', response.data.token);
    setUser(response.data.user);
  };

  const updateProfile = async (data: any) => {
    const response = await authService.updateProfile(data);
    setUser(response.data);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

---

## 6. Routing

```typescript
// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Candidate Pages
import CandidateDashboard from './pages/candidate/CandidateDashboard';
import JobSearchPage from './pages/candidate/JobSearchPage';
import JobDetailPage from './pages/candidate/JobDetailPage';

// Recruiter Pages
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import JobManagementPage from './pages/recruiter/JobManagementPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';

const PrivateRoute: React.FC<{ children: React.ReactNode; allowedRoles: string[] }> = ({
  children,
  allowedRoles
}) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  
  if (!user) return <Navigate to="/login" />;
  
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Candidate Routes */}
          <Route
            path="/candidate/*"
            element={
              <PrivateRoute allowedRoles={['candidate']}>
                <Routes>
                  <Route path="dashboard" element={<CandidateDashboard />} />
                  <Route path="jobs" element={<JobSearchPage />} />
                  <Route path="jobs/:id" element={<JobDetailPage />} />
                </Routes>
              </PrivateRoute>
            }
          />
          
          {/* Recruiter Routes */}
          <Route
            path="/recruiter/*"
            element={
              <PrivateRoute allowedRoles={['recruiter']}>
                <Routes>
                  <Route path="dashboard" element={<RecruiterDashboard />} />
                  <Route path="jobs" element={<JobManagementPage />} />
                </Routes>
              </PrivateRoute>
            }
          />
          
          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <Routes>
                  <Route path="dashboard" element={<AdminDashboard />} />
                </Routes>
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
```

---

## 7. API Integration

```typescript
// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

```typescript
// src/services/candidateService.ts
import api from './api';
import { Job, Application } from '../types';

export const candidateService = {
  // Resume APIs
  uploadResume: (formData: FormData) => 
    api.post('/candidate/resumes', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  getResumes: () => api.get('/candidate/resumes'),
  
  deleteResume: (id: number) => api.delete(`/candidate/resumes/${id}`),
  
  // Job APIs
  searchJobs: (params: any) => api.get('/candidate/jobs', { params }),
  
  getJobDetail: (id: number) => api.get(`/candidate/jobs/${id}`),
  
  getRecommendations: () => api.get('/candidate/recommendations'),
  
  // Application APIs
  applyJob: (data: any) => api.post('/candidate/applications', data),
  
  getApplications: () => api.get('/candidate/applications'),
  
  withdrawApplication: (id: number) => 
    api.put(`/candidate/applications/${id}/withdraw`),
  
  // Saved Jobs
  saveJob: (jobId: number) => api.post('/candidate/saved-jobs', { jobId }),
  
  getSavedJobs: () => api.get('/candidate/saved-jobs'),
  
  unsaveJob: (jobId: number) => api.delete(`/candidate/saved-jobs/${jobId}`)
};
```

---

## 8. UI/UX Design

### 8.1. Responsive Breakpoints

```css
/* Mobile First Approach */
/* Mobile: < 768px (default) */
/* Tablet: 768px - 1023px */
/* Desktop: >= 1024px */

@media (min-width: 768px) {
  /* Tablet styles */
}

@media (min-width: 1024px) {
  /* Desktop styles */
}
```

### 8.2. Color Scheme

```css
:root {
  /* Primary Colors */
  --primary: #1976d2;
  --primary-dark: #115293;
  --primary-light: #42a5f5;
  
  /* Secondary Colors */
  --secondary: #dc004e;
  --secondary-dark: #9a0036;
  --secondary-light: #e33371;
  
  /* Neutral Colors */
  --background: #ffffff;
  --surface: #f5f5f5;
  --text-primary: #212121;
  --text-secondary: #757575;
  --divider: #e0e0e0;
  
  /* Status Colors */
  --success: #4caf50;
  --warning: #ff9800;
  --error: #f44336;
  --info: #2196f3;
}
```

### 8.3. Typography

```css
/* Font Family */
body {
  font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
}

/* Font Sizes */
h1 { font-size: 2.5rem; }
h2 { font-size: 2rem; }
h3 { font-size: 1.75rem; }
h4 { font-size: 1.5rem; }
h5 { font-size: 1.25rem; }
h6 { font-size: 1rem; }
body { font-size: 1rem; }
small { font-size: 0.875rem; }
```

---

## 9. Setup và Triển Khai

### 9