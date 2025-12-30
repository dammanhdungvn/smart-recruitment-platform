import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
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
  Menu,
  MenuItem,
  Alert,
  Skeleton,
  FormControl,
  Select,
  InputLabel,
} from "@mui/material";
import { MoreVert as MoreVertIcon } from "@mui/icons-material";
import AdminLayout from "../../components/layout/AdminLayout";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import EmptyState from "../../components/admin/EmptyState";
import { adminService } from "../../services/adminService";
import type { JobListItem } from "../../types/admin.types";
import toast from "react-hot-toast";

const JobManagement: React.FC = () => {
  const [jobs, setJobs] = useState<JobListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalJobs, setTotalJobs] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedJob, setSelectedJob] = useState<JobListItem | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    message: string;
    newStatus?: string;
  }>({
    open: false,
    title: "",
    message: "",
  });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadJobs();
  }, [page, statusFilter]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const filters = statusFilter ? { status: statusFilter } : undefined;
      const response = await adminService.getJobs(page + 1, filters);
      setJobs(response.data.jobs || []);
      setTotalJobs(response.data.pagination?.total || 0);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load jobs");
      console.error("Failed to load jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    job: JobListItem
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedJob(job);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleUpdateStatus = (newStatus: string) => {
    if (!selectedJob) return;

    setConfirmDialog({
      open: true,
      title: `Update Job Status`,
      message: `Are you sure you want to change "${selectedJob.job_title}" status to ${newStatus}?`,
      newStatus,
    });
    handleMenuClose();
  };

  const handleDeleteJob = () => {
    if (!selectedJob) return;

    setConfirmDialog({
      open: true,
      title: `Delete Job`,
      message: `Are you sure you want to delete "${selectedJob.job_title}"? This action cannot be undone.`,
      newStatus: "DELETE",
    });
    handleMenuClose();
  };

  const handleConfirmAction = async () => {
    if (!selectedJob) return;

    try {
      setActionLoading(true);

      if (confirmDialog.newStatus === "DELETE") {
        await adminService.deleteJob(selectedJob.id);
        toast.success("Job deleted successfully");
      } else if (confirmDialog.newStatus) {
        await adminService.updateJobStatus(
          selectedJob.id,
          confirmDialog.newStatus
        );
        toast.success("Job status updated successfully");
      }

      setConfirmDialog({ open: false, title: "", message: "" });
      loadJobs();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to perform action");
      console.error("Failed to perform action:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
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
  };

  return (
    <AdminLayout>
      <Box>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 900,
            fontSize: { xs: "1.75rem", md: "2.125rem" },
            mb: 1,
          }}
        >
          Job Management
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary", mb: 4 }}>
          Manage job postings and their status
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: "12px" }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 3 }}>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Filter by Status</InputLabel>
            <Select
              value={statusFilter}
              label="Filter by Status"
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(0);
              }}
              sx={{ borderRadius: "10px" }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="open">Open</MenuItem>
              <MenuItem value="closed">Closed</MenuItem>
            </Select>
          </FormControl>
        </Box>

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
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.875rem" }}>
                    ID
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.875rem" }}>
                    Job Title
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.875rem" }}>
                    Location
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.875rem" }}>
                    Type
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.875rem" }}>
                    Recruiter
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.875rem" }}>
                    Status
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.875rem" }}>
                    Posted
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 700, fontSize: "0.875rem" }}
                    align="right"
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading
                  ? Array.from({ length: 5 }).map((_, idx) => (
                      <TableRow key={idx}>
                        <TableCell colSpan={8}>
                          <Skeleton variant="rectangular" height={40} />
                        </TableCell>
                      </TableRow>
                    ))
                  : jobs.length === 0
                  ? null
                  : jobs.map((job) => (
                      <TableRow
                        key={job.id}
                        sx={{
                          "&:hover": { bgcolor: "rgba(0, 0, 0, 0.02)" },
                        }}
                      >
                        <TableCell sx={{ fontSize: "0.875rem" }}>
                          {job.id}
                        </TableCell>
                        <TableCell
                          sx={{ fontSize: "0.875rem", fontWeight: 600 }}
                        >
                          {job.job_title}
                        </TableCell>
                        <TableCell sx={{ fontSize: "0.875rem" }}>
                          {job.city}
                        </TableCell>
                        <TableCell sx={{ fontSize: "0.875rem" }}>
                          {job.job_type}
                        </TableCell>
                        <TableCell sx={{ fontSize: "0.875rem" }}>
                          {job.recruiter?.full_name || "N/A"}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={job.status.toUpperCase()}
                            size="small"
                            sx={{
                              bgcolor: `${getStatusColor(job.status)}15`,
                              color: getStatusColor(job.status),
                              fontWeight: 600,
                              fontSize: "0.75rem",
                              height: 24,
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ fontSize: "0.875rem" }}>
                          {new Date(job.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuOpen(e, job)}
                          >
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </TableContainer>

          {!loading && jobs.length === 0 && (
            <EmptyState
              title="No jobs found"
              description="No job postings match your filter"
            />
          )}

          <TablePagination
            component="div"
            count={totalJobs}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={60}
            rowsPerPageOptions={[60]}
            sx={{
              borderTop: "1px solid rgba(0, 0, 0, 0.08)",
              ".MuiTablePagination-toolbar": { minHeight: 56 },
            }}
          />
        </Paper>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => handleUpdateStatus("open")}>
            Mark as Open
          </MenuItem>
          <MenuItem onClick={() => handleUpdateStatus("closed")}>
            Mark as Closed
          </MenuItem>
          <MenuItem onClick={() => handleUpdateStatus("draft")}>
            Mark as Draft
          </MenuItem>
          <MenuItem onClick={handleDeleteJob} sx={{ color: "error.main" }}>
            Delete Job
          </MenuItem>
        </Menu>

        <ConfirmDialog
          open={confirmDialog.open}
          title={confirmDialog.title}
          message={confirmDialog.message}
          onConfirm={handleConfirmAction}
          onCancel={() =>
            setConfirmDialog({ open: false, title: "", message: "" })
          }
          confirmText="Confirm"
          cancelText="Cancel"
          variant="warning"
          loading={actionLoading}
        />
      </Box>
    </AdminLayout>
  );
};

export default JobManagement;
