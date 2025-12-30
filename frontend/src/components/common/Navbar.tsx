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
          onClick: () => navigate("/recruiter/dashboard"),
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
      onClick: () => navigate(getDashboardPath()),
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
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            Smart Recruitment
          </Typography>

          {user ? (
            <>
              <Button
                color="inherit"
                onClick={() => navigate(getDashboardPath())}
              >
                Dashboard
              </Button>
              {user.role === "candidate" && (
                <Button
                  color="inherit"
                  onClick={() => navigate("/candidate/jobs")}
                >
                  Tìm việc
                </Button>
              )}
              {user.role === "recruiter" && (
                <Button
                  color="inherit"
                  onClick={() => navigate("/recruiter/jobs")}
                >
                  Quản lý tin
                </Button>
              )}
              <Box>
                <IconButton
                  size="large"
                  onClick={handleMenu}
                  color="inherit"
                  sx={{
                    p: 0.5,
                    borderRadius: 2,
                    border: "1px solid rgba(255,255,255,0.35)",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
                    transition: "all 0.25s ease",
                    "&:hover": {
                      boxShadow: "0 8px 24px rgba(0,0,0,0.28)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: "#fff",
                      color: "primary.main",
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
            <Box>
              <Button color="inherit" component={RouterLink} to="/login">
                Đăng nhập
              </Button>
              <Button color="inherit" component={RouterLink} to="/register">
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
