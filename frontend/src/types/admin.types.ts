export interface AdminStats {
  totalUsers: number;
  totalJobs: number;
  totalResumes: number;
  totalApplications: number;
}

export interface UserListItem {
  id: number;
  email: string;
  full_name: string;
  role: 'candidate' | 'recruiter' | 'admin';
  is_active: boolean;
  created_at: string;
}

export interface UpdateUserStatusData {
  is_active: boolean;
}

export interface UpdateUserRoleData {
  role: 'candidate' | 'recruiter' | 'admin';
}

export interface JobListItem {
  id: number;
  job_title: string;
  city: string;
  job_type: string;
  status: 'draft' | 'open' | 'closed';
  recruiter_id: number;
  recruiter: {
    id: number;
    full_name: string;
    email: string;
  };
  created_at: string;
}

export interface ApplicationListItem {
  id: number;
  job_id: number;
  candidate_id: number;
  status: string;
  job: {
    id: number;
    job_title: string;
  };
  candidate: {
    id: number;
    full_name: string;
    email: string;
  };
  created_at: string;
}

export interface JobFilters {
  status?: string;
  recruiter_id?: number;
}

export interface ApplicationFilters {
  job_id?: number;
  status?: string;
}
