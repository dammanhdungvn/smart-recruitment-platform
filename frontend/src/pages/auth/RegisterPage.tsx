import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    full_name: "",
    role: "candidate" as "candidate" | "recruiter",
    phone: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    full_name: "",
    phone: "",
  });
  const [touched, setTouched] = useState({
    email: false,
    password: false,
    full_name: false,
    phone: false,
  });

  const validateEmail = (email: string): string => {
    if (!email) return "Email không được để trống";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Email không hợp lệ";
    return "";
  };

  const validatePassword = (password: string): string => {
    if (!password) return "Mật khẩu không được để trống";
    if (password.length < 6) return "Mật khẩu phải có ít nhất 6 ký tự";
    if (!/(?=.*[a-z])(?=.*[A-Z])/.test(password)) {
      return "Mật khẩu phải có chữ hoa và chữ thường";
    }
    return "";
  };

  const validateFullName = (name: string): string => {
    if (!name) return "Họ và tên không được để trống";
    if (name.length < 2) return "Họ và tên phải có ít nhất 2 ký tự";
    return "";
  };

  const validatePhone = (phone: string): string => {
    if (!phone) return ""; // Optional field
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(phone)) return "Số điện thoại không hợp lệ (10-11 số)";
    return "";
  };

  const validateForm = (): boolean => {
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    const fullNameError = validateFullName(formData.full_name);
    const phoneError = validatePhone(formData.phone);

    setErrors({
      email: emailError,
      password: passwordError,
      full_name: fullNameError,
      phone: phoneError,
    });

    return !emailError && !passwordError && !fullNameError && !phoneError;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const name = e.target.name as string;
    const value = e.target.value;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Real-time validation if field was touched
    if (touched[name as keyof typeof touched]) {
      let error = "";
      switch (name) {
        case "email":
          error = validateEmail(value as string);
          break;
        case "password":
          error = validatePassword(value as string);
          break;
        case "full_name":
          error = validateFullName(value as string);
          break;
        case "phone":
          error = validatePhone(value as string);
          break;
      }
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    let error = "";
    switch (field) {
      case "email":
        error = validateEmail(formData.email);
        break;
      case "password":
        error = validatePassword(formData.password);
        break;
      case "full_name":
        error = validateFullName(formData.full_name);
        break;
      case "phone":
        error = validatePhone(formData.phone);
        break;
    }
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({ email: true, password: true, full_name: true, phone: true });

    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await register(formData);
      navigate("/");
    } catch (error) {
      // Error already handled by AuthContext and axios interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Đăng ký
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <TextField
              fullWidth
              label="Họ và tên"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              onBlur={() => handleBlur("full_name")}
              error={touched.full_name && !!errors.full_name}
              helperText={touched.full_name && errors.full_name}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={() => handleBlur("email")}
              error={touched.email && !!errors.email}
              helperText={touched.email && errors.email}
              margin="normal"
              required
              autoComplete="email"
            />

            <TextField
              fullWidth
              label="Mật khẩu"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={() => handleBlur("password")}
              error={touched.password && !!errors.password}
              helperText={touched.password && errors.password}
              margin="normal"
              required
              autoComplete="new-password"
            />

            <TextField
              fullWidth
              label="Số điện thoại"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onBlur={() => handleBlur("phone")}
              error={touched.phone && !!errors.phone}
              helperText={touched.phone && errors.phone}
              margin="normal"
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Vai trò</InputLabel>
              <Select
                name="role"
                value={formData.role}
                onChange={handleChange as any}
                label="Vai trò"
              >
                <MenuItem value="candidate">Ứng viên</MenuItem>
                <MenuItem value="recruiter">Nhà tuyển dụng</MenuItem>
              </Select>
            </FormControl>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : "Đăng ký"}
            </Button>

            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Typography variant="body2">
                Đã có tài khoản?{" "}
                <Link to="/login" style={{ textDecoration: "none" }}>
                  Đăng nhập ngay
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default RegisterPage;
