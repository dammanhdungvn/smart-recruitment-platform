import api from './api';
import type { ApiResponse } from '../types/api.types';
import type { Application, ApplicationFormData, UpdateApplicationStatusData } from '../types/application.types';

export const applicationService = {
  // Apply for job
  applyForJob: async (data: ApplicationFormData): Promise<ApiResponse<Application>> => {
    const response = await api.post('/applications', data);
    return response.data;
  },

  // Get user's applications (candidate)
  getUserApplications: async (): Promise<ApiResponse<Application[]>> => {
    const response = await api.get('/applications');
    return response.data;
  },

  // Get application by ID
  getApplicationById: async (id: number): Promise<ApiResponse<Application>> => {
    const response = await api.get(`/applications/${id}`);
    return response.data;
  },

  // Withdraw application (candidate)
  withdrawApplication: async (id: number): Promise<ApiResponse<Application>> => {
    const response = await api.patch(`/applications/${id}/withdraw`);
    return response.data;
  },

  // Get job applications (recruiter)
  getJobApplications: async (jobId: number): Promise<ApiResponse<Application[]>> => {
    const response = await api.get(`/applications/job/${jobId}`);
    return response.data;
  },

  // Update application status (recruiter)
  updateApplicationStatus: async (
    id: number, 
    data: UpdateApplicationStatusData
  ): Promise<ApiResponse<Application>> => {
    const response = await api.patch(`/applications/${id}/status`, data);
    return response.data;
  },
};
