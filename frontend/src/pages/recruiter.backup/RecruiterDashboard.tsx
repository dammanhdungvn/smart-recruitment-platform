import React, { useEffect, useState } from "react";
import { Container, Typography, Box, Paper, Button } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { jobService } from "../../services/jobService";

const RecruiterDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [jobCount, setJobCount] = useState(0);

  useEffect(() => {
    fetchJobCount();
  }, []);

  const fetchJobCount = async () => {
    try {
      const response = await jobService.getMyJobs();
      setJobCount(response.data.count);
    } catch (error) {
      console.error("Failed to fetch job count:", error);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Chào mừng, {user?.full_name}!
        </Typography>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="h6" gutterBottom>
                Quản lý tin tuyển dụng
              </Typography>
              <Typography variant="h3" color="primary" sx={{ my: 2 }}>
                {jobCount}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Tin đang đăng
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate("/recruiter/jobs")}
              >
                Quản lý tin
              </Button>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="h6" gutterBottom>
                Đăng tin mới
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ my: 4 }}>
                Tạo tin tuyển dụng mới
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => navigate("/recruiter/jobs?action=create")}
              >
                Đăng tin ngay
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default RecruiterDashboard;
