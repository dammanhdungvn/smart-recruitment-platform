import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import AdminDashboard from "../../pages/admin/AdminDashboard";
import { adminService } from "../../services/adminService";

// Mock adminService
vi.mock("../../services/adminService", () => ({
  adminService: {
    getStats: vi.fn(),
  },
}));

// Mock AuthContext
vi.mock("../../contexts/AuthContext", () => ({
  useAuth: () => ({
    user: {
      id: 1,
      full_name: "Admin User",
      email: "admin@example.com",
      role: "admin",
    },
    loading: false,
    logout: vi.fn(),
  }),
}));

// Mock AdminLayout
vi.mock("../../components/layout/AdminLayout", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="admin-layout">{children}</div>
  ),
}));

describe("AdminDashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render dashboard title", () => {
    vi.mocked(adminService.getStats).mockResolvedValue({
      success: true,
      message: "Stats retrieved",
      data: {
        totalUsers: 0,
        totalJobs: 0,
        totalResumes: 0,
        totalApplications: 0,
      },
    });

    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(
      screen.getByText("Overview of your recruitment platform")
    ).toBeInTheDocument();
  });

  it("should display loading state", async () => {
    vi.mocked(adminService.getStats).mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                success: true,
                message: "Stats retrieved",
                data: {
                  totalUsers: 100,
                  totalJobs: 50,
                  totalResumes: 200,
                  totalApplications: 75,
                },
              }),
            100
          )
        )
    );

    const { container } = render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );

    // Should show skeletons during loading
    const skeletons = container.querySelectorAll(".MuiSkeleton-root");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("should display stats after loading", async () => {
    vi.mocked(adminService.getStats).mockResolvedValue({
      success: true,
      message: "Stats retrieved",
      data: {
        totalUsers: 100,
        totalJobs: 50,
        totalResumes: 200,
        totalApplications: 75,
      },
    });

    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Total Users")).toBeInTheDocument();
      expect(screen.getByText("100")).toBeInTheDocument();

      expect(screen.getByText("Total Jobs")).toBeInTheDocument();
      expect(screen.getByText("50")).toBeInTheDocument();

      expect(screen.getByText("Total Resumes")).toBeInTheDocument();
      expect(screen.getByText("200")).toBeInTheDocument();

      expect(screen.getByText("Total Applications")).toBeInTheDocument();
      expect(screen.getByText("75")).toBeInTheDocument();
    });
  });

  it("should display error message on failure", async () => {
    vi.mocked(adminService.getStats).mockRejectedValue({
      response: {
        data: {
          message: "Failed to load dashboard stats",
        },
      },
    });

    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText("Failed to load dashboard stats")
      ).toBeInTheDocument();
    });
  });

  it("should render chart placeholders", async () => {
    vi.mocked(adminService.getStats).mockResolvedValue({
      success: true,
      message: "Stats retrieved",
      data: {
        totalUsers: 10,
        totalJobs: 5,
        totalResumes: 20,
        totalApplications: 8,
      },
    });

    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Jobs Over Time")).toBeInTheDocument();
      expect(screen.getByText("Applications by Status")).toBeInTheDocument();
    });
  });

  it("should call getStats on mount", async () => {
    const getStatsSpy = vi.mocked(adminService.getStats).mockResolvedValue({
      success: true,
      message: "Stats retrieved",
      data: {
        totalUsers: 0,
        totalJobs: 0,
        totalResumes: 0,
        totalApplications: 0,
      },
    });

    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(getStatsSpy).toHaveBeenCalledTimes(1);
    });
  });
});
