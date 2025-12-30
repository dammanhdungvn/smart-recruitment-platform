import React from "react";
import { Container, Typography, Box, Paper, Button } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const CandidateDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Chào mừng, {user?.full_name}!
        </Typography>

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
    </Container>
  );
};

export default CandidateDashboard;
