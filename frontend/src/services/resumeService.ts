import api from './api';
import type { ApiResponse } from '../types/api.types';
import type { Resume, ResumeListResponse } from '../types/resume.types';

export const resumeService = {
  // Upload resume (multipart/form-data)
  uploadResume: async (formData: FormData): Promise<ApiResponse<Resume>> => {
    const response = await api.post('/resumes/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get user's resumes with pagination (page size 60)
  getResumes: async (page: number = 1): Promise<ApiResponse<ResumeListResponse>> => {
    const response = await api.get('/resumes', { params: { page } });
    return response.data;
  },

  // Get resume by ID
  getResumeById: async (id: number): Promise<ApiResponse<Resume>> => {
    const response = await api.get(`/resumes/${id}`);
    return response.data;
  },

  // Delete resume
  deleteResume: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/resumes/${id}`);
    return response.data;
  },

  // Set primary resume
  setPrimaryResume: async (id: number): Promise<ApiResponse<Resume>> => {
    const response = await api.put(`/resumes/${id}/primary`);
    return response.data;
  },

  // Get primary resume
  getPrimaryResume: async (): Promise<ApiResponse<Resume>> => {
    const response = await api.get('/resumes/primary');
    return response.data;
  },
};
