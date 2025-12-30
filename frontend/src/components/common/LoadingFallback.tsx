import { Box, CircularProgress } from "@mui/material";

const LoadingFallback = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "80vh",
      }}
    >
      <CircularProgress size={60} />
    </Box>
  );
};

export default LoadingFallback;
