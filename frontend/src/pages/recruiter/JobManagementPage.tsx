import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
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
  TablePagination,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  Autocomplete,
} from "@mui/material";
import { Edit, Delete, Visibility, LockOpen, Lock } from "@mui/icons-material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { jobService } from "../../services/jobService";
import type { Job, JobFormData } from "../../types/job.types";
import { formatSalary, formatDate } from "../../utils/formatters";
import { JOB_TYPES, CITIES, POSITION_LEVELS } from "../../utils/constants";
import toast from "react-hot-toast";

// Memoized table row component để tránh re-render không cần thiết
const JobTableRow = React.memo(
  ({
    job,
    onView,
    onEdit,
    onToggleStatus,
    onDelete,
    getStatusColor,
  }: {
    job: Job;
    onView: (id: number) => void;
    onEdit: (job: Job) => void;
    onToggleStatus: (id: number, status: "open" | "closed") => void;
    onDelete: (id: number) => void;
    getStatusColor: (status: string) => string;
  }) => (
    <TableRow
      sx={{
        "&:hover": { bgcolor: "rgba(0, 0, 0, 0.02)" },
      }}
    >
      <TableCell sx={{ fontWeight: 600, fontSize: "0.95rem" }}>
        {job.job_title}
      </TableCell>
      <TableCell sx={{ fontSize: "0.9rem" }}>{job.city}</TableCell>
      <TableCell sx={{ fontSize: "0.9rem" }}>{job.job_type}</TableCell>
      <TableCell sx={{ fontSize: "0.9rem" }}>
        {job.category || job.job_fields || "-"}
      </TableCell>
      <TableCell sx={{ fontSize: "0.9rem" }}>
        {formatSalary(job.salary_min, job.salary_max, job.unit)}
      </TableCell>
      <TableCell>
        <Chip
          label={(job.status || "").toUpperCase()}
          size="small"
          sx={{
            bgcolor: `${getStatusColor(job.status)}15`,
            color: getStatusColor(job.status),
            fontWeight: 700,
            fontSize: "0.75rem",
            height: 24,
          }}
        />
      </TableCell>
      <TableCell sx={{ fontSize: "0.9rem" }}>
        {formatDate((job as any).created_at || (job as any).createdAt)}
      </TableCell>
      <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
        <Tooltip title="Xem ứng viên">
          <IconButton size="small" onClick={() => onView(job.id)}>
            <Visibility fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Chỉnh sửa">
          <IconButton size="small" onClick={() => onEdit(job)}>
            <Edit fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title={job.status === "open" ? "Đóng tin" : "Mở tin"}>
          <IconButton
            size="small"
            onClick={() =>
              onToggleStatus(job.id, job.status === "open" ? "closed" : "open")
            }
          >
            {job.status === "open" ? (
              <Lock fontSize="small" />
            ) : (
              <LockOpen fontSize="small" />
            )}
          </IconButton>
        </Tooltip>
        <Tooltip title="Xóa">
          <IconButton
            size="small"
            onClick={() => onDelete(job.id)}
            color="error"
          >
            <Delete fontSize="small" />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  )
);

JobTableRow.displayName = "JobTableRow";

const JobManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  const [fieldSearch, setFieldSearch] = useState("");

  const [formData, setFormData] = useState<JobFormData>({
    job_title: "",
    city: "",
    job_type: "full-time",
    position_level: "junior",
    job_fields: "",
    category: "",
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

  // Memoize normalizeOption function
  const normalizeOption = useCallback((value: string, options: string[]) => {
    if (!value) return "";
    const match = options.find(
      (option) => option.toLowerCase() === value.toLowerCase()
    );
    return match || "";
  }, []);

  // Memoize getStatusColor
  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case "open":
        return "#2e7d32";
      case "closed":
        return "#d32f2f";
      case "draft":
        return "#ed6c02";
      default:
        return "#757575";
    }
  }, []);

  // Memoize filtered categories for better performance
  // const filteredCategories = useMemo(() => {
  //   if (!categorySearch) return categories.slice(0, 50); // Limit initial render
  //   return categories
  //     .filter((cat) => cat.toLowerCase().includes(categorySearch.toLowerCase()))
  //     .slice(0, 50);
  // }, [categories, categorySearch]);

  // const filteredFieldCategories = useMemo(() => {
  //   if (!fieldSearch) return categories.slice(0, 50);
  //   return categories
  //     .filter((cat) => cat.toLowerCase().includes(fieldSearch.toLowerCase()))
  //     .slice(0, 50);
  // }, [categories, fieldSearch]);

  // Load categories once on mount
  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      if (categories.length > 0) return;

      setCategoriesLoading(true);
      try {
        const data = await jobService.getCategories();
        if (isMounted) {
          setCategories(data);
        }
      } catch (error) {
        console.error("Failed to load categories:", error);
      } finally {
        if (isMounted) {
          setCategoriesLoading(false);
        }
      }
    };

    loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch jobs with abort controller
  const fetchJobs = useCallback(
    async (signal?: AbortSignal, pageIndex = page, size = pageSize) => {
      setLoading(true);
      const timeoutMs = 12000;

      try {
        const {
          jobs: fetchedJobs,
          count,
          pagination,
        } = await jobService.getMyJobs({
          signal,
          timeoutMs,
          page: pageIndex + 1,
          limit: size,
        });
        setJobs(fetchedJobs);
        setTotal(count ?? pagination?.total ?? fetchedJobs.length);
      } catch (error: any) {
        if (axios.isCancel(error)) {
          return;
        }

        if (error?.code === "ECONNABORTED") {
          toast.error("Máy chủ không phản hồi. Vui lòng thử lại.");
          return;
        }

        toast.error(
          error?.response?.data?.message || "Không thể tải danh sách công việc"
        );
      } finally {
        setLoading(false);
      }
    },
    [page, pageSize]
  );

  // Initial load
  useEffect(() => {
    const controller = new AbortController();

    fetchJobs(controller.signal, page, pageSize);

    if (searchParams.get("action") === "create") {
      setDialogOpen(true);
    }

    return () => controller.abort();
  }, []);

  const handleChangePage = useCallback(
    (_: unknown, newPage: number) => {
      setPage(newPage);
      fetchJobs(undefined, newPage, pageSize);
    },
    [fetchJobs, pageSize]
  );

  const handleChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newSize = parseInt(event.target.value, 10);
      setPageSize(newSize);
      setPage(0);
      fetchJobs(undefined, 0, newSize);
    },
    [fetchJobs]
  );

  const handleOpenDialog = useCallback(
    async (job?: Job) => {
      if (job) {
        setEditingJob(job);
        setFormData({
          job_title: job.job_title || "",
          city: normalizeOption(job.city || "", CITIES),
          job_type: job.job_type,
          position_level: job.position_level,
          job_fields: normalizeOption(job.job_fields || "", categories),
          category: normalizeOption(job.category || "", categories),
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
          category: "",
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
    },
    [categories, normalizeOption]
  );

  const handleCloseDialog = useCallback(() => {
    setDialogOpen(false);
    setEditingJob(null);
    setCategorySearch("");
    setFieldSearch("");
  }, []);

  const handleChange = useCallback((field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback(async () => {
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
  }, [formData, editingJob, handleCloseDialog, fetchJobs]);

  const handleDelete = useCallback(
    async (id: number) => {
      if (!confirm("Bạn có chắc muốn xóa tin tuyển dụng này?")) return;

      try {
        await jobService.deleteJob(id);
        toast.success("Đã xóa tin tuyển dụng");
        fetchJobs();
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Không thể xóa");
      }
    },
    [fetchJobs]
  );

  const handleUpdateStatus = useCallback(
    async (id: number, status: "open" | "closed") => {
      try {
        await jobService.updateJobStatus(id, status);
        toast.success("Cập nhật trạng thái thành công");
        fetchJobs();
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || "Không thể cập nhật trạng thái"
        );
      }
    },
    [fetchJobs]
  );

  const handleViewApplications = useCallback(
    (id: number) => {
      navigate(`/recruiter/applications/${id}`);
    },
    [navigate]
  );

  if (loading && jobs.length === 0) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ px: { xs: 2, md: 4 } }}>
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 900 }}>
            Quản lý tin tuyển dụng
          </Typography>
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
          <Paper
            elevation={0}
            sx={{
              borderRadius: "16px",
              border: "1px solid rgba(0, 0, 0, 0.08)",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
              overflow: "hidden",
            }}
          >
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "rgba(0, 0, 0, 0.02)" }}>
                    <TableCell sx={{ fontWeight: 700, fontSize: "0.9rem" }}>
                      Tiêu đề
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: "0.9rem" }}>
                      Thành phố
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: "0.9rem" }}>
                      Loại
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: "0.9rem" }}>
                      Danh mục
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: "0.9rem" }}>
                      Lương
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: "0.9rem" }}>
                      Trạng thái
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: "0.9rem" }}>
                      Ngày tạo
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: 700, fontSize: "0.9rem" }}
                      align="right"
                    >
                      Hành động
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {jobs.map((job) => (
                    <JobTableRow
                      key={job.id}
                      job={job}
                      onView={handleViewApplications}
                      onEdit={handleOpenDialog}
                      onToggleStatus={handleUpdateStatus}
                      onDelete={handleDelete}
                      getStatusColor={getStatusColor}
                    />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={total}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={pageSize}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 20, 50]}
              labelRowsPerPage="Số dòng mỗi trang"
              sx={{
                borderTop: "1px solid rgba(0, 0, 0, 0.08)",
                ".MuiTablePagination-toolbar": { minHeight: 56 },
              }}
            />
          </Paper>
        )}
      </Box>

      {/* Job Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        disablePortal
        keepMounted={false}
      >
        <DialogTitle>
          {editingJob ? "Chỉnh sửa tin tuyển dụng" : "Đăng tin tuyển dụng mới"}
        </DialogTitle>
        <DialogContent>
          {categoriesLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
            >
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
                  onChange={(e) =>
                    handleChange("position_level", e.target.value)
                  }
                >
                  {POSITION_LEVELS.map((level) => (
                    <MenuItem key={level.value} value={level.value}>
                      {level.label}
                    </MenuItem>
                  ))}
                </TextField>

                <Autocomplete
                  fullWidth
                  options={categories}
                  value={formData.job_fields || null}
                  onChange={(_, newValue) =>
                    handleChange("job_fields", newValue || "")
                  }
                  inputValue={fieldSearch}
                  onInputChange={(_, newInputValue) =>
                    setFieldSearch(newInputValue)
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Lĩnh vực *"
                      required
                      placeholder="Tìm kiếm lĩnh vực..."
                    />
                  )}
                  noOptionsText="Không tìm thấy lĩnh vực"
                  filterOptions={(options, state) => {
                    const filtered = options.filter((option) =>
                      option
                        .toLowerCase()
                        .includes(state.inputValue.toLowerCase())
                    );
                    return filtered.slice(0, 50);
                  }}
                  ListboxProps={{
                    style: { maxHeight: "300px" },
                  }}
                />
              </Box>

              <Autocomplete
                fullWidth
                options={categories}
                value={formData.category || null}
                onChange={(_, newValue) =>
                  handleChange("category", newValue || "")
                }
                inputValue={categorySearch}
                onInputChange={(_, newInputValue) =>
                  setCategorySearch(newInputValue)
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Danh mục"
                    placeholder="Tìm kiếm danh mục..."
                  />
                )}
                noOptionsText="Không tìm thấy danh mục"
                filterOptions={(options, state) => {
                  const filtered = options.filter((option) =>
                    option
                      .toLowerCase()
                      .includes(state.inputValue.toLowerCase())
                  );
                  return filtered.slice(0, 50);
                }}
                ListboxProps={{
                  style: { maxHeight: "300px" },
                }}
              />

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
          )}
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
