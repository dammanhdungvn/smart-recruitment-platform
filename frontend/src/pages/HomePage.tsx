import React from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  Stack,
  Chip,
  Card,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";
import {
  Work as WorkIcon,
  TrendingUp as TrendingUpIcon,
  RocketLaunch as RocketLaunchIcon,
  Security as SecurityIcon,
  CheckCircle as CheckCircleIcon,
  Speed as SpeedIcon,
  Groups as GroupsIcon,
  Insights as InsightsIcon,
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const isCandidate = user?.role === "candidate";
  const isRecruiter = user?.role === "recruiter";
  const isAdmin = user?.role === "admin";

  const primaryCtaLabel = React.useMemo(() => {
    if (isCandidate) return "Khám phá việc làm phù hợp";
    if (isRecruiter) return "Quản lý tin tuyển dụng";
    if (isAdmin) return "Đi tới trang quản trị";
    return "Tạo hồ sơ miễn phí";
  }, [isAdmin, isCandidate, isRecruiter]);

  const primaryCtaPath = React.useMemo(() => {
    if (isCandidate) return "/candidate/jobs";
    if (isRecruiter) return "/recruiter/jobs";
    if (isAdmin) return "/admin/dashboard";
    return "/register";
  }, [isAdmin, isCandidate, isRecruiter]);

  const secondaryCtaLabel = React.useMemo(() => {
    if (isRecruiter) return "Dashboard";
    if (isCandidate) return "Dashboard";
    if (isAdmin) return "Quản lý hệ thống";
    return "Đăng nhập";
  }, [isAdmin, isCandidate, isRecruiter]);

  const secondaryCtaPath = React.useMemo(() => {
    if (isRecruiter) return "/recruiter/dashboard";
    if (isCandidate) return "/candidate/dashboard";
    if (isAdmin) return "/admin/dashboard";
    return "/login";
  }, [isAdmin, isCandidate, isRecruiter]);

  const stats = [
    { label: "Công việc đang mở", value: "2,400+", icon: <WorkIcon /> },
    { label: "Nhà tuyển dụng tin dùng", value: "850+", icon: <GroupsIcon /> },
    { label: "Hồ sơ được duyệt", value: "120k+", icon: <CheckCircleIcon /> },
    { label: "Tỉ lệ phản hồi", value: "92%", icon: <TrendingUpIcon /> },
  ];

  const features = [
    {
      icon: <CheckCircleIcon sx={{ fontSize: 40 }} />,
      title: "Việc làm đã được kiểm duyệt",
      desc: "Mọi tin tuyển dụng đều được xác thực bởi đội ngũ chuyên gia, đảm bảo chất lượng và uy tín.",
      color: "#2e7d32",
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: "Bảo mật thông tin tuyệt đối",
      desc: "Hệ thống mã hóa dữ liệu cá nhân, xác thực nhiều lớp cho nhà tuyển dụng.",
      color: "#1976d2",
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 40 }} />,
      title: "Tìm việc & tuyển người nhanh",
      desc: "Thuật toán AI gợi ý công việc/ứng viên phù hợp, giảm thời gian tìm kiếm xuống 80%.",
      color: "#ed6c02",
    },
    {
      icon: <InsightsIcon sx={{ fontSize: 40 }} />,
      title: "Phân tích & thống kê chi tiết",
      desc: "Dashboard realtime theo dõi hiệu quả tuyển dụng, xu hướng thị trường và đề xuất cải thiện.",
      color: "#9c27b0",
    },
  ];

  const steps = [
    {
      step: "01",
      title: "Tạo tài khoản",
      desc: "Đăng ký miễn phí chỉ với email, hoàn thiện hồ sơ trong 3 phút",
    },
    {
      step: "02",
      title: "Tìm kiếm thông minh",
      desc: "AI gợi ý công việc/ứng viên phù hợp dựa trên kỹ năng & kinh nghiệm",
    },
    {
      step: "03",
      title: "Ứng tuyển nhanh chóng",
      desc: "Nộp hồ sơ 1 click, theo dõi trạng thái realtime",
    },
    {
      step: "04",
      title: "Nhận phản hồi tức thì",
      desc: "Thông báo phỏng vấn, đánh giá CV, gợi ý cải thiện",
    },
  ];

  return (
    <Box sx={{ flexGrow: 1, bgcolor: "#fff" }}>
      {/* Hero Section - Professional SaaS Design */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)",
          color: "white",
          py: { xs: 12, md: 18 },
        }}
      >
        {/* Subtle Background Pattern */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            opacity: 0.05,
            backgroundImage:
              "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Stack spacing={4} alignItems="center" textAlign="center">
            <Chip
              label="✨ Nền tảng tuyển dụng thông minh"
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.15)",
                color: "white",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                backdropFilter: "blur(10px)",
                fontWeight: 600,
                px: 2,
                py: 0.5,
                fontSize: "0.875rem",
              }}
            />

            <Typography
              variant="h1"
              sx={{
                fontWeight: 900,
                fontSize: { xs: "2.5rem", md: "4rem" },
                lineHeight: 1.1,
                maxWidth: "900px",
                background: "linear-gradient(135deg, #fff 0%, #e0f2fe 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Kết nối nhân tài, kiến tạo tương lai
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: "rgba(255, 255, 255, 0.85)",
                maxWidth: "700px",
                fontWeight: 400,
                fontSize: { xs: "1.125rem", md: "1.25rem" },
                lineHeight: 1.7,
              }}
            >
              Hệ thống tuyển dụng thông minh giúp bạn tìm kiếm cơ hội việc làm
              tốt nhất hoặc ứng viên tiềm năng chỉ trong vài giây
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ pt: 2 }}
            >
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate(primaryCtaPath)}
                sx={{
                  bgcolor: "white",
                  color: "#0f172a",
                  px: 5,
                  py: 1.75,
                  fontSize: "1.0625rem",
                  fontWeight: 700,
                  borderRadius: "12px",
                  boxShadow: "0 8px 24px rgba(255, 255, 255, 0.25)",
                  textTransform: "none",
                  "&:hover": {
                    bgcolor: "#f8fafc",
                    transform: "translateY(-2px)",
                    boxShadow: "0 12px 32px rgba(255, 255, 255, 0.3)",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                {primaryCtaLabel}
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate(secondaryCtaPath)}
                sx={{
                  borderColor: "rgba(255, 255, 255, 0.4)",
                  color: "white",
                  px: 5,
                  py: 1.75,
                  fontSize: "1.0625rem",
                  fontWeight: 600,
                  borderRadius: "12px",
                  backdropFilter: "blur(10px)",
                  borderWidth: "2px",
                  textTransform: "none",
                  "&:hover": {
                    borderColor: "white",
                    borderWidth: "2px",
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                {secondaryCtaLabel}
              </Button>
            </Stack>
          </Stack>

          {/* Stats Cards */}
          <Grid
            container
            spacing={3}
            justifyContent="center"
            sx={{ mt: { xs: 8, md: 12 } }}
          >
            {stats.map((item) => (
              <Grid size={{ xs: 6, md: 3 }} key={item.label}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    textAlign: "center",
                    borderRadius: "16px",
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      bgcolor: "rgba(255, 255, 255, 0.15)",
                      transform: "translateY(-4px)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      mb: 1.5,
                      display: "flex",
                      justifyContent: "center",
                      color: "#93c5fd",
                      "& svg": {
                        fontSize: 32,
                      },
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 900,
                      fontSize: { xs: "2rem", md: "2.5rem" },
                      mb: 0.5,
                      color: "white",
                    }}
                  >
                    {item.value}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "rgba(255, 255, 255, 0.7)",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                    }}
                  >
                    {item.label}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: { xs: 10, md: 14 }, bgcolor: "#f8fafc" }}>
        <Container maxWidth="lg">
          <Stack spacing={2} textAlign="center" sx={{ mb: 8 }}>
            <Chip
              label="Tính năng nổi bật"
              color="primary"
              sx={{ alignSelf: "center", fontWeight: 600 }}
            />
            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                fontSize: { xs: "2rem", md: "2.75rem" },
              }}
            >
              Tại sao chọn Smart Recruitment?
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                maxWidth: "700px",
                mx: "auto",
                fontSize: "1.0625rem",
              }}
            >
              Nền tảng tuyển dụng hiện đại với công nghệ AI, đảm bảo trải nghiệm
              liền mạch cho cả ứng viên và nhà tuyển dụng
            </Typography>
          </Stack>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    p: 3,
                    borderRadius: "16px",
                    border: "1px solid rgba(0, 0, 0, 0.08)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 12px 24px rgba(0, 0, 0, 0.1)",
                      borderColor: feature.color,
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: "14px",
                      bgcolor: `${feature.color}15`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: feature.color,
                      mb: 2.5,
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, mb: 1.5, fontSize: "1.125rem" }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", lineHeight: 1.7 }}
                  >
                    {feature.desc}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Box sx={{ py: { xs: 10, md: 14 }, bgcolor: "white" }}>
        <Container maxWidth="lg">
          <Stack spacing={2} textAlign="center" sx={{ mb: 8 }}>
            <Chip
              label="Quy trình"
              color="primary"
              sx={{ alignSelf: "center", fontWeight: 600 }}
            />
            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                fontSize: { xs: "2rem", md: "2.75rem" },
              }}
            >
              4 bước để bạn thành công
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                maxWidth: "700px",
                mx: "auto",
                fontSize: "1.0625rem",
              }}
            >
              Lộ trình rõ ràng từ tạo hồ sơ đến nhận việc, tối ưu cho cả ứng
              viên và nhà tuyển dụng
            </Typography>
          </Stack>

          <Grid container spacing={4}>
            {steps.map((step, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    height: "100%",
                    borderRadius: "16px",
                    border: "2px solid #e0e7ff",
                    bgcolor: "#f8fafc",
                    position: "relative",
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      borderColor: "#1976d2",
                      bgcolor: "white",
                      transform: "translateY(-4px)",
                    },
                  }}
                >
                  <Typography
                    variant="h2"
                    sx={{
                      position: "absolute",
                      top: 16,
                      right: 16,
                      fontSize: "5rem",
                      fontWeight: 900,
                      color: "rgba(25, 118, 210, 0.08)",
                      lineHeight: 1,
                    }}
                  >
                    {step.step}
                  </Typography>
                  <Box sx={{ position: "relative", zIndex: 1 }}>
                    <Chip
                      label={step.step}
                      size="small"
                      sx={{
                        bgcolor: "#1976d2",
                        color: "white",
                        fontWeight: 700,
                        mb: 2,
                      }}
                    />
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
                      {step.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary", lineHeight: 1.7 }}
                    >
                      {step.desc}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          position: "relative",
          bgcolor: "#0f172a",
          color: "white",
          py: { xs: 10, md: 14 },
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            opacity: 0.05,
            backgroundImage: "radial-gradient(#42a5f5 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
          <Stack spacing={4} alignItems="center">
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                bgcolor: "rgba(33, 150, 243, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
                border: "1px solid rgba(33, 150, 243, 0.3)",
              }}
            >
              <RocketLaunchIcon sx={{ fontSize: 40, color: "#42a5f5" }} />
            </Box>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 900,
                fontSize: { xs: "2rem", md: "3rem" },
              }}
            >
              Sẵn sàng bứt phá sự nghiệp?
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "rgba(255, 255, 255, 0.75)",
                maxWidth: "700px",
                fontWeight: 400,
                lineHeight: 1.7,
                fontSize: "1.125rem",
              }}
            >
              Tham gia cùng hàng ngàn ứng viên và nhà tuyển dụng hàng đầu. Cơ
              hội tốt nhất đang chờ đón bạn ngay hôm nay.
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ mt: 2 }}
            >
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate(primaryCtaPath)}
                sx={{
                  bgcolor: "white",
                  color: "#0f172a",
                  px: 5,
                  py: 1.75,
                  fontSize: "1.0625rem",
                  fontWeight: 700,
                  borderRadius: "12px",
                  textTransform: "none",
                  "&:hover": {
                    bgcolor: "#f8fafc",
                    transform: "scale(1.05)",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                {primaryCtaLabel}
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate(secondaryCtaPath)}
                sx={{
                  borderColor: "rgba(255,255,255,0.4)",
                  color: "white",
                  px: 5,
                  py: 1.75,
                  fontSize: "1.0625rem",
                  fontWeight: 600,
                  borderRadius: "12px",
                  borderWidth: "2px",
                  textTransform: "none",
                  "&:hover": {
                    borderColor: "white",
                    borderWidth: "2px",
                    bgcolor: "rgba(255,255,255,0.05)",
                  },
                }}
              >
                {secondaryCtaLabel}
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
