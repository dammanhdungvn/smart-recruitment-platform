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
} from "@mui/material";
import { MoreVert as MoreVertIcon } from "@mui/icons-material";
import AdminLayout from "../../components/layout/AdminLayout";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import EmptyState from "../../components/admin/EmptyState";
import { adminService } from "../../services/adminService";
import type { ApplicationListItem } from "../../types/admin.types";
import toast from "react-hot-toast";

const ApplicationManagement: React.FC = () => {
  const [applications, setApplications] = useState<ApplicationListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalApplications, setTotalApplications] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedApp, setSelectedApp] = useState<ApplicationListItem | null>(
    null
  );
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
    loadApplications();
  }, [page]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminService.getApplications(page + 1);
      setApplications(response.data.applications || []);
      setTotalApplications(response.data.count || 0);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load applications");
      console.error("Failed to load applications:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    app: ApplicationListItem
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedApp(app);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleUpdateStatus = (newStatus: string) => {
    if (!selectedApp) return;

    setConfirmDialog({
      open: true,
      title: `Update Application Status`,
      message: `Are you sure you want to change application #${selectedApp.id} status to ${newStatus}?`,
      newStatus,
    });
    handleMenuClose();
  };

  const handleConfirmAction = async () => {
    if (!selectedApp || !confirmDialog.newStatus) return;

    try {
      setActionLoading(true);
      await adminService.updateApplicationStatus(
        selectedApp.id,
        confirmDialog.newStatus
      );
      toast.success("Application status updated successfully");
      setConfirmDialog({ open: false, title: "", message: "" });
      loadApplications();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to update application status"
      );
      console.error("Failed to update status:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      submitted: "#0288d1",
      pending: "#ed6c02",
      reviewing: "#1976d2",
      shortlisted: "#9c27b0",
      interviewed: "#7b1fa2",
      offered: "#2e7d32",
      rejected: "#d32f2f",
      withdrawn: "#757575",
    };
    return statusMap[status] || "#757575";
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
          Application Management
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary", mb: 4 }}>
          Manage job applications and candidate status
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: "12px" }}>
            {error}
          </Alert>
        )}

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
                    Candidate
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.875rem" }}>
                    Job Title
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.875rem" }}>
                    Status
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.875rem" }}>
                    Applied
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
                        <TableCell colSpan={6}>
                          <Skeleton variant="rectangular" height={40} />
                        </TableCell>
                      </TableRow>
                    ))
                  : applications.length === 0
                  ? null
                  : applications.map((app) => (
                      <TableRow
                        key={app.id}
                        sx={{
                          "&:hover": { bgcolor: "rgba(0, 0, 0, 0.02)" },
                        }}
                      >
                        <TableCell sx={{ fontSize: "0.875rem" }}>
                          #{app.id}
                        </TableCell>
                        <TableCell
                          sx={{ fontSize: "0.875rem", fontWeight: 600 }}
                        >
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600 }}
                            >
                              {app.candidate?.full_name || "N/A"}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ color: "text.secondary" }}
                            >
                              {app.candidate?.email || ""}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ fontSize: "0.875rem" }}>
                          {app.job?.job_title || "N/A"}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={app.status.toUpperCase()}
                            size="small"
                            sx={{
                              bgcolor: `${getStatusColor(app.status)}15`,
                              color: getStatusColor(app.status),
                              fontWeight: 600,
                              fontSize: "0.75rem",
                              height: 24,
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ fontSize: "0.875rem" }}>
                          {new Date(app.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuOpen(e, app)}
                          >
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </TableContainer>

          {!loading && applications.length === 0 && (
            <EmptyState
              title="No applications found"
              description="No applications submitted yet"
            />
          )}

          <TablePagination
            component="div"
            count={totalApplications}
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
          <MenuItem onClick={() => handleUpdateStatus("reviewing")}>
            Mark as Reviewing
          </MenuItem>
          <MenuItem onClick={() => handleUpdateStatus("shortlisted")}>
            Mark as Shortlisted
          </MenuItem>
          <MenuItem onClick={() => handleUpdateStatus("interviewed")}>
            Mark as Interviewed
          </MenuItem>
          <MenuItem onClick={() => handleUpdateStatus("offered")}>
            Mark as Offered
          </MenuItem>
          <MenuItem onClick={() => handleUpdateStatus("rejected")}>
            Mark as Rejected
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
          variant={
            confirmDialog.newStatus === "rejected" ? "danger" : "warning"
          }
          loading={actionLoading}
        />
      </Box>
    </AdminLayout>
  );
};

export default ApplicationManagement;
