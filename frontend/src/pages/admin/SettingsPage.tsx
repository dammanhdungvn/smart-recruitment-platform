import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Avatar,
  Stack,
  Divider,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Save, AdminPanelSettings } from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

const SettingsPage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateProfile(formData);
      toast.success("Cập nhật thông tin thành công!");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(
        err.response?.data?.message || "Không thể cập nhật thông tin"
      );
    } finally {
      setLoading(false);
    }
  };

  const initials = React.useMemo(() => {
    if (!user?.full_name) return "A";
    const parts = user.full_name.trim().split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(
      0
    )}`.toUpperCase();
  }, [user?.full_name]);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 900, mb: 1 }}>
          Cài đặt quản trị viên
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Quản lý thông tin tài khoản quản trị viên
        </Typography>
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: "16px",
          border: "1px solid rgba(0, 0, 0, 0.08)",
        }}
      >
        <Stack spacing={3}>
          {/* Profile Avatar */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: "error.main",
                fontSize: "2rem",
                fontWeight: 700,
              }}
            >
              {initials}
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {user?.full_name || "Quản trị viên"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.email}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  display: "inline-block",
                  mt: 0.5,
                  px: 1,
                  py: 0.25,
                  bgcolor: "error.light",
                  color: "error.dark",
                  borderRadius: 1,
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                Quản trị viên
              </Typography>
            </Box>
          </Box>

          <Divider />

          {/* Profile Form */}
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Họ và tên"
                value={formData.full_name}
                onChange={(e) => handleChange("full_name", e.target.value)}
                required
              />

              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
                disabled
                helperText="Email không thể thay đổi"
              />

              <TextField
                fullWidth
                label="Số điện thoại"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="0123456789"
              />

              <Alert severity="warning" icon={<AdminPanelSettings />}>
                Bạn có quyền quản trị viên. Vui lòng cẩn thận khi thay đổi thông
                tin.
              </Alert>

              <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  startIcon={
                    loading ? <CircularProgress size={20} /> : <Save />
                  }
                  disabled={loading}
                >
                  {loading ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
              </Box>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Container>
  );
};

export default SettingsPage;
