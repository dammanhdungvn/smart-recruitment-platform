import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  CircularProgress,
} from "@mui/material";
import { applicationService } from "../../services/applicationService";
import type { Application } from "../../types/application.types";
import { formatDate } from "../../utils/formatters";
import { APPLICATION_STATUSES } from "../../utils/constants";
import toast from "react-hot-toast";

const ApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await applicationService.getUserApplications();
      setApplications(response.data);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Không thể tải danh sách đơn ứng tuyển"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (id: number) => {
    if (!confirm("Bạn có chắc muốn rút đơn ứng tuyển này?")) return;

    try {
      await applicationService.withdrawApplication(id);
      toast.success("Đã rút đơn ứng tuyển");
      fetchApplications();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Không thể rút đơn");
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
        <Typography variant="h4" gutterBottom>
          Đơn ứng tuyển của tôi
        </Typography>

        {applications.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="body1" color="text.secondary">
              Bạn chưa có đơn ứng tuyển nào
            </Typography>
          </Paper>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Công việc</TableCell>
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
                          {app.Job?.job_title || "N/A"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {app.Job?.city}
                        </Typography>
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
                        {app.status === "pending" && (
                          <Button
                            size="small"
                            color="error"
                            onClick={() => handleWithdraw(app.id)}
                          >
                            Rút đơn
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Container>
  );
};

export default ApplicationsPage;
