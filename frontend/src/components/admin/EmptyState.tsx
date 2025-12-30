import React from "react";
import { Box, Typography } from "@mui/material";
import { Inbox as InboxIcon } from "@mui/icons-material";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
}) => {
  return (
    <Box
      sx={{
        py: 8,
        px: 2,
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          bgcolor: "rgba(0, 0, 0, 0.04)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "text.secondary",
          "& svg": {
            fontSize: 40,
          },
        }}
      >
        {icon || <InboxIcon />}
      </Box>
      <Box>
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, mb: 0.5, color: "text.primary" }}
        >
          {title}
        </Typography>
        {description && (
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {description}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default EmptyState;
