import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  FormControlLabel,
  IconButton,
  LinearProgress,
  Paper,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  Pagination,
} from "@mui/material";
import {
  CloudUpload,
  DeleteOutline,
  FileOpen,
  Star,
} from "@mui/icons-material";
import toast from "react-hot-toast";
import { resumeService } from "../../services/resumeService";
import type { Resume } from "../../types/resume.types";
import type { PaginationMeta } from "../../types/api.types";
import { formatDate, formatFileSize } from "../../utils/formatters";

const ResumeManagementPage: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    limit: 60,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [category, setCategory] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [isPrimary, setIsPrimary] = useState(false);
  const [actionId, setActionId] = useState<number | null>(null);

  const fileBaseUrl = useMemo(() => {
    const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    return apiBase.replace(/\/?api$/, "");
  }, []);

  useEffect(() => {
    void loadResumes(pagination.page);
  }, [pagination.page]);

  const loadResumes = async (page: number) => {
    setLoading(true);
    try {
      const response = await resumeService.getResumes(page);
      const list = response.data?.resumes || [];
      const meta = response.data?.pagination || {
        page,
        limit: 60,
        total: list.length,
        totalPages: 1,
      };
      setResumes(list);
      setPagination(meta);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Không thể tải danh sách CV"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Vui lòng chọn file CV (.pdf, .doc, .docx)");
      return;
    }

    const formData = new FormData();
    formData.append("resume", selectedFile);
    if (category.trim()) formData.append("category", category.trim());
    if (resumeText.trim()) formData.append("resume_text", resumeText.trim());
    formData.append("is_primary", String(isPrimary));

    setUploading(true);
    try {
      await resumeService.uploadResume(formData);
      toast.success("Tải lên CV thành công");
      setSelectedFile(null);
      setCategory("");
      setResumeText("");
      setIsPrimary(false);
      setPagination((prev) => ({ ...prev, page: 1 }));
      void loadResumes(1);
      if (fileInputRef.current?.value) {
        fileInputRef.current.value = "";
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Không thể tải lên CV");
    } finally {
      setUploading(false);
    }
  };

  const handleSetPrimary = async (id: number) => {
    setActionId(id);
    try {
      await resumeService.setPrimaryResume(id);
      toast.success("Đã đặt làm CV chính");
      void loadResumes(pagination.page);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Không thể cập nhật");
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn chắc chắn muốn xóa CV này?")) return;
    setActionId(id);
    try {
      await resumeService.deleteResume(id);
      toast.success("Đã xóa CV");
      void loadResumes(pagination.page);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Không thể xóa CV");
    } finally {
      setActionId(null);
    }
  };

  const buildFileUrl = (path: string) => {
    if (!path) return "#";
    const normalized = path.startsWith("/") ? path : `/${path}`;
    return `${fileBaseUrl}${normalized}`;
  };

  const renderRows = () => {
    if (loading) {
      return (
        <TableRow>
          <TableCell colSpan={4}>
            <LinearProgress />
          </TableCell>
        </TableRow>
      );
    }

    if (!resumes.length) {
      return (
        <TableRow>
          <TableCell colSpan={4} align="center">
            <Typography color="text.secondary">
              Chưa có CV nào. Hãy tải lên CV đầu tiên của bạn.
            </Typography>
          </TableCell>
        </TableRow>
      );
    }

    return resumes.map((resume) => (
      <TableRow key={resume.id} hover>
        <TableCell>
          <Stack direction="row" spacing={1} alignItems="center">
            <FileOpen fontSize="small" color="action" />
            <Box>
              <Typography fontWeight={700}>{resume.file_name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {formatFileSize(resume.file_size)} ·{" "}
                {formatDate(resume.created_at)}
              </Typography>
            </Box>
          </Stack>
        </TableCell>
        <TableCell>
          {resume.category ? (
            <Chip label={resume.category} size="small" variant="outlined" />
          ) : (
            <Typography variant="body2" color="text.secondary">
              Không phân loại
            </Typography>
          )}
        </TableCell>
        <TableCell>
          {resume.is_primary ? (
            <Chip
              icon={<Star fontSize="small" />}
              label="CV chính"
              color="primary"
              size="small"
              sx={{ fontWeight: 700 }}
            />
          ) : (
            <Chip label="Phụ" size="small" variant="outlined" />
          )}
        </TableCell>
        <TableCell align="right">
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button
              size="small"
              variant="outlined"
              href={buildFileUrl(resume.file_path)}
              target="_blank"
              rel="noreferrer"
            >
              Tải / Xem
            </Button>
            {!resume.is_primary && (
              <Tooltip title="Đặt làm CV chính">
                <span>
                  <Button
                    size="small"
                    variant="contained"
                    disabled={actionId === resume.id}
                    onClick={() => void handleSetPrimary(resume.id)}
                  >
                    Đặt chính
                  </Button>
                </span>
              </Tooltip>
            )}
            <Tooltip title="Xóa CV">
              <span>
                <IconButton
                  color="error"
                  size="small"
                  disabled={actionId === resume.id}
                  onClick={() => void handleDelete(resume.id)}
                >
                  <DeleteOutline />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4" fontWeight={800} gutterBottom>
            Quản lý CV
          </Typography>
          <Typography color="text.secondary">
            Tải lên, đặt CV chính và quản lý các bản CV của bạn.
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            border: "1px solid rgba(0,0,0,0.08)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
          }}
        >
          <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
            <Stack
              spacing={2}
              flex={1}
              sx={{
                border: "1px dashed rgba(0,0,0,0.2)",
                borderRadius: 2,
                p: 2.5,
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                background: "linear-gradient(135deg, #f0f5ff, #f9fbff)",
              }}
            >
              <CloudUpload color="primary" sx={{ fontSize: 44 }} />
              <Typography fontWeight={700}>
                Kéo thả hoặc chọn file CV
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Hỗ trợ PDF, DOC, DOCX. Dung lượng tối đa 5MB.
              </Typography>
              <Button
                variant="contained"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                Chọn file
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                style={{ display: "none" }}
                onChange={handleSelectFile}
              />
              {selectedFile && (
                <Chip
                  label={selectedFile.name}
                  onDelete={() => setSelectedFile(null)}
                  variant="outlined"
                />
              )}
            </Stack>

            <Stack spacing={2} flex={1.2}>
              <TextField
                label="Phân loại (tùy chọn)"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                fullWidth
              />
              <TextField
                label="Tóm tắt nội dung (tùy chọn)"
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                fullWidth
                multiline
                minRows={3}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={isPrimary}
                    onChange={(e) => setIsPrimary(e.target.checked)}
                    color="primary"
                  />
                }
                label="Đặt làm CV chính"
              />
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  onClick={() => void handleUpload()}
                  disabled={uploading}
                >
                  {uploading ? "Đang tải lên..." : "Tải lên CV"}
                </Button>
                <Button
                  variant="text"
                  onClick={() => {
                    setSelectedFile(null);
                    setCategory("");
                    setResumeText("");
                    setIsPrimary(false);
                    if (fileInputRef.current?.value) {
                      fileInputRef.current.value = "";
                    }
                  }}
                >
                  Hủy
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            border: "1px solid rgba(0,0,0,0.08)",
            overflow: "hidden",
          }}
        >
          <Box sx={{ p: 2.5 }}>
            <Typography variant="h6" fontWeight={800} gutterBottom>
              Danh sách CV
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Bạn có thể đặt CV chính để ưu tiên khi ứng tuyển.
            </Typography>
          </Box>
          <Divider />
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tên file</TableCell>
                  <TableCell>Phân loại</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell align="right">Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{renderRows()}</TableBody>
            </Table>
          </TableContainer>
          {pagination.totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
              <Pagination
                count={pagination.totalPages}
                page={pagination.page}
                onChange={(_, value) =>
                  setPagination((prev) => ({ ...prev, page: value }))
                }
                color="primary"
              />
            </Box>
          )}
        </Paper>
      </Stack>
    </Container>
  );
};

export default ResumeManagementPage;
