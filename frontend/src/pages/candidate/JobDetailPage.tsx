import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";
import { jobService } from "../../services/jobService";
import { resumeService } from "../../services/resumeService";
import { applicationService } from "../../services/applicationService";
import type { Job } from "../../types/job.types";
import type { Resume } from "../../types/resume.types";
import { formatSalary, formatDate } from "../../utils/formatters";
import toast from "react-hot-toast";

const JobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(false);
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [selectedResumeId, setSelectedResumeId] = useState<number | "">("");
  const [coverLetter, setCoverLetter] = useState("");
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    if (id) {
      fetchJobDetail();
      fetchResumes();
    }
  }, [id]);

  const fetchJobDetail = async () => {
    setLoading(true);
    try {
      const response = await jobService.getJobById(Number(id));
      setJob(response.data);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Không thể tải chi tiết công việc"
      );
      navigate("/candidate/jobs");
    } finally {
      setLoading(false);
    }
  };

  const fetchResumes = async () => {
    try {
      const response = await resumeService.getResumes();
      setResumes(response.data.resumes);
    } catch (error) {
      console.error("Failed to fetch resumes:", error);
    }
  };

  const handleApply = async () => {
    if (!selectedResumeId) {
      toast.error("Vui lòng chọn CV");
      return;
    }

    setApplying(true);
    try {
      await applicationService.applyForJob({
        job_id: Number(id),
        resume_id: Number(selectedResumeId),
        cover_letter: coverLetter,
      });
      toast.success("Ứng tuyển thành công!");
      setApplyDialogOpen(false);
      navigate("/candidate/applications");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Ứng tuyển thất bại");
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!job) return null;

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Button onClick={() => navigate("/candidate/jobs")} sx={{ mb: 2 }}>
          ← Quay lại
        </Button>

        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            {job.job_title}
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Chip label={job.city} sx={{ mr: 1 }} />
            <Chip label={job.job_type} sx={{ mr: 1 }} />
            <Chip label={job.position_level} sx={{ mr: 1 }} />
            <Chip
              label={formatSalary(job.salary_min, job.salary_max, job.unit)}
              color="primary"
            />
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Mô tả công việc
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
              {job.description}
            </Typography>
          </Box>

          {job.requirements && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Yêu cầu
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                {job.requirements}
              </Typography>
            </Box>
          )}

          {job.benefits && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Quyền lợi
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                {job.benefits}
              </Typography>
            </Box>
          )}

          {job.skills && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Kỹ năng yêu cầu
              </Typography>
              <Box>
                {job.skills.split(",").map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill.trim()}
                    sx={{ mr: 1, mb: 1 }}
                  />
                ))}
              </Box>
            </Box>
          )}

          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Hạn nộp:{" "}
              {job.deadline ? formatDate(job.deadline) : "Không giới hạn"}
            </Typography>
          </Box>

          <Button
            variant="contained"
            size="large"
            onClick={() => setApplyDialogOpen(true)}
          >
            Ứng tuyển ngay
          </Button>
        </Paper>
      </Box>

      {/* Apply Dialog */}
      <Dialog
        open={applyDialogOpen}
        onClose={() => setApplyDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Ứng tuyển công việc</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            select
            label="Chọn CV"
            value={selectedResumeId}
            onChange={(e) => setSelectedResumeId(Number(e.target.value))}
            margin="normal"
            required
          >
            {resumes.length === 0 ? (
              <MenuItem disabled>Bạn chưa có CV nào</MenuItem>
            ) : (
              resumes.map((resume) => (
                <MenuItem key={resume.id} value={resume.id}>
                  {resume.file_name} {resume.is_primary && "(CV chính)"}
                </MenuItem>
              ))
            )}
          </TextField>

          {resumes.length === 0 && (
            <Button
              variant="outlined"
              onClick={() => navigate("/candidate/resumes")}
              sx={{ mt: 1 }}
            >
              Tải CV lên
            </Button>
          )}

          <TextField
            fullWidth
            label="Thư xin việc (tùy chọn)"
            multiline
            rows={4}
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApplyDialogOpen(false)}>Hủy</Button>
          <Button
            onClick={handleApply}
            variant="contained"
            disabled={applying || !selectedResumeId}
          >
            {applying ? <CircularProgress size={24} /> : "Ứng tuyển"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default JobDetailPage;
