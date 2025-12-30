import type { Job } from './job.types';
import type { Resume } from './resume.types';
import type { User } from './user.types';

export interface Application {
  id: number;
  job_id: number;
  user_id: number;
  resume_id: number;
  cover_letter?: string;
  status: 'pending' | 'reviewing' | 'shortlisted' | 'rejected' | 'accepted' | 'withdrawn';
  applied_at: string;
  reviewed_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  Job?: Job;
  Resume?: Resume;
  User?: User;
}

export interface ApplicationFormData {
  job_id: number;
  resume_id: number;
  cover_letter?: string;
}

export interface UpdateApplicationStatusData {
  status: 'pending' | 'reviewing' | 'shortlisted' | 'rejected' | 'accepted';
  notes?: string;
}
