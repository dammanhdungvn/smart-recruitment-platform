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
import {
  MoreVert as MoreVertIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import AdminLayout from "../../components/layout/AdminLayout";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import EmptyState from "../../components/admin/EmptyState";
import { adminService } from "../../services/adminService";
import toast from "react-hot-toast";

interface Resume {
  id: number;
  user_id: number;
  file_name: string;
  file_path: string;
  file_size: number;
  category?: string;
  is_primary: boolean;
  status?: "pending" | "approved" | "rejected";
  created_at: string;
  candidate?: {
    id: number;
    full_name: string;
    email: string;
  };
}

const ResumeManagement: React.FC = () => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalResumes, setTotalResumes] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: "delete" | "status" | null;
    title: string;
    message: string;
    newValue?: any;
  }>({
    open: false,
    type: null,
    title: "",
    message: "",
  });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadResumes();
  }, [page]);

  const loadResumes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminService.getResumes(page + 1);
      setResumes(response.data.resumes || []);
      setTotalResumes(response.data.pagination?.total || 0);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load resumes");
      console.error("Failed to load resumes:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    resume: Resume
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedResume(resume);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleViewDetails = () => {
    if (!selectedResume) return;

    const details = `
Resume Details:
━━━━━━━━━━━━━━━━━━━━
ID: ${selectedResume.id}
Candidate: ${selectedResume.candidate?.full_name || "N/A"}
Email: ${selectedResume.candidate?.email || "N/A"}
File Name: ${selectedResume.file_name}
Category: ${selectedResume.category || "N/A"}
Size: ${formatFileSize(selectedResume.file_size)}
Status: ${(selectedResume.status || "pending").toUpperCase()}
Uploaded: ${new Date(selectedResume.created_at).toLocaleString()}
File Path: ${selectedResume.file_path}
    `.trim();

    alert(details);
    handleMenuClose();
  };

  const handleDownload = () => {
    if (!selectedResume) return;

    const fileBaseUrl =
      import.meta.env.VITE_API_URL?.replace(/\/?api$/, "") ||
      "http://localhost:5000";
    const downloadUrl = `${fileBaseUrl}/${selectedResume.file_path}`;
    window.open(downloadUrl, "_blank");
    handleMenuClose();
  };

  const handleDeleteResume = () => {
    if (!selectedResume) return;

    setConfirmDialog({
      open: true,
      type: "delete",
      title: `Delete Resume`,
      message: `Are you sure you want to delete resume "${selectedResume.file_name}"? This action cannot be undone.`,
    });
    handleMenuClose();
  };

  const handleChangeStatus = (
    newStatus: "pending" | "approved" | "rejected"
  ) => {
    if (!selectedResume) return;

    setConfirmDialog({
      open: true,
      type: "status",
      title: "Change Resume Status",
      message: `Are you sure you want to change the status of "${selectedResume.file_name}" to "${newStatus}"?`,
      newValue: newStatus,
    });
    handleMenuClose();
  };

  const handleConfirmAction = async () => {
    if (!selectedResume) return;

    try {
      setActionLoading(true);
      if (confirmDialog.type === "delete") {
        await adminService.deleteResume(selectedResume.id);
        toast.success("Resume deleted successfully");
      } else if (confirmDialog.type === "status") {
        // Call API to update resume status (assuming this endpoint exists)
        await adminService.updateResumeStatus(selectedResume.id, {
          status: confirmDialog.newValue,
        });
        toast.success(
          `Resume status updated to ${confirmDialog.newValue} successfully`
        );
      }
      setConfirmDialog({ open: false, type: null, title: "", message: "" });
      loadResumes();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to perform action");
      console.error("Failed to perform action:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
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
          Resume Management
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary", mb: 4 }}>
          Manage candidate resumes and documents
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
                    File Name
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.875rem" }}>
                    Category
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.875rem" }}>
                    Size
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.875rem" }}>
                    Status
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.875rem" }}>
                    Uploaded
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
                  : resumes.length === 0
                  ? null
                  : resumes.map((resume) => (
                      <TableRow
                        key={resume.id}
                        sx={{
                          "&:hover": { bgcolor: "rgba(0, 0, 0, 0.02)" },
                        }}
                      >
                        <TableCell sx={{ fontSize: "0.875rem" }}>
                          {resume.id}
                        </TableCell>
                        <TableCell sx={{ fontSize: "0.875rem" }}>
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600 }}
                            >
                              {resume.candidate?.full_name || "N/A"}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ color: "text.secondary" }}
                            >
                              {resume.candidate?.email || ""}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell
                          sx={{ fontSize: "0.875rem", fontWeight: 600 }}
                        >
                          {resume.file_name}
                        </TableCell>
                        <TableCell sx={{ fontSize: "0.875rem" }}>
                          {resume.category || "N/A"}
                        </TableCell>
                        <TableCell sx={{ fontSize: "0.875rem" }}>
                          {formatFileSize(resume.file_size)}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={(resume.status || "pending").toUpperCase()}
                            size="small"
                            sx={{
                              bgcolor:
                                resume.status === "approved"
                                  ? "#2e7d3215"
                                  : resume.status === "rejected"
                                  ? "#d32f2f15"
                                  : "#ed6c0215",
                              color:
                                resume.status === "approved"
                                  ? "#2e7d32"
                                  : resume.status === "rejected"
                                  ? "#d32f2f"
                                  : "#ed6c02",
                              fontWeight: 600,
                              fontSize: "0.75rem",
                              height: 24,
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ fontSize: "0.875rem" }}>
                          {new Date(resume.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuOpen(e, resume)}
                          >
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </TableContainer>

          {!loading && resumes.length === 0 && (
            <EmptyState
              title="No resumes found"
              description="No candidate resumes uploaded yet"
            />
          )}

          <TablePagination
            component="div"
            count={totalResumes}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={20}
            rowsPerPageOptions={[20]}
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
          <MenuItem onClick={handleViewDetails}>
            <VisibilityIcon fontSize="small" sx={{ mr: 1 }} />
            View Details
          </MenuItem>
          <MenuItem onClick={handleDownload}>
            <DownloadIcon fontSize="small" sx={{ mr: 1 }} />
            Download Resume
          </MenuItem>
          <MenuItem
            onClick={() => handleChangeStatus("pending")}
            disabled={selectedResume?.status === "pending"}
          >
            Mark as Pending
          </MenuItem>
          <MenuItem
            onClick={() => handleChangeStatus("approved")}
            disabled={selectedResume?.status === "approved"}
          >
            Mark as Approved
          </MenuItem>
          <MenuItem
            onClick={() => handleChangeStatus("rejected")}
            disabled={selectedResume?.status === "rejected"}
          >
            Mark as Rejected
          </MenuItem>
          <MenuItem onClick={handleDeleteResume} sx={{ color: "error.main" }}>
            Delete Resume
          </MenuItem>
        </Menu>

        <ConfirmDialog
          open={confirmDialog.open}
          title={confirmDialog.title}
          message={confirmDialog.message}
          onConfirm={handleConfirmAction}
          onCancel={() =>
            setConfirmDialog({
              open: false,
              type: null,
              title: "",
              message: "",
            })
          }
          confirmText={confirmDialog.type === "delete" ? "Delete" : "Confirm"}
          cancelText="Cancel"
          variant={confirmDialog.type === "delete" ? "danger" : "warning"}
          loading={actionLoading}
        />
      </Box>
    </AdminLayout>
  );
};

export default ResumeManagement;
