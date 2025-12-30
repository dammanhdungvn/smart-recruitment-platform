import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  MenuItem,
  Pagination,
  CircularProgress,
  Chip,
  Autocomplete,
} from "@mui/material";
import {
  LocationOnOutlined,
  WorkOutline,
  SellOutlined,
  MonetizationOnOutlined,
  AccessTime,
} from "@mui/icons-material";
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";
import { jobService } from "../../services/jobService";
import type { Job, JobFilters } from "../../types/job.types";
import { formatSalary, formatDate } from "../../utils/formatters";
import { CITIES, JOB_TYPES, PAGINATION } from "../../utils/constants";
import toast from "react-hot-toast";

const JobSearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGINATION.PAGE_SIZE,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState<JobFilters>({
    page: 1,
    search: "",
    city: "",
    job_type: "",
    category: [],
  });

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [filters.page]);

  const loadCategories = async () => {
    try {
      const categories = await jobService.getCategories();
      setCategoryOptions(categories);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Không thể tải danh mục việc làm"
      );
    }
  };

  const fetchJobs = async (overrideFilters?: JobFilters) => {
    setLoading(true);
    try {
      const activeFilters = overrideFilters || filters;
      const { jobs, pagination } = await jobService.getJobs(activeFilters);
      setJobs(jobs);
      setPagination(pagination);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Không thể tải danh sách việc làm"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const nextFilters = { ...filters, page: 1 };
    setFilters(nextFilters);
    fetchJobs(nextFilters);
  };

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setFilters({ ...filters, page: value });
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters({ ...filters, [field]: value });
  };

  const handleCategoryChange = (_: unknown, values: string[]) => {
    setFilters({ ...filters, category: values });
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Tìm việc làm
        </Typography>

        {/* Filters */}
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Tìm kiếm"
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                placeholder="Tên công việc, kỹ năng..."
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                select
                label="Thành phố"
                value={filters.city || ""}
                onChange={(e) => handleFilterChange("city", e.target.value)}
              >
                <MenuItem value="">Tất cả</MenuItem>
                {CITIES.map((city) => (
                  <MenuItem key={city} value={city}>
                    {city}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                select
                label="Loại công việc"
                value={filters.job_type || ""}
                onChange={(e) => handleFilterChange("job_type", e.target.value)}
              >
                <MenuItem value="">Tất cả</MenuItem>
                {JOB_TYPES.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Autocomplete
                multiple
                options={categoryOptions}
                value={
                  Array.isArray(filters.category)
                    ? filters.category
                    : filters.category
                    ? [filters.category]
                    : []
                }
                onChange={handleCategoryChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Danh mục"
                    placeholder="Chọn một hoặc nhiều danh mục"
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleSearch}
                sx={{ height: "56px" }}
              >
                Tìm kiếm
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* Loading */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Jobs List */}
            <Grid container spacing={3}>
              {jobs.map((job) => (
                <Grid size={{ xs: 12 }} key={job.id}>
                  <Card
                    sx={{
                      border: "1px solid",
                      borderColor: "grey.200",
                      boxShadow: "0 10px 40px rgba(15, 23, 42, 0.08)",
                      borderRadius: 3,
                    }}
                  >
                    <CardContent
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1.5,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 2,
                          flexWrap: "wrap",
                        }}
                      >
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          {job.job_title}
                        </Typography>
                        <Chip
                          icon={<AccessTime fontSize="small" />}
                          label={`Đăng ${formatDate(job.created_at)}`}
                          size="small"
                          sx={{ bgcolor: "grey.100" }}
                        />
                      </Box>

                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {job.city && (
                          <Chip
                            icon={<LocationOnOutlined fontSize="small" />}
                            label={job.city}
                            size="small"
                            sx={{ bgcolor: "grey.100" }}
                          />
                        )}
                        {job.job_type && (
                          <Chip
                            icon={<WorkOutline fontSize="small" />}
                            label={job.job_type}
                            size="small"
                            sx={{ bgcolor: "grey.100" }}
                          />
                        )}
                        {job.category && (
                          <Chip
                            icon={<SellOutlined fontSize="small" />}
                            label={job.category}
                            size="small"
                            color="secondary"
                          />
                        )}
                        <Chip
                          icon={<MonetizationOnOutlined fontSize="small" />}
                          label={formatSalary(
                            job.salary_min,
                            job.salary_max,
                            job.unit
                          )}
                          size="small"
                          color="primary"
                        />
                      </Box>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        {job.description?.substring(0, 180) || "Chưa có mô tả"}
                        ...
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: 2,
                          flexWrap: "wrap",
                        }}
                      >
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Hạn nộp
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {job.deadline
                              ? formatDate(job.deadline)
                              : "Không giới hạn"}
                          </Typography>
                        </Box>
                        <Button
                          variant="contained"
                          onClick={() => navigate(`/candidate/jobs/${job.id}`)}
                          sx={{ px: 3 }}
                        >
                          Xem chi tiết
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Pagination
                  count={pagination.totalPages}
                  page={pagination.page}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Box>
            )}
          </>
        )}
      </Box>
    </Container>
  );
};

export default JobSearchPage;
