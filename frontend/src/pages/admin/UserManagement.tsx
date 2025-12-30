import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Alert,
  Skeleton,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import AdminLayout from "../../components/layout/AdminLayout";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import EmptyState from "../../components/admin/EmptyState";
import { adminService } from "../../services/adminService";
import type { UserListItem } from "../../types/admin.types";
import toast from "react-hot-toast";

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<UserListItem | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: "status" | "delete" | "role" | null;
    title: string;
    message: string;
    newValue?: any;
  }>({
    open: false,
    type: null,
    title: "",
    message: "",
  });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, [page]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminService.getUsers(page + 1);
      setUsers(response.data.users || []);
      setTotalUsers(response.data.pagination?.total || 0);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load users");
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    user: UserListItem
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleToggleStatus = () => {
    if (!selectedUser) return;

    const newStatus = selectedUser.is_active ? "inactive" : "active";
    setConfirmDialog({
      open: true,
      type: "status",
      title: `${newStatus === "active" ? "Activate" : "Deactivate"} User`,
      message: `Are you sure you want to ${
        newStatus === "active" ? "activate" : "deactivate"
      } ${selectedUser.full_name}? ${
        newStatus === "inactive" ? "This user will not be able to log in." : ""
      }`,
      newValue: newStatus,
    });
    handleMenuClose();
  };

  const handleChangeRole = (newRole: "candidate" | "recruiter" | "admin") => {
    if (!selectedUser) return;

    setConfirmDialog({
      open: true,
      type: "role",
      title: "Change User Role",
      message: `Are you sure you want to change ${selectedUser.full_name}'s role from "${selectedUser.role}" to "${newRole}"?`,
      newValue: newRole,
    });
    handleMenuClose();
  };

  const handleDeleteUser = () => {
    if (!selectedUser) return;

    setConfirmDialog({
      open: true,
      type: "delete",
      title: "Delete User",
      message: `Are you sure you want to delete ${selectedUser.full_name}? This action cannot be undone.`,
    });
    handleMenuClose();
  };

  const handleConfirmAction = async () => {
    if (!selectedUser || !confirmDialog.type) return;

    try {
      setActionLoading(true);

      if (confirmDialog.type === "status") {
        await adminService.updateUserStatus(selectedUser.id, {
          is_active: confirmDialog.newValue === "active",
        });
        toast.success(
          `User ${
            confirmDialog.newValue === "active" ? "activated" : "deactivated"
          } successfully`
        );
      } else if (confirmDialog.type === "role") {
        await adminService.updateUserRole(selectedUser.id, {
          role: confirmDialog.newValue,
        });
        toast.success(
          `User role updated to ${confirmDialog.newValue} successfully`
        );
      } else if (confirmDialog.type === "delete") {
        await adminService.deleteUser(selectedUser.id);
        toast.success("User deleted successfully");
      }

      setConfirmDialog({ open: false, type: null, title: "", message: "" });
      loadUsers();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Action failed");
      console.error("Action failed:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "#d32f2f";
      case "recruiter":
        return "#1976d2";
      case "candidate":
        return "#2e7d32";
      default:
        return "#757575";
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
          }}
        >
          User Management
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary", mb: 4 }}>
          Manage user accounts, roles, and status
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: "12px" }}>
            {error}
          </Alert>
        )}

        <Paper
          elevation={0}
          sx={{
            borderRadius: "16px",
            border: "1px solid rgba(0, 0, 0, 0.08)",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
            overflow: "hidden",
          }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "rgba(0, 0, 0, 0.02)" }}>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.875rem" }}>
                    ID
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.875rem" }}>
                    Full Name
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.875rem" }}>
                    Email
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.875rem" }}>
                    Role
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.875rem" }}>
                    Status
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.875rem" }}>
                    Joined
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 700, fontSize: "0.875rem" }}
                    align="right"
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading
                  ? Array.from({ length: 5 }).map((_, idx) => (
                      <TableRow key={idx}>
                        <TableCell colSpan={7}>
                          <Skeleton variant="rectangular" height={40} />
                        </TableCell>
                      </TableRow>
                    ))
                  : users.length === 0
                  ? null
                  : users.map((user) => (
                      <TableRow
                        key={user.id}
                        sx={{
                          "&:hover": { bgcolor: "rgba(0, 0, 0, 0.02)" },
                        }}
                      >
                        <TableCell sx={{ fontSize: "0.875rem" }}>
                          {user.id}
                        </TableCell>
                        <TableCell
                          sx={{ fontSize: "0.875rem", fontWeight: 600 }}
                        >
                          {user.full_name}
                        </TableCell>
                        <TableCell sx={{ fontSize: "0.875rem" }}>
                          {user.email}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={user.role.toUpperCase()}
                            size="small"
                            sx={{
                              bgcolor: `${getRoleColor(user.role)}15`,
                              color: getRoleColor(user.role),
                              fontWeight: 600,
                              fontSize: "0.75rem",
                              height: 24,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={
                              user.is_active ? (
                                <CheckCircleIcon />
                              ) : (
                                <CancelIcon />
                              )
                            }
                            label={user.is_active ? "Active" : "Inactive"}
                            size="small"
                            sx={{
                              bgcolor: user.is_active
                                ? "#2e7d3215"
                                : "#75757515",
                              color: user.is_active ? "#2e7d32" : "#757575",
                              fontWeight: 600,
                              fontSize: "0.75rem",
                              height: 24,
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ fontSize: "0.875rem" }}>
                          {new Date(user.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuOpen(e, user)}
                          >
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </TableContainer>

          {!loading && users.length === 0 && (
            <EmptyState
              title="No users found"
              description="No users registered yet"
            />
          )}

          <TablePagination
            component="div"
            count={totalUsers}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={60}
            rowsPerPageOptions={[60]}
            sx={{
              borderTop: "1px solid rgba(0, 0, 0, 0.08)",
              ".MuiTablePagination-toolbar": { minHeight: 56 },
            }}
          />
        </Paper>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleToggleStatus}>
            {selectedUser?.is_active ? "Deactivate User" : "Activate User"}
          </MenuItem>
          <MenuItem
            onClick={() => handleChangeRole("candidate")}
            disabled={selectedUser?.role === "candidate"}
          >
            Change Role to Candidate
          </MenuItem>
          <MenuItem
            onClick={() => handleChangeRole("recruiter")}
            disabled={selectedUser?.role === "recruiter"}
          >
            Change Role to Recruiter
          </MenuItem>
          <MenuItem
            onClick={() => handleChangeRole("admin")}
            disabled={selectedUser?.role === "admin"}
          >
            Change Role to Admin
          </MenuItem>
          <MenuItem onClick={handleDeleteUser} sx={{ color: "error.main" }}>
            Delete User
          </MenuItem>
        </Menu>

        <ConfirmDialog
          open={confirmDialog.open}
          title={confirmDialog.title}
          message={confirmDialog.message}
          onConfirm={handleConfirmAction}
          onCancel={() =>
            setConfirmDialog({
              open: false,
              type: null,
              title: "",
              message: "",
            })
          }
          confirmText="Confirm"
          cancelText="Cancel"
          variant={
            confirmDialog.type === "delete"
              ? "danger"
              : confirmDialog.type === "status" &&
                confirmDialog.newValue === "inactive"
              ? "danger"
              : "warning"
          }
          loading={actionLoading}
        />
      </Box>
    </AdminLayout>
  );
};

export default UserManagement;
