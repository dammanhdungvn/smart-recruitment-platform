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
} from "@mui/material";
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
  });

  useEffect(() => {
    fetchJobs();
  }, [filters.page]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await jobService.getJobs(filters);
      setJobs(response.data.jobs);
      setPagination(response.data.pagination);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Không thể tải danh sách việc làm"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setFilters({ ...filters, page: 1 });
    fetchJobs();
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
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {job.job_title}
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Chip label={job.city} size="small" sx={{ mr: 1 }} />
                        <Chip
                          label={job.job_type}
                          size="small"
                          sx={{ mr: 1 }}
                        />
                        <Chip
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
                        sx={{ mb: 2 }}
                      >
                        {job.description?.substring(0, 200)}...
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          Đăng {formatDate(job.created_at)}
                        </Typography>
                        <Button
                          variant="contained"
                          onClick={() => navigate(`/candidate/jobs/${job.id}`)}
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
