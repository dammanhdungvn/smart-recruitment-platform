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
        users: { total: 0, candidates: 0, recruiters: 0 },
        jobs: { total: 0, active: 0, closed: 0 },
        resumes: { total: 0 },
        applications: { total: 0, pending: 0, accepted: 0, rejected: 0 },
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
                  users: { total: 100, candidates: 60, recruiters: 40 },
                  jobs: { total: 50, active: 30, closed: 20 },
                  resumes: { total: 200 },
                  applications: {
                    total: 75,
                    pending: 25,
                    accepted: 30,
                    rejected: 20,
                  },
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
        users: {
          total: 100,
          candidates: 60,
          recruiters: 40,
        },
        jobs: {
          total: 50,
          active: 30,
          closed: 20,
        },
        resumes: {
          total: 200,
        },
        applications: {
          total: 75,
          pending: 25,
          accepted: 30,
          rejected: 20,
        },
      },
    });

    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      // Check stats cards - use getAllByText since some labels appear multiple times
      expect(screen.getAllByText("Total Users").length).toBeGreaterThan(0);
      expect(screen.getAllByText("100").length).toBeGreaterThan(0);

      expect(screen.getAllByText("Total Jobs").length).toBeGreaterThan(0);
      expect(screen.getAllByText("50").length).toBeGreaterThan(0);

      expect(screen.getAllByText("Total Resumes").length).toBeGreaterThan(0);
      expect(screen.getAllByText("200").length).toBeGreaterThan(0);

      expect(screen.getAllByText("Total Applications").length).toBeGreaterThan(
        0
      );
      expect(screen.getAllByText("75").length).toBeGreaterThan(0);
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

  it("should render breakdown sections", async () => {
    vi.mocked(adminService.getStats).mockResolvedValue({
      success: true,
      message: "Stats retrieved",
      data: {
        users: {
          total: 10,
          candidates: 6,
          recruiters: 4,
        },
        jobs: {
          total: 5,
          active: 3,
          closed: 2,
        },
        resumes: {
          total: 20,
        },
        applications: {
          total: 8,
          pending: 3,
          accepted: 3,
          rejected: 2,
        },
      },
    });

    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("User Breakdown")).toBeInTheDocument();
      expect(screen.getByText("Application Status")).toBeInTheDocument();
      expect(screen.getByText("Candidates")).toBeInTheDocument();
      expect(screen.getByText("Recruiters")).toBeInTheDocument();
    });
  });

  it("should call getStats on mount", async () => {
    const getStatsSpy = vi.mocked(adminService.getStats).mockResolvedValue({
      success: true,
      message: "Stats retrieved",
      data: {
        users: { total: 0, candidates: 0, recruiters: 0 },
        jobs: { total: 0, active: 0, closed: 0 },
        resumes: { total: 0 },
        applications: { total: 0, pending: 0, accepted: 0, rejected: 0 },
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
