import api from './api';
import type { ApiResponse } from '../types/api.types';
import type {
  User,
  LoginData,
  RegisterData,
  UpdateProfileData,
  ChangePasswordData
} from '../types/user.types';

export const authService = {
  login: async (data: LoginData): Promise<ApiResponse<{ user: User; token: string }>> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterData): Promise<ApiResponse<{ user: User; token: string }>> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  getProfile: async (): Promise<ApiResponse<{ user: User }>> => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (data: UpdateProfileData): Promise<ApiResponse<{ user: User }>> => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },

  changePassword: async (data: ChangePasswordData): Promise<ApiResponse<void>> => {
    const response = await api.post('/auth/change-password', data);
    return response.data;
  },
};
