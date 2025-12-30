import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Paper, Button } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useAuth } from "../../contexts/AuthContext";
import DashboardLayout from "../../components/layout/DashboardLayout";
import PageHeader from "../../components/shared/PageHeader";

const CandidateDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize dashboard
  }, []);

  return (
    <DashboardLayout role="candidate">
      <Box>
        <PageHeader
          title="Dashboard"
          subtitle={`Chào mừng trở lại, ${user?.full_name || "Ứng viên"}!`}
        />

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="h6" gutterBottom>
                Tìm việc làm
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate("/candidate/jobs")}
                sx={{ mt: 2 }}
              >
                Tìm ngay
              </Button>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="h6" gutterBottom>
                Quản lý CV
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate("/candidate/resumes")}
                sx={{ mt: 2 }}
              >
                Xem CV
              </Button>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="h6" gutterBottom>
                Đơn ứng tuyển
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate("/candidate/applications")}
                sx={{ mt: 2 }}
              >
                Xem đơn
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  );
};

export default CandidateDashboard;
