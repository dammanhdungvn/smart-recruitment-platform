import React from "react";
import { Box, Typography, Button, Breadcrumbs, Link } from "@mui/material";
import { NavigateNext as NavigateNextIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  action?: {
    label: string;
    onClick: () => void;
    variant?: "contained" | "outlined";
    startIcon?: React.ReactNode;
  };
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs,
  action,
}) => {
  const navigate = useNavigate();

  return (
    <Box sx={{ mb: 4 }}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          sx={{ mb: 1.5 }}
        >
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return isLast ? (
              <Typography
                key={index}
                variant="body2"
                sx={{ color: "text.primary", fontWeight: 600 }}
              >
                {crumb.label}
              </Typography>
            ) : (
              <Link
                key={index}
                component="button"
                variant="body2"
                onClick={() => crumb.path && navigate(crumb.path)}
                sx={{
                  color: "text.secondary",
                  textDecoration: "none",
                  "&:hover": {
                    color: "primary.main",
                  },
                }}
              >
                {crumb.label}
              </Link>
            );
          })}
        </Breadcrumbs>
      )}

      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 900,
              fontSize: { xs: "1.75rem", md: "2.125rem" },
              mb: subtitle ? 0.5 : 0,
              color: "text.primary",
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                fontSize: "0.9375rem",
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>

        {action && (
          <Button
            variant={action.variant || "contained"}
            onClick={action.onClick}
            startIcon={action.startIcon}
            sx={{
              borderRadius: "10px",
              px: 3,
              py: 1.25,
              fontWeight: 600,
              textTransform: "none",
            }}
          >
            {action.label}
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default PageHeader;
