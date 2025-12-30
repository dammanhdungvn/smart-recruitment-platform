import React from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import {
  Inbox as InboxIcon,
  Search as SearchIcon,
  Work as WorkIcon,
  Description as DescriptionIcon,
} from "@mui/icons-material";

interface EmptyStateProps {
  icon?: "inbox" | "search" | "work" | "document";
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon = "inbox",
  title,
  description,
  actionLabel,
  onAction,
}) => {
  const getIcon = () => {
    switch (icon) {
      case "search":
        return <SearchIcon sx={{ fontSize: 64, color: "text.disabled" }} />;
      case "work":
        return <WorkIcon sx={{ fontSize: 64, color: "text.disabled" }} />;
      case "document":
        return (
          <DescriptionIcon sx={{ fontSize: 64, color: "text.disabled" }} />
        );
      default:
        return <InboxIcon sx={{ fontSize: 64, color: "text.disabled" }} />;
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 6,
        textAlign: "center",
        borderRadius: "16px",
        border: "1px solid rgba(0, 0, 0, 0.08)",
        bgcolor: "#fafafa",
      }}
    >
      <Box sx={{ mb: 2 }}>{getIcon()}</Box>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          mb: 1,
          color: "text.primary",
        }}
      >
        {title}
      </Typography>
      {description && (
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            mb: 3,
            maxWidth: 400,
            mx: "auto",
          }}
        >
          {description}
        </Typography>
      )}
      {actionLabel && onAction && (
        <Button variant="contained" onClick={onAction} sx={{ mt: 1 }}>
          {actionLabel}
        </Button>
      )}
    </Paper>
  );
};

export default EmptyState;
