import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import AdminLayout from "../../components/layout/AdminLayout";

const ResumeManagement: React.FC = () => {
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
        <Typography variant="body1" sx={{ color: "text.secondary", mb: 3 }}>
          Quản lý tài liệu CV của ứng viên (đang bổ sung dữ liệu).
        </Typography>

        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: "16px",
            border: "1px dashed rgba(0,0,0,0.12)",
            bgcolor: "rgba(25, 118, 210, 0.02)",
            textAlign: "center",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            Resumes section is ready in the menu
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Bạn đã có mục Resumes trên thanh điều hướng. Nội dung chi tiết sẽ
            được hoàn thiện tiếp.
          </Typography>
        </Paper>
      </Box>
    </AdminLayout>
  );
};

export default ResumeManagement;
