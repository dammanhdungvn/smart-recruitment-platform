export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const JOB_TYPES = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Hợp đồng' },
  { value: 'internship', label: 'Thực tập' },
  { value: 'freelance', label: 'Freelance' },
];

export const POSITION_LEVELS = [
  { value: 'intern', label: 'Thực tập sinh' },
  { value: 'junior', label: 'Junior' },
  { value: 'middle', label: 'Middle/Senior' },
  { value: 'senior', label: 'Senior' },
  { value: 'lead', label: 'Lead' },
  { value: 'manager', label: 'Manager' },
];

export const CITIES = [
  'Hà Nội',
  'Hồ Chí Minh',
  'Đà Nẵng',
  'Hải Phòng',
  'Cần Thơ',
  'Bình Dương',
  'Đồng Nai',
  'Khánh Hòa',
  'Lâm Đồng',
  'Quảng Nam',
];

export const APPLICATION_STATUSES = [
  { value: 'pending', label: 'Chờ xử lý', color: '#808080' },
  { value: 'reviewing', label: 'Đang xét duyệt', color: '#2196f3' },
  { value: 'shortlisted', label: 'Đã chọn', color: '#4caf50' },
  { value: 'rejected', label: 'Từ chối', color: '#f44336' },
  { value: 'accepted', label: 'Chấp nhận', color: '#4caf50' },
  { value: 'withdrawn', label: 'Đã rút', color: '#808080' },
];

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  PAGE_SIZE: 60,
};

export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: ['application/pdf'],
};
