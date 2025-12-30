export interface Resume {
  id: number;
  user_id: number;
  file_name: string;
  file_path: string;
  file_size: number;
  category?: string;
  resume_text?: string;
  is_primary: boolean;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface ResumeUploadData {
  resume: File;
  category?: string;
  resume_text?: string;
  is_primary?: boolean;
}

export interface ResumeListResponse {
  resumes: Resume[];
}
