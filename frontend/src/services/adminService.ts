import api from './api';
import type { ApiResponse, PaginationMeta } from '../types/api.types';
import type {
  AdminStats,
  UserListItem,
  UpdateUserStatusData,
  UpdateUserRoleData,
  JobListItem,
  ApplicationListItem,
  JobFilters,
  ApplicationFilters,
} from '../types/admin.types';

export const adminService = {
  // Dashboard Stats
  getStats: async (): Promise<ApiResponse<AdminStats>> => {
    // Since there's no single /admin/stats endpoint, we'll aggregate from multiple endpoints
    const [usersRes, jobsRes, resumesRes, appsRes] = await Promise.all([
      api.get('/admin/users'),
      api.get('/jobs'),
      api.get('/resumes'),
      api.get('/applications'),
    ]);

    return {
      success: true,
      message: 'Stats retrieved successfully',
      data: {
        totalUsers: usersRes.data.data?.count || usersRes.data.data?.users?.length || 0,
        totalJobs: jobsRes.data.data?.pagination?.total || jobsRes.data.data?.jobs?.length || 0,
        totalResumes: resumesRes.data.data?.count || resumesRes.data.data?.resumes?.length || 0,
        totalApplications: appsRes.data.data?.count || appsRes.data.data?.applications?.length || 0,
      },
    };
  },

  // User Management
  getUsers: async (page = 1): Promise<ApiResponse<{ users: UserListItem[]; count: number; pagination?: PaginationMeta }>> => {
    const response = await api.get(`/admin/users?page=${page}`);
    return response.data;
  },

  updateUserStatus: async (userId: number, data: UpdateUserStatusData): Promise<ApiResponse<{ user: UserListItem }>> => {
    const response = await api.patch(`/admin/users/${userId}/status`, data);
    return response.data;
  },

  updateUserRole: async (userId: number, data: UpdateUserRoleData): Promise<ApiResponse<{ user: UserListItem }>> => {
    const response = await api.patch(`/admin/users/${userId}/role`, data);
    return response.data;
  },

  // Job Management
  getJobs: async (page = 1, filters?: JobFilters): Promise<ApiResponse<{ jobs: JobListItem[]; pagination: PaginationMeta }>> => {
    let query = `page=${page}`;
    if (filters?.status) query += `&status=${filters.status}`;
    if (filters?.recruiter_id) query += `&recruiter_id=${filters.recruiter_id}`;

    const response = await api.get(`/jobs?${query}`);
    return response.data;
  },

  updateJobStatus: async (jobId: number, status: string): Promise<ApiResponse<{ job: JobListItem }>> => {
    const response = await api.patch(`/jobs/${jobId}/status`, { status });
    return response.data;
  },

  // Application Management
  getApplications: async (
    page = 1,
    filters?: ApplicationFilters
  ): Promise<ApiResponse<{ applications: ApplicationListItem[]; count: number }>> => {
    let query = `page=${page}`;
    if (filters?.job_id) query += `&job_id=${filters.job_id}`;
    if (filters?.status) query += `&status=${filters.status}`;

    const response = await api.get(`/applications?${query}`);
    return response.data;
  },

  getApplicationDetail: async (id: number): Promise<ApiResponse<{ application: ApplicationListItem }>> => {
    const response = await api.get(`/applications/${id}`);
    return response.data;
  },

  updateApplicationStatus: async (
    id: number,
    status: string,
    notes?: string
  ): Promise<ApiResponse<{ application: ApplicationListItem }>> => {
    const response = await api.patch(`/applications/${id}/status`, { status, notes });
    return response.data;
  },
};
