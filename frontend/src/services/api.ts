import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
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
  (error) => {
    toast.error('Lỗi kết nối. Vui lòng thử lại.');
    return Promise.reject(error);
  }
);

// Response interceptor with comprehensive error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any>) => {
    // Network error
    if (!error.response) {
      toast.error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.');
      return Promise.reject(error);
    }

    const { status, data } = error.response;
    const message = data?.message || data?.error || 'Đã xảy ra lỗi';

    // Handle specific status codes
    switch (status) {
      case 400:
        toast.error(message || 'Dữ liệu không hợp lệ');
        break;
      case 401:
        toast.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Delay redirect to show toast
        setTimeout(() => {
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
        }, 1000);
        break;
      case 403:
        toast.error('Bạn không có quyền truy cập');
        break;
      case 404:
        toast.error('Không tìm thấy tài nguyên');
        break;
      case 409:
        toast.error(message || 'Dữ liệu đã tồn tại');
        break;
      case 422:
        // Validation errors
        if (data?.errors && Array.isArray(data.errors)) {
          data.errors.forEach((err: any) => {
            toast.error(err.message || err.msg);
          });
        } else {
          toast.error(message);
        }
        break;
      case 429:
        toast.error('Bạn đang thao tác quá nhanh. Vui lòng thử lại sau.');
        break;
      case 500:
        toast.error('Lỗi máy chủ. Vui lòng thử lại sau.');
        break;
      case 503:
        toast.error('Dịch vụ tạm thời không khả dụng. Vui lòng thử lại sau.');
        break;
      default:
        toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default api;
