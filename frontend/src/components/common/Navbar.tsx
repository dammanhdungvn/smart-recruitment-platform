import React from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Menu,
  MenuItem,
  IconButton,
  Avatar,
  Divider,
  ListItemIcon,
  Chip,
  Fade,
  Stack,
} from "@mui/material";
import {
  Dashboard,
  Logout,
  WorkOutline,
  Description,
  Settings,
  SupervisorAccount,
} from "@mui/icons-material";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate("/login");
  };

  const initials = React.useMemo(() => {
    if (!user?.full_name) return "SR";
    const parts = user.full_name.trim().split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(
      0
    )}`.toUpperCase();
  }, [user?.full_name]);

  const roleNavItems = () => {
    if (!user) return [];

    if (user.role === "candidate") {
      return [
        {
          label: "Việc làm phù hợp",
          icon: <WorkOutline fontSize="small" />,
          onClick: () => navigate("/candidate/jobs"),
        },
        {
          label: "Hồ sơ & CV",
          icon: <Description fontSize="small" />,
          onClick: () => navigate("/candidate/resumes"),
        },
        {
          label: "Cài đặt tài khoản",
          icon: <Settings fontSize="small" />,
          onClick: () => navigate(getDashboardPath()),
        },
      ];
    }

    if (user.role === "recruiter") {
      return [
        {
          label: "Quản lý tin",
          icon: <WorkOutline fontSize="small" />,
          onClick: () => navigate("/recruiter/jobs"),
        },
        {
          label: "Ứng viên",
          icon: <SupervisorAccount fontSize="small" />,
          onClick: () => navigate("/recruiter/applications"),
        },
        {
          label: "Cài đặt",
          icon: <Settings fontSize="small" />,
          onClick: () => navigate("/recruiter/settings"),
        },
      ];
    }

    return [
      {
        label: "Trang quản trị",
        icon: <SupervisorAccount fontSize="small" />,
        onClick: () => navigate("/admin/dashboard"),
      },
      {
        label: "Cài đặt",
        icon: <Settings fontSize="small" />,
        onClick: () => navigate(getDashboardPath()),
      },
    ];
  };

  const buildMenuItems = () => {
    if (!user) return [];
    const items = [
      {
        label: "Dashboard",
        icon: <Dashboard fontSize="small" />,
        onClick: () => navigate(getDashboardPath()),
      },
    ];

    if (user.role === "candidate") {
      items.push(
        {
          label: "Việc làm phù hợp",
          icon: <WorkOutline fontSize="small" />,
          onClick: () => navigate("/candidate/jobs"),
        },
        {
          label: "Hồ sơ & CV",
          icon: <Description fontSize="small" />,
          onClick: () => navigate("/candidate/resumes"),
        }
      );
    }

    if (user.role === "recruiter") {
      items.push(
        {
          label: "Quản lý tin tuyển dụng",
          icon: <WorkOutline fontSize="small" />,
          onClick: () => navigate("/recruiter/jobs"),
        },
        {
          label: "Ứng viên đã ứng tuyển",
          icon: <SupervisorAccount fontSize="small" />,
          onClick: () => navigate("/recruiter/applications"),
        }
      );
    }

    if (user.role === "admin") {
      items.push({
        label: "Trang quản trị",
        icon: <SupervisorAccount fontSize="small" />,
        onClick: () => navigate("/admin/dashboard"),
      });
    }

    items.push({
      label: "Cài đặt tài khoản",
      icon: <Settings fontSize="small" />,
      onClick: () => {
        if (user.role === "recruiter") {
          navigate("/recruiter/settings");
        } else if (user.role === "candidate") {
          navigate("/candidate/settings");
        } else if (user.role === "admin") {
          navigate("/admin/settings");
        } else {
          navigate("/");
        }
      },
    });

    return items;
  };

  const getDashboardPath = () => {
    if (!user) return "/";
    switch (user.role) {
      case "candidate":
        return "/candidate/dashboard";
      case "recruiter":
        return "/recruiter/dashboard";
      case "admin":
        return "/admin/dashboard";
      default:
        return "/";
    }
  };

  return (
    <AppBar
      position="sticky"
      color="default"
      sx={{
        backdropFilter: "blur(16px)",
        background:
          "linear-gradient(90deg, rgba(255,255,255,0.92), rgba(255,255,255,0.86))",
        borderBottom: "1px solid rgba(0,0,0,0.04)",
        boxShadow: "0 12px 40px rgba(15,23,42,0.08)",
      }}
    >
      <Container maxWidth={false} disableGutters>
        <Toolbar
          sx={{
            minHeight: 76,
            px: 0,
            gap: 0,
            display: "grid",
            gridTemplateColumns: "auto 1fr auto",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexShrink: 0,
              cursor: "pointer",
              fontWeight: 800,
              letterSpacing: 0.4,
              ml: "30px",
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
            }}
            onClick={() => navigate("/")}
          >
            Tuyển dụng Thông minh
            <Chip
              label="Beta"
              size="small"
              color="primary"
              sx={{ height: 20, fontWeight: 700, letterSpacing: 0 }}
            />
          </Typography>

          {user ? (
            <>
              <Stack
                direction="row"
                sx={{
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  width: "100%",
                  px: 4,
                  columnGap: 2.5,
                }}
              >
                <Button
                  color="inherit"
                  onClick={() => navigate(getDashboardPath())}
                  sx={{
                    borderRadius: 14,
                    px: 2.75,
                    textTransform: "none",
                    fontWeight: 800,
                    bgcolor:
                      "linear-gradient(135deg, rgba(59,130,246,0.1), rgba(99,102,241,0.06))",
                    color: "#1d4ed8",
                    border: "1px solid rgba(37,99,235,0.24)",
                    boxShadow: "0 10px 22px rgba(37,99,235,0.18)",
                    "&:hover": {
                      bgcolor:
                        "linear-gradient(135deg, rgba(59,130,246,0.18), rgba(99,102,241,0.12))",
                      color: "#1e3a8a",
                      boxShadow: "0 12px 26px rgba(37,99,235,0.26)",
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  Dashboard
                </Button>

                {roleNavItems().map((item) => (
                  <Button
                    key={item.label}
                    color="inherit"
                    startIcon={item.icon}
                    onClick={item.onClick}
                    sx={{
                      borderRadius: 999,
                      px: 1.75,
                      py: 1,
                      textTransform: "none",
                      fontWeight: 600,
                      color: "text.primary",
                      bgcolor: "rgba(15,23,42,0.04)",
                      "&:hover": {
                        bgcolor:
                          "linear-gradient(135deg, rgba(59,130,246,0.12), rgba(99,102,241,0.12))",
                        color: "primary.main",
                        boxShadow: "0 8px 20px rgba(59,130,246,0.12)",
                        transform: "translateY(-1px)",
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Stack>
              <Box sx={{ mr: "30px" }}>
                <IconButton
                  size="large"
                  onClick={handleMenu}
                  color="primary"
                  sx={{
                    p: 0.5,
                    borderRadius: 12,
                    border: "1px solid rgba(0,0,0,0.06)",
                    boxShadow: "0 8px 22px rgba(15,23,42,0.16)",
                    transition: "all 0.25s ease",
                    "&:hover": {
                      boxShadow: "0 12px 30px rgba(15,23,42,0.2)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: "primary.main",
                      color: "white",
                      fontWeight: 700,
                      fontSize: "0.95rem",
                    }}
                  >
                    {initials}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  TransitionComponent={Fade}
                  slotProps={{
                    paper: {
                      elevation: 8,
                      sx: {
                        mt: 1.5,
                        minWidth: 260,
                        borderRadius: 2.5,
                        border: "1px solid rgba(0,0,0,0.08)",
                        boxShadow:
                          "0px 10px 30px rgba(0,0,0,0.12), 0px 18px 60px rgba(0,0,0,0.10)",
                        overflow: "hidden",
                      },
                    },
                  }}
                >
                  <Box sx={{ px: 2.5, pt: 2, pb: 1.5 }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar sx={{ bgcolor: "primary.main" }}>
                        {initials}
                      </Avatar>
                      <Box>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 700 }}
                        >
                          {user.full_name}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: "block" }}
                        >
                          {user.email}
                        </Typography>
                        <Chip
                          size="small"
                          label={
                            user.role === "candidate"
                              ? "Ứng viên"
                              : user.role === "recruiter"
                              ? "Nhà tuyển dụng"
                              : "Quản trị"
                          }
                          color="primary"
                          variant="outlined"
                          sx={{
                            height: 22,
                            fontSize: "0.75rem",
                            textTransform: "none",
                            mt: 0.5,
                            alignSelf: "flex-start",
                          }}
                        />
                      </Box>
                    </Stack>
                  </Box>

                  <Divider />

                  {buildMenuItems().map((item) => (
                    <MenuItem
                      key={item.label}
                      onClick={() => {
                        item.onClick();
                        handleClose();
                      }}
                      sx={{ py: 1.25 }}
                    >
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {item.label}
                      </Typography>
                    </MenuItem>
                  ))}

                  <Divider />

                  <MenuItem onClick={handleLogout} sx={{ py: 1.25 }}>
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Đăng xuất
                    </Typography>
                  </MenuItem>
                </Menu>
              </Box>
            </>
          ) : !loading ? (
            <Box
              sx={{
                justifySelf: "flex-end",
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                pr: "30px",
              }}
            >
              <Button
                color="inherit"
                component={RouterLink}
                to="/login"
                sx={{
                  borderRadius: 999,
                  px: 2.25,
                  py: 1,
                  textTransform: "none",
                  fontWeight: 700,
                  bgcolor: "rgba(15,23,42,0.04)",
                  boxShadow: "0 6px 14px rgba(15,23,42,0.08)",
                  "&:hover": {
                    bgcolor:
                      "linear-gradient(135deg, rgba(59,130,246,0.12), rgba(99,102,241,0.12))",
                    color: "primary.main",
                    boxShadow: "0 10px 24px rgba(59,130,246,0.12)",
                    transform: "translateY(-1px)",
                  },
                }}
              >
                Đăng nhập
              </Button>
              <Button
                color="inherit"
                component={RouterLink}
                to="/register"
                sx={{
                  borderRadius: 999,
                  px: 2.5,
                  py: 1,
                  textTransform: "none",
                  fontWeight: 800,
                  bgcolor: "#ffffff",
                  color: "#2563eb",
                  border: "1px solid rgba(37,99,235,0.22)",
                  boxShadow: "0 10px 24px rgba(37,99,235,0.18)",
                  "&:hover": {
                    bgcolor:
                      "linear-gradient(135deg, rgba(59,130,246,0.08), rgba(99,102,241,0.08))",
                    color: "#1d4ed8",
                    boxShadow: "0 14px 30px rgba(37,99,235,0.26)",
                    transform: "translateY(-1px)",
                  },
                }}
              >
                Đăng ký
              </Button>
            </Box>
          ) : null}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
