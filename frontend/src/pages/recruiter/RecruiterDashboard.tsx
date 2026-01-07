import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Avatar,
  Paper,
  Stack,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { jobService } from "../../services/jobService";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { deepPurple } from "@mui/material/colors";

const RecruiterDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [jobCount, setJobCount] = useState(0);

  useEffect(() => {
    fetchJobCount();
  }, []);

  const fetchJobCount = async () => {
    try {
      const { count } = await jobService.getMyJobs();
      setJobCount(count);
    } catch (error) {
      console.error("Failed to fetch job count:", error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: 4,
          boxShadow: "0 4px 32px 0 rgba(80, 80, 180, 0.08)",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={3} sx={{ mb: 4 }}>
          <Avatar
            sx={{
              bgcolor: deepPurple[500],
              width: 64,
              height: 64,
              fontSize: 32,
            }}
          >
            {user?.full_name
              ?.split(" ")
              .map((w) => w[0])
              .join("")
              .toUpperCase() || "R"}
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight={900} gutterBottom>
              Xin chào, {user?.full_name || "Recruiter"}
            </Typography>
            <Typography color="text.secondary">
              Chào mừng bạn đến với hệ thống quản lý tuyển dụng thông minh.
            </Typography>
          </Box>
        </Stack>
        <Divider sx={{ mb: 4 }} />
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
            gap: 3,
          }}
        >
          <Box sx={{ display: "flex" }}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 3,
                textAlign: "center",
                background: "linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)",
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <WorkOutlineIcon sx={{ fontSize: 48, color: "#1976d2", mb: 1 }} />
              <Typography variant="h6" fontWeight={700} sx={{ mt: 1 }}>
                Tin tuyển dụng của bạn
              </Typography>
              <Typography
                variant="h2"
                color="primary"
                fontWeight={900}
                sx={{ my: 2, letterSpacing: -2 }}
              >
                {jobCount}
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                Tổng số tin đang đăng
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate("/recruiter/jobs")}
              >
                Quản lý tin tuyển dụng
              </Button>
            </Paper>
          </Box>
          <Box sx={{ display: "flex" }}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 3,
                textAlign: "center",
                background: "linear-gradient(135deg, #fce4ec 0%, #e1f5fe 100%)",
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <AddCircleOutlineIcon
                sx={{ fontSize: 48, color: "#d81b60", mb: 1 }}
              />
              <Typography variant="h6" fontWeight={700} sx={{ mt: 1 }}>
                Đăng tin mới
              </Typography>
              <Typography color="text.secondary" sx={{ my: 2 }}>
                Tạo tin tuyển dụng mới để tiếp cận nhiều ứng viên hơn.
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                onClick={() => navigate("/recruiter/jobs?action=create")}
              >
                Đăng tin ngay
              </Button>
            </Paper>
          </Box>
        </Box>
        <Divider sx={{ my: 4 }} />
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="center"
        >
          <TrendingUpIcon color="success" />
          <Typography color="text.secondary" fontSize={15}>
            Hãy đăng tin chất lượng để thu hút nhiều ứng viên tiềm năng!
          </Typography>
        </Stack>
      </Paper>
    </Container>
  );
};

export default RecruiterDashboard;
