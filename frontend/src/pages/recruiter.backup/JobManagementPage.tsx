import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { Edit, Delete, Visibility } from "@mui/icons-material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { jobService } from "../../services/jobService";
import type { Job, JobFormData } from "../../types/job.types";
import { formatSalary, formatDate } from "../../utils/formatters";
import { JOB_TYPES, CITIES, POSITION_LEVELS } from "../../utils/constants";
import toast from "react-hot-toast";

const JobManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<JobFormData>({
    job_title: "",
    city: "",
    job_type: "full-time",
    position_level: "junior",
    job_fields: "",
    experience: "",
    skills: "",
    description: "",
    requirements: "",
    benefits: "",
    salary_min: undefined,
    salary_max: undefined,
    unit: "VND",
    status: "open",
  });

  useEffect(() => {
    fetchJobs();
    if (searchParams.get("action") === "create") {
      handleOpenDialog();
    }
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await jobService.getMyJobs();
      setJobs(response.data.jobs);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Không thể tải danh sách công việc"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (job?: Job) => {
    if (job) {
      setEditingJob(job);
      setFormData({
        job_title: job.job_title || "",
        city: job.city || "",
        job_type: job.job_type,
        position_level: job.position_level,
        job_fields: job.job_fields || "",
        experience: job.experience,
        skills: job.skills,
        description: job.description || "",
        requirements: job.requirements || "",
        benefits: job.benefits || "",
        salary_min: job.salary_min,
        salary_max: job.salary_max,
        unit: job.unit || "VND",
        status: job.status,
      });
    } else {
      setEditingJob(null);
      setFormData({
        job_title: "",
        city: "",
        job_type: "full-time",
        position_level: "junior",
        job_fields: "",
        experience: "",
        skills: "",
        description: "",
        requirements: "",
        benefits: "",
        salary_min: undefined,
        salary_max: undefined,
        unit: "VND",
        status: "open",
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingJob(null);
  };

  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    if (!formData.job_title || !formData.city || !formData.job_fields) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    setSubmitting(true);
    try {
      if (editingJob) {
        await jobService.updateJob(editingJob.id, formData);
        toast.success("Cập nhật tin tuyển dụng thành công");
      } else {
        await jobService.createJob(formData);
        toast.success("Đăng tin tuyển dụng thành công");
      }
      handleCloseDialog();
      fetchJobs();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa tin tuyển dụng này?")) return;

    try {
      await jobService.deleteJob(id);
      toast.success("Đã xóa tin tuyển dụng");
      fetchJobs();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Không thể xóa");
    }
  };

  const handleUpdateStatus = async (id: number, status: "open" | "closed") => {
    try {
      await jobService.updateJobStatus(id, status);
      toast.success("Cập nhật trạng thái thành công");
      fetchJobs();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Không thể cập nhật trạng thái"
      );
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4">Quản lý tin tuyển dụng</Typography>
          <Button variant="contained" onClick={() => handleOpenDialog()}>
            Đăng tin mới
          </Button>
        </Box>

        {jobs.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="body1" color="text.secondary">
              Bạn chưa có tin tuyển dụng nào
            </Typography>
          </Paper>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tiêu đề</TableCell>
                  <TableCell>Thành phố</TableCell>
                  <TableCell>Lương</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Ngày tạo</TableCell>
                  <TableCell>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell>{job.job_title}</TableCell>
                    <TableCell>{job.city}</TableCell>
                    <TableCell>
                      {formatSalary(job.salary_min, job.salary_max, job.unit)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={job.status === "open" ? "Đang mở" : "Đã đóng"}
                        color={job.status === "open" ? "success" : "default"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{formatDate(job.created_at)}</TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() =>
                          navigate(`/recruiter/applications/${job.id}`)
                        }
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(job)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(job.id)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                      <Button
                        size="small"
                        onClick={() =>
                          handleUpdateStatus(
                            job.id,
                            job.status === "open" ? "closed" : "open"
                          )
                        }
                      >
                        {job.status === "open" ? "Đóng" : "Mở"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      {/* Job Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingJob ? "Chỉnh sửa tin tuyển dụng" : "Đăng tin tuyển dụng mới"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            <TextField
              fullWidth
              label="Tiêu đề công việc *"
              value={formData.job_title}
              onChange={(e) => handleChange("job_title", e.target.value)}
              required
            />

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                select
                label="Thành phố *"
                value={formData.city}
                onChange={(e) => handleChange("city", e.target.value)}
                required
              >
                {CITIES.map((city) => (
                  <MenuItem key={city} value={city}>
                    {city}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                select
                label="Loại công việc *"
                value={formData.job_type}
                onChange={(e) => handleChange("job_type", e.target.value)}
              >
                {JOB_TYPES.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                select
                label="Cấp bậc *"
                value={formData.position_level}
                onChange={(e) => handleChange("position_level", e.target.value)}
              >
                {POSITION_LEVELS.map((level) => (
                  <MenuItem key={level.value} value={level.value}>
                    {level.label}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                label="Lĩnh vực *"
                value={formData.job_fields}
                onChange={(e) => handleChange("job_fields", e.target.value)}
                placeholder="IT, Marketing, Sales..."
                required
              />
            </Box>

            <TextField
              fullWidth
              label="Kinh nghiệm yêu cầu"
              value={formData.experience}
              onChange={(e) => handleChange("experience", e.target.value)}
              placeholder="1-2 năm, 3-5 năm..."
            />

            <TextField
              fullWidth
              label="Kỹ năng (phân cách bằng dấu phẩy)"
              value={formData.skills}
              onChange={(e) => handleChange("skills", e.target.value)}
              placeholder="React, Node.js, MySQL..."
            />

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                type="number"
                label="Lương tối thiểu"
                value={formData.salary_min || ""}
                onChange={(e) =>
                  handleChange("salary_min", Number(e.target.value))
                }
              />
              <TextField
                fullWidth
                type="number"
                label="Lương tối đa"
                value={formData.salary_max || ""}
                onChange={(e) =>
                  handleChange("salary_max", Number(e.target.value))
                }
              />
              <TextField
                select
                label="Đơn vị"
                value={formData.unit}
                onChange={(e) => handleChange("unit", e.target.value)}
                sx={{ minWidth: 100 }}
              >
                <MenuItem value="VND">VND</MenuItem>
                <MenuItem value="USD">USD</MenuItem>
              </TextField>
            </Box>

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Mô tả công việc"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Yêu cầu"
              value={formData.requirements}
              onChange={(e) => handleChange("requirements", e.target.value)}
            />

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Quyền lợi"
              value={formData.benefits}
              onChange={(e) => handleChange("benefits", e.target.value)}
            />

            <TextField
              fullWidth
              select
              label="Trạng thái"
              value={formData.status}
              onChange={(e) => handleChange("status", e.target.value)}
            >
              <MenuItem value="open">Đang mở</MenuItem>
              <MenuItem value="closed">Đã đóng</MenuItem>
              <MenuItem value="draft">Nháp</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={submitting}
          >
            {submitting ? (
              <CircularProgress size={24} />
            ) : editingJob ? (
              "Cập nhật"
            ) : (
              "Đăng tin"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default JobManagementPage;
