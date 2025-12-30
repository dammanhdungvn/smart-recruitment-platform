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
      const jobData = await jobService.getJobById(Number(id));
      setJob(jobData);
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

  const category = job.category || job.job_fields;
  const skills = job.skills ? job.skills.split(",").map((s) => s.trim()) : [];
  const quickInfo = [
    { label: "Địa điểm", value: job.city },
    { label: "Hình thức", value: job.job_type },
    { label: "Cấp bậc", value: job.position_level },
    { label: "Danh mục", value: category },
    { label: "Kinh nghiệm", value: job.experience || "Không yêu cầu" },
    {
      label: "Mức lương",
      value: formatSalary(job.salary_min, job.salary_max, job.unit),
    },
    {
      label: "Hạn nộp",
      value: job.deadline ? formatDate(job.deadline) : "Không giới hạn",
    },
    {
      label: "Đăng",
      value: job.created_at ? formatDate(job.created_at) : "N/A",
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Button onClick={() => navigate("/candidate/jobs")} sx={{ mb: 2 }}>
          ← Quay lại
        </Button>

        <Paper sx={{ p: 4, display: "flex", flexDirection: "column", gap: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Box>
              <Typography variant="h4" gutterBottom>
                {job.job_title}
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {job.city && <Chip label={job.city} />}
                {job.job_type && <Chip label={job.job_type} />}
                {job.position_level && <Chip label={job.position_level} />}
                {category && <Chip label={category} color="secondary" />}
                <Chip
                  label={formatSalary(job.salary_min, job.salary_max, job.unit)}
                  color="primary"
                />
                {job.status && (
                  <Chip
                    label={
                      job.status === "open"
                        ? "Đang mở"
                        : job.status === "closed"
                        ? "Đã đóng"
                        : "Nháp"
                    }
                    color={job.status === "open" ? "success" : "default"}
                  />
                )}
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ textAlign: "right" }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Hạn nộp
                </Typography>
                <Typography variant="h6">
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
            </Box>
          </Box>

          {/* Quick facts */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 1.5,
            }}
          >
            {quickInfo.map((item) => (
              <Box
                key={item.label}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "grey.200",
                  backgroundColor: "grey.50",
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  {item.label}
                </Typography>
                <Typography variant="body1" sx={{ mt: 0.5 }}>
                  {item.value || "N/A"}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Description */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" },
              gap: 3,
            }}
          >
            <Box>
              <Typography variant="h6" gutterBottom>
                Mô tả công việc
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                {job.description || "Chưa có mô tả."}
              </Typography>

              {job.requirements && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Yêu cầu
                  </Typography>
                  <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                    {job.requirements}
                  </Typography>
                </Box>
              )}

              {job.benefits && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Quyền lợi
                  </Typography>
                  <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                    {job.benefits}
                  </Typography>
                </Box>
              )}

              {skills.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Kỹ năng cần có
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {skills.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        sx={{ backgroundColor: "grey.100" }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Box>

            <Box
              sx={{
                p: 3,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "grey.200",
                background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)",
              }}
            >
              <Typography variant="subtitle1" gutterBottom>
                Tóm tắt
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Typography variant="body2">Mã tin: #{job.id}</Typography>
                <Typography variant="body2">
                  Mức lương:{" "}
                  {formatSalary(job.salary_min, job.salary_max, job.unit)}
                </Typography>
                <Typography variant="body2">
                  Hình thức: {job.job_type}
                </Typography>
                <Typography variant="body2">Địa điểm: {job.city}</Typography>
                <Typography variant="body2">
                  Hạn nộp:{" "}
                  {job.deadline ? formatDate(job.deadline) : "Không giới hạn"}
                </Typography>
              </Box>
              <Button
                fullWidth
                sx={{ mt: 3 }}
                variant="contained"
                onClick={() => setApplyDialogOpen(true)}
              >
                Ứng tuyển ngay
              </Button>
            </Box>
          </Box>
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
