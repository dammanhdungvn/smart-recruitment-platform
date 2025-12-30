import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Box,
  Button,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WorkIcon from "@mui/icons-material/Work";
import type { Job } from "../../types/job.types";
import { formatSalary } from "../../utils/formatters";

interface JobCardProps {
  job: Job;
  onApply?: (jobId: number) => void;
  showApplyButton?: boolean;
}

const JobCard: React.FC<JobCardProps> = ({
  job,
  onApply,
  showApplyButton = false,
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    // Only navigate if no apply button shown (view-only mode)
    if (!showApplyButton) {
      navigate(`/candidate/jobs/${job.id}`);
    }
  };

  const handleApplyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onApply) {
      onApply(job.id);
    }
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/candidate/jobs/${job.id}`);
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        cursor: showApplyButton ? "default" : "pointer",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 3,
        },
      }}
      onClick={handleCardClick}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          {job.job_title}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <LocationOnIcon
            fontSize="small"
            sx={{ mr: 0.5, color: "text.secondary" }}
          />
          <Typography variant="body2" color="text.secondary">
            {job.city}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <WorkIcon
            fontSize="small"
            sx={{ mr: 0.5, color: "text.secondary" }}
          />
          <Typography variant="body2" color="text.secondary">
            {job.job_type}
          </Typography>
        </Box>

        <Box sx={{ mb: 1 }}>
          <Chip label={job.position_level} size="small" sx={{ mr: 1, mb: 1 }} />
          <Chip
            label={job.job_fields}
            size="small"
            variant="outlined"
            sx={{ mb: 1 }}
          />
        </Box>

        <Typography variant="body2" color="primary" fontWeight="bold">
          {formatSalary(job.salary_min, job.salary_max, job.unit)}
        </Typography>
      </CardContent>

      {showApplyButton && onApply && (
        <CardActions
          onClick={(e) => e.stopPropagation()}
          sx={{ gap: 1, px: 2, pb: 2 }}
        >
          <Button
            size="small"
            variant="outlined"
            onClick={handleViewDetails}
            sx={{ flex: 1 }}
          >
            Chi tiết
          </Button>
          <Button
            size="small"
            variant="contained"
            onClick={handleApplyClick}
            sx={{ flex: 1 }}
          >
            Ứng tuyển
          </Button>
        </CardActions>
      )}
    </Card>
  );
};

export default JobCard;
