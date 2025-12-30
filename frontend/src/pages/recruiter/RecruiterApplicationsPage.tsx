import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { applicationService } from "../../services/applicationService";
import type { Application } from "../../types/application.types";
import { formatDate } from "../../utils/formatters";
import { APPLICATION_STATUSES } from "../../utils/constants";
import toast from "react-hot-toast";

const RecruiterApplicationsPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (jobId) {
      fetchApplications();
    }
  }, [jobId]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await applicationService.getJobApplications(
        Number(jobId)
      );
      setApplications(response.data?.applications || []);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Không thể tải danh sách ứng viên"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (app: Application) => {
    setSelectedApp(app);
    setNewStatus(app.status === "submitted" ? "pending" : app.status);
    setNotes(app.notes || "");
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedApp(null);
    setNewStatus("");
    setNotes("");
  };

  const handleUpdateStatus = async () => {
    if (!selectedApp) return;

    setSubmitting(true);
    try {
      await applicationService.updateApplicationStatus(selectedApp.id, {
        status: newStatus as any,
        notes,
      });
      toast.success("Cập nhật trạng thái thành công");
      handleCloseDialog();
      fetchApplications();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Không thể cập nhật trạng thái"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusInfo = (status: string) => {
    return (
      APPLICATION_STATUSES.find((s) => s.value === status) ||
      APPLICATION_STATUSES[0]
    );
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
        <Button onClick={() => navigate("/recruiter/jobs")} sx={{ mb: 2 }}>
          ← Quay lại
        </Button>

        <Typography variant="h4" gutterBottom>
          Danh sách ứng viên ({applications.length})
        </Typography>

        {applications.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="body1" color="text.secondary">
              Chưa có ứng viên nào ứng tuyển
            </Typography>
          </Paper>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ứng viên</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>CV</TableCell>
                  <TableCell>Ngày ứng tuyển</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {applications.map((app) => {
                  const statusInfo = getStatusInfo(app.status);
                  return (
                    <TableRow key={app.id}>
                      <TableCell>
                        <Typography variant="body1">
                          {app.User?.full_name || "N/A"}
                        </Typography>
                      </TableCell>
                      <TableCell>{app.User?.email || "N/A"}</TableCell>
                      <TableCell>
                        {app.Resume?.file_name || "N/A"}
                        {app.Resume?.is_primary && (
                          <Chip label="CV chính" size="small" sx={{ ml: 1 }} />
                        )}
                      </TableCell>
                      <TableCell>{formatDate(app.applied_at)}</TableCell>
                      <TableCell>
                        <Chip
                          label={statusInfo.label}
                          size="small"
                          sx={{ bgcolor: statusInfo.color, color: "white" }}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          onClick={() => handleOpenDialog(app)}
                        >
                          Xem & Cập nhật
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      {/* Update Status Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Chi tiết ứng viên</DialogTitle>
        <DialogContent>
          {selectedApp && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" gutterBottom>
                <strong>Tên:</strong> {selectedApp.User?.full_name}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Email:</strong> {selectedApp.User?.email}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>SĐT:</strong> {selectedApp.User?.phone || "N/A"}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>CV:</strong> {selectedApp.Resume?.file_name}
              </Typography>
              {selectedApp.cover_letter && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body1" gutterBottom>
                    <strong>Thư xin việc:</strong>
                  </Typography>
                  <Paper sx={{ p: 2, bgcolor: "grey.100" }}>
                    <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                      {selectedApp.cover_letter}
                    </Typography>
                  </Paper>
                </Box>
              )}

              <TextField
                fullWidth
                select
                label="Trạng thái"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                margin="normal"
              >
                {APPLICATION_STATUSES.filter(
                  (s) => s.value !== "submitted"
                ).map((status) => (
                  <MenuItem key={status.value} value={status.value}>
                    {status.label}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                multiline
                rows={3}
                label="Ghi chú"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                margin="normal"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Đóng</Button>
          <Button
            onClick={handleUpdateStatus}
            variant="contained"
            disabled={submitting}
          >
            {submitting ? <CircularProgress size={24} /> : "Cập nhật"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default RecruiterApplicationsPage;
