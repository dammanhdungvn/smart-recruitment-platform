import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Alert } from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  People as PeopleIcon,
  Work as WorkIcon,
  Description as DescriptionIcon,
  Assignment as AssignmentIcon,
} from "@mui/icons-material";
import AdminLayout from "../../components/layout/AdminLayout";
import StatsCard from "../../components/admin/StatsCard";
import { adminService } from "../../services/adminService";
import type { AdminStats } from "../../types/admin.types";

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminService.getStats();
      setStats(response.data);
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Failed to load dashboard stats"
      );
      console.error("Failed to load stats:", err);
    } finally {
      setLoading(false);
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
            color: "text.primary",
          }}
        >
          Dashboard
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "text.secondary",
            mb: 4,
            fontSize: "0.9375rem",
          }}
        >
          Overview of your recruitment platform
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: "12px" }}>
            {error}
          </Alert>
        )}

        {/* KPI Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatsCard
              title="Total Users"
              value={stats?.totalUsers || 0}
              icon={<PeopleIcon />}
              color="#1976d2"
              loading={loading}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatsCard
              title="Total Jobs"
              value={stats?.totalJobs || 0}
              icon={<WorkIcon />}
              color="#2e7d32"
              loading={loading}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatsCard
              title="Total Resumes"
              value={stats?.totalResumes || 0}
              icon={<DescriptionIcon />}
              color="#ed6c02"
              loading={loading}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatsCard
              title="Total Applications"
              value={stats?.totalApplications || 0}
              icon={<AssignmentIcon />}
              color="#9c27b0"
              loading={loading}
            />
          </Grid>
        </Grid>

        {/* Charts Placeholder */}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: "16px",
                border: "1px solid rgba(0, 0, 0, 0.08)",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                minHeight: 300,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  Jobs Over Time
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Chart visualization coming soon
                </Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: "16px",
                border: "1px solid rgba(0, 0, 0, 0.08)",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                minHeight: 300,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  Applications by Status
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Chart visualization coming soon
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </AdminLayout>
  );
};

export default AdminDashboard;
