import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/common/Navbar";
import ProtectedRoute from "./components/common/ProtectedRoute";
import ErrorBoundary from "./components/common/ErrorBoundary";
import LoadingFallback from "./components/common/LoadingFallback";

// Eager load critical pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

// Lazy load other pages for code splitting
const CandidateDashboard = lazy(
  () => import("./pages/candidate/CandidateDashboard")
);
const JobSearchPage = lazy(() => import("./pages/candidate/JobSearchPage"));
const JobDetailPage = lazy(() => import("./pages/candidate/JobDetailPage"));
const ResumeManagementPage = lazy(
  () => import("./pages/candidate/ResumeManagementPage")
);
const ApplicationsPage = lazy(
  () => import("./pages/candidate/ApplicationsPage")
);

const RecruiterDashboard = lazy(
  () => import("./pages/recruiter/RecruiterDashboard")
);
const JobManagementPage = lazy(
  () => import("./pages/recruiter/JobManagementPage")
);
const RecruiterApplicationsPage = lazy(
  () => import("./pages/recruiter/RecruiterApplicationsPage")
);

const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const UserManagement = lazy(() => import("./pages/admin/UserManagement"));
const AdminJobManagement = lazy(() => import("./pages/admin/JobManagement"));
const ApplicationManagement = lazy(
  () => import("./pages/admin/ApplicationManagement")
);
const AdminResumeManagement = lazy(
  () => import("./pages/admin/ResumeManagement")
);

const CandidateSettings = lazy(() => import("./pages/candidate/SettingsPage"));
const RecruiterSettings = lazy(() => import("./pages/recruiter/SettingsPage"));
const AdminSettings = lazy(() => import("./pages/admin/SettingsPage"));

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <BrowserRouter>
            <Navbar />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: "#363636",
                  color: "#fff",
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: "#4caf50",
                    secondary: "#fff",
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: "#f44336",
                    secondary: "#fff",
                  },
                },
              }}
            />
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route
                  path="/candidate/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={["candidate"]}>
                      <CandidateDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/candidate/jobs"
                  element={
                    <ProtectedRoute allowedRoles={["candidate"]}>
                      <JobSearchPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/candidate/jobs/:id"
                  element={
                    <ProtectedRoute allowedRoles={["candidate"]}>
                      <JobDetailPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/candidate/resumes"
                  element={
                    <ProtectedRoute allowedRoles={["candidate"]}>
                      <ResumeManagementPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/candidate/applications"
                  element={
                    <ProtectedRoute allowedRoles={["candidate"]}>
                      <ApplicationsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/candidate/settings"
                  element={
                    <ProtectedRoute allowedRoles={["candidate"]}>
                      <CandidateSettings />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/recruiter/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={["recruiter"]}>
                      <RecruiterDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/recruiter/jobs"
                  element={
                    <ProtectedRoute allowedRoles={["recruiter"]}>
                      <JobManagementPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/recruiter/applications"
                  element={
                    <ProtectedRoute allowedRoles={["recruiter"]}>
                      <RecruiterApplicationsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/recruiter/applications/:jobId"
                  element={
                    <ProtectedRoute allowedRoles={["recruiter"]}>
                      <RecruiterApplicationsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/recruiter/settings"
                  element={
                    <ProtectedRoute allowedRoles={["recruiter"]}>
                      <RecruiterSettings />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <UserManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/jobs"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AdminJobManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/applications"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <ApplicationManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/resumes"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AdminResumeManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/settings"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AdminSettings />
                    </ProtectedRoute>
                  }
                />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
