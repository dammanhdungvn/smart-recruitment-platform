import api from './api';
import type { ApiResponse } from '../types/api.types';
import type { Job, JobFilters, JobFormData, JobListResponse } from '../types/job.types';

export const jobService = {
  // Public job listing with pagination (default page size 10, configurable)
  getJobs: async (filters: JobFilters): Promise<ApiResponse<JobListResponse>> => {
    const response = await api.get('/jobs', { params: filters });
    return response.data;
  },

  // Get job by ID
  getJobById: async (id: number): Promise<ApiResponse<Job>> => {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  },

  // Create job (recruiter only)
  createJob: async (data: JobFormData): Promise<ApiResponse<Job>> => {
    const response = await api.post('/jobs', data);
    return response.data;
  },

  // Update job (recruiter only)
  updateJob: async (id: number, data: JobFormData): Promise<ApiResponse<Job>> => {
    const response = await api.put(`/jobs/${id}`, data);
    return response.data;
  },

  // Delete job (recruiter only)
  deleteJob: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/jobs/${id}`);
    return response.data;
  },

  // Update job status (recruiter only)
  updateJobStatus: async (id: number, status: 'open' | 'closed' | 'draft'): Promise<ApiResponse<Job>> => {
    const response = await api.patch(`/jobs/${id}/status`, { status });
    return response.data;
  },

  // Get recruiter's jobs
  getMyJobs: async (): Promise<ApiResponse<{ jobs: Job[]; count: number }>> => {
    const response = await api.get('/jobs/my/jobs');
    return response.data;
  },
};
