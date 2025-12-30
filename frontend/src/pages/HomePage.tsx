import React from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  Stack,
  Chip,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";
import WorkIcon from "@mui/icons-material/Work";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import SecurityIcon from "@mui/icons-material/Security";
import TimelineIcon from "@mui/icons-material/Timeline";
import { useAuth } from "../contexts/AuthContext";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const isLoggedIn = Boolean(user);
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
    if (isRecruiter) return "Đăng tin tuyển dụng";
    if (isCandidate) return "Xem dashboard";
    if (isAdmin) return "Quản lý hệ thống";
    return "Đăng nhập";
  }, [isAdmin, isCandidate, isRecruiter]);

  const secondaryCtaPath = React.useMemo(() => {
    if (isRecruiter) return "/recruiter/jobs";
    if (isCandidate) return "/candidate/dashboard";
    if (isAdmin) return "/admin/dashboard";
    return "/login";
  }, [isAdmin, isCandidate, isRecruiter]);

  const stats = [
    { label: "Công việc đang mở", value: "2,400+" },
    { label: "Nhà tuyển dụng tin dùng", value: "850+" },
    { label: "Hồ sơ được duyệt", value: "120k+" },
    { label: "Tỉ lệ phản hồi", value: "92%" },
  ];

  const highlightCards = [
    {
      icon: <WorkIcon sx={{ fontSize: 48, color: "primary.main" }} />,
      title: "Việc làm sàng lọc",
      desc: "Được kiểm duyệt bởi đội ngũ chuyên gia, loại bỏ tin rác và trùng lặp",
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 48, color: "primary.main" }} />,
      title: "Bảo mật & an toàn",
      desc: "Mã hoá thông tin ứng viên, xác thực doanh nghiệp nhiều lớp",
    },
    {
      icon: <TimelineIcon sx={{ fontSize: 48, color: "primary.main" }} />,
      title: "Theo dõi realtime",
      desc: "Cập nhật trạng thái hồ sơ, phản hồi phỏng vấn tức thời",
    },
    {
      icon: <TrendingUpIcon sx={{ fontSize: 48, color: "primary.main" }} />,
      title: "Phân tích dữ liệu",
      desc: "Báo cáo minh bạch về hiệu quả tuyển dụng và hành trình ứng viên",
    },
  ];

  const steps = [
    {
      title: "Tạo hồ sơ nhanh",
      desc: "Nhập kinh nghiệm, kỹ năng và tải CV chỉ trong 3 phút",
    },
    {
      title: "Ghép việc thông minh",
      desc: "Thuật toán gợi ý dựa trên kỹ năng, mức lương và vị trí mong muốn",
    },
    {
      title: "Ứng tuyển 1 chạm",
      desc: "Theo dõi trạng thái, nhận phản hồi tự động và lịch phỏng vấn",
    },
    {
      title: "Theo dõi & tối ưu",
      desc: "So sánh kết quả, nhận gợi ý cải thiện CV và phỏng vấn",
    },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          color: "white",
          py: { xs: 10, md: 16 },
          textAlign: "center",
        }}
      >
        {/* Background Effects */}
        <Box
          sx={{
            position: "absolute",
            top: "-20%",
            left: "-10%",
            width: "50%",
            height: "50%",
            background:
              "radial-gradient(circle, rgba(25, 118, 210, 0.4) 0%, transparent 70%)",
            filter: "blur(80px)",
            animation: "pulse 10s infinite alternate",
            "@keyframes pulse": {
              "0%": { transform: "scale(1)" },
              "100%": { transform: "scale(1.2)" },
            },
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: "-20%",
            right: "-10%",
            width: "50%",
            height: "50%",
            background:
              "radial-gradient(circle, rgba(144, 202, 249, 0.3) 0%, transparent 70%)",
            filter: "blur(80px)",
            animation: "pulse 12s infinite alternate-reverse",
          }}
        />

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Stack spacing={3} alignItems="center">
            <Chip
              label="Nền tảng tuyển dụng 4.0"
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.1)",
                color: "#90caf9",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(10px)",
                fontWeight: 600,
                px: 1,
              }}
            />
            <Typography
              variant="h1"
              sx={{
                fontWeight: 800,
                fontSize: { xs: "2.5rem", md: "4.5rem" },
                lineHeight: 1.2,
                background: "linear-gradient(90deg, #ffffff 0%, #90caf9 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                maxWidth: "900px",
              }}
            >
              Kết nối nhân tài, kiến tạo tương lai
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: "rgba(255, 255, 255, 0.8)",
                maxWidth: "700px",
                fontWeight: 400,
                fontSize: { xs: "1.1rem", md: "1.35rem" },
                lineHeight: 1.6,
              }}
            >
              Hệ thống tuyển dụng thông minh giúp bạn tìm kiếm cơ hội việc làm
              tốt nhất hoặc ứng viên tiềm năng nhất chỉ trong vài giây.
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ mt: 4 }}
            >
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate(primaryCtaPath)}
                sx={{
                  bgcolor: "#2196f3",
                  color: "white",
                  px: 5,
                  py: 1.8,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  borderRadius: "50px",
                  boxShadow: "0 8px 20px rgba(33, 150, 243, 0.4)",
                  "&:hover": {
                    bgcolor: "#1976d2",
                    transform: "translateY(-2px)",
                    boxShadow: "0 12px 24px rgba(33, 150, 243, 0.5)",
                  },
                }}
              >
                {primaryCtaLabel}
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate(secondaryCtaPath)}
                sx={{
                  borderColor: "rgba(255, 255, 255, 0.3)",
                  color: "white",
                  px: 5,
                  py: 1.8,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  borderRadius: "50px",
                  backdropFilter: "blur(10px)",
                  "&:hover": {
                    borderColor: "white",
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                {secondaryCtaLabel}
              </Button>
            </Stack>
          </Stack>

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
                    p: 3.5,
                    bgcolor: "rgba(255, 255, 255, 0.08)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "16px",
                    textAlign: "center",
                    boxShadow:
                      "0 8px 16px rgba(0, 0, 0, 0.2), 0 4px 8px rgba(0, 0, 0, 0.1)",
                    transition:
                      "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      bgcolor: "rgba(255, 255, 255, 0.12)",
                      borderColor: "rgba(255, 255, 255, 0.3)",
                      boxShadow:
                        "0 20px 30px rgba(0, 0, 0, 0.25), 0 10px 15px rgba(0, 0, 0, 0.15)",
                    },
                  }}
                >
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 900,
                      fontSize: { xs: "2rem", md: "2.5rem" },
                      background:
                        "linear-gradient(135deg, #64b5f6 0%, #42a5f5 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      mb: 1,
                    }}
                  >
                    {item.value}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "rgba(255, 255, 255, 0.85)",
                      fontWeight: 500,
                      fontSize: "0.9375rem",
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

      {/* Highlights Section */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          py: { xs: 8, md: 11 },
          px: 2,
          bgcolor: "#f6f9ff",
          "&::before": {
            content: "''",
            position: "absolute",
            width: 260,
            height: 260,
            borderRadius: "50%",
            background: "radial-gradient(circle, #dce9ff 0%, transparent 60%)",
            top: -80,
            left: -50,
            filter: "blur(12px)",
          },
          "&::after": {
            content: "''",
            position: "absolute",
            width: 320,
            height: 320,
            borderRadius: "50%",
            background: "radial-gradient(circle, #e8fff5 0%, transparent 60%)",
            bottom: -120,
            right: -120,
            filter: "blur(18px)",
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 4 }}>
              <Stack spacing={2} sx={{ maxWidth: 360 }}>
                <Chip
                  label="Nổi bật"
                  color="primary"
                  sx={{ alignSelf: { xs: "flex-start", md: "flex-start" } }}
                />
                <Typography
                  variant="h4"
                  component="h2"
                  sx={{ fontWeight: 700 }}
                >
                  Tại sao chọn Smart Recruitment?
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Tuyển dụng minh bạch, trải nghiệm liền mạch cho cả ứng viên
                  lẫn nhà tuyển dụng với dữ liệu thời gian thực.
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <Chip label="Realtime" variant="outlined" color="primary" />
                  <Chip label="Bảo mật" variant="outlined" color="primary" />
                  <Chip label="Dữ liệu" variant="outlined" color="primary" />
                </Stack>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 8 }}>
              <Grid container spacing={3} alignItems="stretch">
                {highlightCards.map((card) => (
                  <Grid
                    size={{ xs: 12, sm: 6 }}
                    key={card.title}
                    display="flex"
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        p: 4,
                        height: "100%",
                        minHeight: 280,
                        flex: 1,
                        borderRadius: "16px",
                        border: "1px solid rgba(226, 232, 240, 0.8)",
                        background: "#ffffff",
                        boxShadow:
                          "0 4px 6px -1px rgba(0, 0, 0, 0.06), 0 2px 4px -1px rgba(0, 0, 0, 0.04)",
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        transition:
                          "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.3s ease",
                        cursor: "default",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow:
                            "0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                          borderColor: "rgba(33, 150, 243, 0.3)",
                          "& .icon-container": {
                            transform: "scale(1.05)",
                            boxShadow: "0 8px 16px rgba(33, 150, 243, 0.25)",
                          },
                        },
                      }}
                    >
                      <Box
                        className="icon-container"
                        sx={{
                          width: 64,
                          height: 64,
                          borderRadius: "14px",
                          background:
                            "linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(33, 150, 243, 0.05) 100%)",
                          border: "1px solid rgba(33, 150, 243, 0.15)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 4px 12px rgba(33, 150, 243, 0.12)",
                          transition:
                            "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          "& svg": {
                            fontSize: "32px !important",
                            color: "#1976d2",
                          },
                        }}
                      >
                        {card.icon}
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontSize: "1.125rem",
                          fontWeight: 700,
                          color: "#0f172a",
                          lineHeight: 1.4,
                          mb: 0.5,
                        }}
                      >
                        {card.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: "0.9375rem",
                          fontWeight: 400,
                          color: "#64748b",
                          lineHeight: 1.7,
                          overflowWrap: "break-word",
                          wordBreak: "break-word",
                        }}
                      >
                        {card.desc}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Steps Section */}
      <Box sx={{ bgcolor: "#f8fafc", color: "#0f172a", py: { xs: 8, md: 11 } }}>
        <Container maxWidth="lg">
          <Stack spacing={1.5} textAlign="center" sx={{ mb: 6 }}>
            <Chip
              label="Quy trình"
              color="primary"
              sx={{ alignSelf: "center" }}
            />
            <Typography variant="h4" component="h2" sx={{ fontWeight: 700 }}>
              4 bước để bạn nổi bật
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Lộ trình rõ ràng từ tạo hồ sơ đến phỏng vấn, tối ưu cho cả ứng
              viên và nhà tuyển dụng.
            </Typography>
          </Stack>

          <Grid container spacing={3} alignItems="stretch">
            {steps.map((step, index) => (
              <Grid
                size={{ xs: 12, sm: 6, md: 3 }}
                key={step.title}
                display="flex"
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    height: "100%",
                    minHeight: 300,
                    flex: 1,
                    borderRadius: "16px",
                    border: "1px solid rgba(226, 232, 240, 0.8)",
                    backgroundColor: "#ffffff",
                    boxShadow:
                      "0 4px 6px -1px rgba(0, 0, 0, 0.06), 0 2px 4px -1px rgba(0, 0, 0, 0.04)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: 2,
                    position: "relative",
                    overflow: "hidden",
                    transition:
                      "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.3s ease",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "4px",
                      background: `linear-gradient(90deg, ${
                        index === 0
                          ? "#1976d2"
                          : index === 1
                          ? "#2e7d32"
                          : index === 2
                          ? "#ed6c02"
                          : "#9c27b0"
                      } 0%, ${
                        index === 0
                          ? "#42a5f5"
                          : index === 1
                          ? "#66bb6a"
                          : index === 2
                          ? "#ffa726"
                          : "#ba68c8"
                      } 100%)`,
                      opacity: 0,
                      transition: "opacity 0.3s ease",
                    },
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow:
                        "0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                      borderColor: "rgba(33, 150, 243, 0.3)",
                      "&::before": {
                        opacity: 1,
                      },
                      "& .step-badge": {
                        transform: "scale(1.1) rotate(5deg)",
                      },
                    },
                  }}
                >
                  <Box
                    className="step-badge"
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "12px",
                      background: `linear-gradient(135deg, ${
                        index === 0
                          ? "rgba(25, 118, 210, 0.1)"
                          : index === 1
                          ? "rgba(46, 125, 50, 0.1)"
                          : index === 2
                          ? "rgba(237, 108, 2, 0.1)"
                          : "rgba(156, 39, 176, 0.1)"
                      } 0%, ${
                        index === 0
                          ? "rgba(25, 118, 210, 0.05)"
                          : index === 1
                          ? "rgba(46, 125, 50, 0.05)"
                          : index === 2
                          ? "rgba(237, 108, 2, 0.05)"
                          : "rgba(156, 39, 176, 0.05)"
                      } 100%)`,
                      border: `1px solid ${
                        index === 0
                          ? "rgba(25, 118, 210, 0.2)"
                          : index === 1
                          ? "rgba(46, 125, 50, 0.2)"
                          : index === 2
                          ? "rgba(237, 108, 2, 0.2)"
                          : "rgba(156, 39, 176, 0.2)"
                      }`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: `0 4px 12px ${
                        index === 0
                          ? "rgba(25, 118, 210, 0.15)"
                          : index === 1
                          ? "rgba(46, 125, 50, 0.15)"
                          : index === 2
                          ? "rgba(237, 108, 2, 0.15)"
                          : "rgba(156, 39, 176, 0.15)"
                      }`,
                      transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 900,
                        color:
                          index === 0
                            ? "#1976d2"
                            : index === 1
                            ? "#2e7d32"
                            : index === 2
                            ? "#ed6c02"
                            : "#9c27b0",
                      }}
                    >
                      0{index + 1}
                    </Typography>
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: "1.125rem",
                      fontWeight: 700,
                      color: "#0f172a",
                      lineHeight: 1.4,
                      flex: 1,
                    }}
                  >
                    {step.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "0.9375rem",
                      fontWeight: 400,
                      color: "#64748b",
                      lineHeight: 1.7,
                      overflowWrap: "break-word",
                      wordBreak: "break-word",
                    }}
                  >
                    {step.desc}
                  </Typography>
                  <Box
                    sx={{
                      mt: "auto",
                      pt: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      color:
                        index === 0
                          ? "#1976d2"
                          : index === 1
                          ? "#2e7d32"
                          : index === 2
                          ? "#ed6c02"
                          : "#9c27b0",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{ fontWeight: 600, fontSize: "0.8125rem" }}
                    >
                      Bước tiếp theo
                    </Typography>
                    <TrendingUpIcon sx={{ fontSize: 18 }} />
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
            opacity: 0.1,
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
                bgcolor: "rgba(33, 150, 243, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <RocketLaunchIcon sx={{ fontSize: 40, color: "#42a5f5" }} />
            </Box>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                fontSize: { xs: "2rem", md: "3.5rem" },
              }}
            >
              Sẵn sàng bứt phá sự nghiệp?
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "rgba(255, 255, 255, 0.7)",
                maxWidth: "700px",
                fontWeight: 400,
                lineHeight: 1.6,
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
                  py: 1.8,
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  borderRadius: "50px",
                  "&:hover": {
                    bgcolor: "#f8fafc",
                    transform: "scale(1.05)",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                {isLoggedIn ? "Tiếp tục ngay" : "Đăng ký miễn phí"}
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate(secondaryCtaPath)}
                sx={{
                  borderColor: "rgba(255,255,255,0.3)",
                  color: "white",
                  px: 5,
                  py: 1.8,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  borderRadius: "50px",
                  "&:hover": {
                    borderColor: "white",
                    bgcolor: "rgba(255,255,255,0.05)",
                  },
                }}
              >
                {isLoggedIn ? secondaryCtaLabel : "Xem việc mới"}
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
