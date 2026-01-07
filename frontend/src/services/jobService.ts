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
    const rawCategories: unknown = response.data?.data?.categories || [];

    // Clean and normalize to stop duplicate keys (trim, collapse spaces, strip accents)
    const toSlug = (val: string) =>
      val
        .normalize('NFD')
        .replace(/\p{Diacritic}+/gu, '')
        .replace(/\s*,\s*/g, ',')
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();

    const cleaned = Array.isArray(rawCategories)
      ? rawCategories
          .map((item) =>
            typeof item === 'string'
              ? item.replace(/^\s*,\s*/, '').trim()
              : ''
          )
          .filter((item) => item.length > 0)
      : [];

    // De-duplicate by slug but keep first original-cased value for display
    const seen = new Set<string>();
    const unique: string[] = [];
    cleaned.forEach((value) => {
      const slug = toSlug(value);
      if (!seen.has(slug)) {
        seen.add(slug);
        unique.push(value.trim());
      }
    });

    return unique;
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
  getMyJobs: async (
    options?: {
      signal?: AbortSignal;
      timeoutMs?: number;
      page?: number;
      limit?: number;
    }
  ): Promise<{ jobs: Job[]; count: number; pagination?: any }> => {
    const response = await api.get('/jobs/my/jobs', {
      signal: options?.signal,
      timeout: options?.timeoutMs,
      params: {
        page: options?.page,
        limit: options?.limit,
      },
    });
    return response.data.data;
  },
};
