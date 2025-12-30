import React, { Component, type ReactNode } from "react";
import { Box, Container, Typography, Button } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="sm">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "100vh",
              textAlign: "center",
              gap: 3,
            }}
          >
            <ErrorOutlineIcon sx={{ fontSize: 80, color: "error.main" }} />
            <Typography variant="h4" component="h1" gutterBottom>
              Đã xảy ra lỗi
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.
            </Typography>
            {this.state.error && (
              <Typography
                variant="body2"
                sx={{
                  p: 2,
                  bgcolor: "grey.100",
                  borderRadius: 1,
                  fontFamily: "monospace",
                  fontSize: "0.875rem",
                  maxWidth: "100%",
                  overflow: "auto",
                }}
              >
                {this.state.error.message}
              </Typography>
            )}
            <Button
              variant="contained"
              size="large"
              onClick={this.handleReload}
              sx={{ mt: 2 }}
            >
              Quay về trang chủ
            </Button>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
