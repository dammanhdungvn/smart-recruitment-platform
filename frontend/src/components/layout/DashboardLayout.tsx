import React, { type ReactNode } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  useMediaQuery,
  useTheme,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Work as WorkIcon,
  Description as DescriptionIcon,
  Assignment as AssignmentIcon,
  Menu as MenuIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountCircleIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const drawerWidth = 260;

interface DashboardLayoutProps {
  children: ReactNode;
  role: "candidate" | "recruiter";
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  role,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const candidateMenuItems = [
    {
      text: "Dashboard",
      icon: <DashboardIcon />,
      path: "/candidate/dashboard",
    },
    { text: "Tìm việc làm", icon: <SearchIcon />, path: "/candidate/jobs" },
    {
      text: "CV của tôi",
      icon: <DescriptionIcon />,
      path: "/candidate/resumes",
    },
    {
      text: "Đơn ứng tuyển",
      icon: <AssignmentIcon />,
      path: "/candidate/applications",
    },
  ];

  const recruiterMenuItems = [
    {
      text: "Dashboard",
      icon: <DashboardIcon />,
      path: "/recruiter/dashboard",
    },
    {
      text: "Quản lý tin tuyển dụng",
      icon: <WorkIcon />,
      path: "/recruiter/jobs",
    },
    {
      text: "Quản lý ứng viên",
      icon: <AssignmentIcon />,
      path: "/recruiter/applications",
    },
  ];

  const menuItems =
    role === "candidate" ? candidateMenuItems : recruiterMenuItems;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate("/login");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          p: 3,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "10px",
            background:
              role === "candidate"
                ? "linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)"
                : "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: 900,
            fontSize: "1.25rem",
          }}
        >
          {role === "candidate" ? "C" : "R"}
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              fontSize: "1.125rem",
              lineHeight: 1.2,
            }}
          >
            {role === "candidate" ? "Candidate" : "Recruiter"}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              fontSize: "0.75rem",
            }}
          >
            {role === "candidate" ? "Portal" : "Hub"}
          </Typography>
        </Box>
      </Box>

      <List sx={{ flex: 1, px: 2, py: 2 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) setMobileOpen(false);
                }}
                sx={{
                  borderRadius: "12px",
                  px: 2,
                  py: 1.5,
                  bgcolor: isActive
                    ? role === "candidate"
                      ? "rgba(46, 125, 50, 0.08)"
                      : "rgba(25, 118, 210, 0.08)"
                    : "transparent",
                  color: isActive
                    ? role === "candidate"
                      ? "#2e7d32"
                      : "#1976d2"
                    : "text.primary",
                  fontWeight: isActive ? 700 : 500,
                  "&:hover": {
                    bgcolor: isActive
                      ? role === "candidate"
                        ? "rgba(46, 125, 50, 0.12)"
                        : "rgba(25, 118, 210, 0.12)"
                      : "rgba(0, 0, 0, 0.04)",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: "inherit",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: "0.9375rem",
                    fontWeight: "inherit",
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box
        sx={{
          p: 2,
          borderTop: "1px solid rgba(0, 0, 0, 0.08)",
        }}
      >
        <Box
          sx={{
            p: 2,
            borderRadius: "12px",
            bgcolor: "rgba(0, 0, 0, 0.02)",
            border: "1px solid rgba(0, 0, 0, 0.08)",
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              fontSize: "0.75rem",
              fontWeight: 500,
            }}
          >
            {role === "candidate"
              ? "Tài khoản ứng viên"
              : "Tài khoản nhà tuyển dụng"}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              mt: 0.5,
              fontSize: "0.875rem",
            }}
          >
            {user?.full_name || user?.email}
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f8fafc" }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: "white",
          borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" }, color: "text.primary" }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ flexGrow: 1 }} />

          <IconButton
            onClick={handleMenuOpen}
            sx={{
              p: 0.5,
              border: "1px solid rgba(0, 0, 0, 0.08)",
              borderRadius: "10px",
            }}
          >
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: role === "candidate" ? "#2e7d32" : "#1976d2",
                fontSize: "0.875rem",
                fontWeight: 700,
              }}
            >
              {user?.full_name ? getInitials(user.full_name) : "U"}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              elevation: 0,
              sx: {
                mt: 1.5,
                minWidth: 200,
                borderRadius: "12px",
                border: "1px solid rgba(0, 0, 0, 0.08)",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {user?.full_name || user?.email}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "text.secondary", fontSize: "0.75rem" }}
              >
                {user?.email}
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={() => navigate("/")}>
              <ListItemIcon>
                <AccountCircleIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Trang chủ</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Đăng xuất</ListItemText>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              border: "none",
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              border: "none",
              borderRight: "1px solid rgba(0, 0, 0, 0.08)",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: "64px",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;
