import api from './api';
import type { Job, JobFilters, JobFormData, JobListResponse } from '../types/job.types';

export const jobService = {
  // Public job listing with pagination (default page size 10, configurable)
  getJobs: async (filters: JobFilters): Promise<JobListResponse> => {
    const params: Record<string, unknown> = { ...filters };

    // Normalize category filter to comma-separated string for API compatibility
    if (Array.isArray(filters.category)) {
      params.category = filters.category.join(',');
    }

    const response = await api.get('/jobs', { params });
    return response.data.data;
  },

  // Get job by ID
  getJobById: async (id: number): Promise<Job> => {
    const response = await api.get(`/jobs/${id}`);
    return response.data.data.job;
  },

  // Get categories for filters
  getCategories: async (): Promise<string[]> => {
    const response = await api.get('/jobs/categories');
    return response.data.data.categories || [];
  },

  // Create job (recruiter only)
  createJob: async (data: JobFormData): Promise<Job> => {
    const response = await api.post('/jobs', data);
    return response.data.data.job;
  },

  // Update job (recruiter only)
  updateJob: async (id: number, data: JobFormData): Promise<Job> => {
    const response = await api.put(`/jobs/${id}`, data);
    return response.data.data.job;
  },

  // Delete job (recruiter only)
  deleteJob: async (id: number): Promise<void> => {
    await api.delete(`/jobs/${id}`);
  },

  // Update job status (recruiter only)
  updateJobStatus: async (id: number, status: 'open' | 'closed' | 'draft'): Promise<Job> => {
    const response = await api.patch(`/jobs/${id}/status`, { status });
    return response.data.data.job;
  },

  // Get recruiter's jobs
  getMyJobs: async (): Promise<{ jobs: Job[]; count: number }> => {
    const response = await api.get('/jobs/my/jobs');
    return response.data.data;
  },
};
