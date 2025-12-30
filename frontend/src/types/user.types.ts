export interface User {
  id: number;
  email: string;
  role: 'candidate' | 'recruiter' | 'admin';
  full_name: string;
  phone?: string;
  avatar?: string;
  company?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  full_name: string;
  role?: 'candidate' | 'recruiter';
  phone?: string;
}

export interface UpdateProfileData {
  full_name?: string;
  phone?: string;
  avatar?: string;
  company?: string;
}

export interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
}
