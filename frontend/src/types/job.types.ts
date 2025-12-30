export interface Job {
  id: number;
  job_title: string;
  city: string;
  job_type: 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance';
  position_level: string;
  job_fields: string;
  category?: string;
  experience: string;
  skills: string;
  description?: string;
  requirements?: string;
  benefits?: string;
  salary_min?: number;
  salary_max?: number;
  unit?: 'VND' | 'USD';
  status: 'open' | 'closed' | 'draft';
  deadline?: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface JobFilters {
  city?: string;
  job_type?: string;
  position_level?: string;
  job_fields?: string;
  category?: string | string[];
  categories?: string[]; // optional convenience for UI multi-select
  skills?: string;
  search?: string;
  page?: number;
}

export interface JobFormData {
  job_title: string;
  city: string;
  job_type: 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance';
  position_level: string;
  job_fields: string;
  category?: string;
  experience: string;
  skills: string;
  description?: string;
  requirements?: string;
  benefits?: string;
  salary_min?: number;
  salary_max?: number;
  unit?: 'VND' | 'USD';
  status?: 'open' | 'closed' | 'draft';
  deadline?: string;
}

export interface JobListResponse {
  jobs: Job[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
