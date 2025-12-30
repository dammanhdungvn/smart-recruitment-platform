import api from './api';
import type { ApiResponse, PaginationMeta } from '../types/api.types';
import type {
  AdminStats,
  UserListItem,
  UpdateUserStatusData,
  JobListItem,
  ApplicationListItem,
  JobFilters,
} from '../types/admin.types';

export const adminService = {
  // Dashboard Stats
  getStats: async (): Promise<ApiResponse<AdminStats>> => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  // User Management
  getUsers: async (page = 1): Promise<ApiResponse<{ users: UserListItem[]; pagination: PaginationMeta }>> => {
    const response = await api.get(`/admin/users?page=${page}`);
    return response.data;
  },

  updateUserStatus: async (userId: number, data: UpdateUserStatusData): Promise<ApiResponse<{ user: UserListItem }>> => {
    const response = await api.patch(`/admin/users/${userId}/status`, data);
    return response.data;
  },

  updateUserRole: async (userId: number, data: { role: string }): Promise<ApiResponse<{ user: UserListItem }>> => {
    const response = await api.patch(`/admin/users/${userId}/role`, data);
    return response.data;
  },

  deleteUser: async (userId: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },

  // Job Management
  getJobs: async (page = 1, filters?: JobFilters): Promise<ApiResponse<{ jobs: JobListItem[]; pagination: PaginationMeta }>> => {
    let query = `page=${page}`;
    if (filters?.status) {
      query += `&status=${filters.status}`;
    }
    if (filters?.recruiter_id) {
      query += `&recruiter_id=${filters.recruiter_id}`;
    }
    const response = await api.get(`/admin/jobs?${query}`);
    return response.data;
  },

  updateJobStatus: async (jobId: number, status: string): Promise<ApiResponse<{ job: JobListItem }>> => {
    const response = await api.patch(`/jobs/${jobId}/status`, { status });
    return response.data;
  },

  deleteJob: async (jobId: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/admin/jobs/${jobId}`);
    return response.data;
  },

  // Resume Management
  getResumes: async (page = 1): Promise<ApiResponse<{ resumes: any[]; pagination: PaginationMeta }>> => {
    const response = await api.get(`/admin/resumes?page=${page}`);
    return response.data;
  },

  updateResumeStatus: async (resumeId: number, data: { status: string }): Promise<ApiResponse<any>> => {
    const response = await api.patch(`/admin/resumes/${resumeId}/status`, data);
    return response.data;
  },

  deleteResume: async (resumeId: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/admin/resumes/${resumeId}`);
    return response.data;
  },

  // Application Management
  getApplications: async (page = 1): Promise<ApiResponse<{ applications: ApplicationListItem[]; pagination: PaginationMeta }>> => {
    const response = await api.get(`/admin/applications?page=${page}`);
    return response.data;
  },

  updateApplicationStatus: async (applicationId: number, status: string, notes?: string): Promise<ApiResponse<any>> => {
    const response = await api.patch(`/applications/${applicationId}/status`, { status, notes });
    return response.data;
  },
};
