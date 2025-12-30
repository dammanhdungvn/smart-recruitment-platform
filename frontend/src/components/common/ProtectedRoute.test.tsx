import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { useAuth } from "../../contexts/AuthContext";
import type { User } from "../../types/user.types";

// Mock navigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    Navigate: ({ to }: { to: string }) => <div>Redirected to {to}</div>,
  };
});

// Mock AuthContext
vi.mock("../../contexts/AuthContext", async () => {
  const actual = await vi.importActual("../../contexts/AuthContext");
  return {
    ...actual,
    useAuth: vi.fn(),
  };
});

describe("ProtectedRoute", () => {
  const mockUseAuth = vi.mocked(useAuth);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const TestComponent = () => <div>Protected Content</div>;

  it("should show loading spinner when loading", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: true,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      updateProfile: vi.fn(),
    });

    render(
      <BrowserRouter>
        <ProtectedRoute allowedRoles={["candidate"]}>
          <TestComponent />
        </ProtectedRoute>
      </BrowserRouter>
    );

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("should redirect to /login when user is not authenticated", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      updateProfile: vi.fn(),
    });

    render(
      <BrowserRouter>
        <ProtectedRoute allowedRoles={["candidate"]}>
          <TestComponent />
        </ProtectedRoute>
      </BrowserRouter>
    );

    expect(screen.getByText("Redirected to /login")).toBeInTheDocument();
  });

  it("should redirect to / when user role is not allowed", () => {
    const mockUser: User = {
      id: 1,
      email: "test@example.com",
      role: "candidate",
      full_name: "Test User",
      is_active: true,
      created_at: "2024-01-01",
      updated_at: "2024-01-01",
    };

    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      updateProfile: vi.fn(),
    });

    render(
      <BrowserRouter>
        <ProtectedRoute allowedRoles={["recruiter", "admin"]}>
          <TestComponent />
        </ProtectedRoute>
      </BrowserRouter>
    );

    expect(screen.getByText("Redirected to /")).toBeInTheDocument();
  });

  it("should render children when user is authenticated and has correct role", () => {
    const mockUser: User = {
      id: 1,
      email: "candidate@example.com",
      role: "candidate",
      full_name: "Test Candidate",
      is_active: true,
      created_at: "2024-01-01",
      updated_at: "2024-01-01",
    };

    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      updateProfile: vi.fn(),
    });

    render(
      <BrowserRouter>
        <ProtectedRoute allowedRoles={["candidate"]}>
          <TestComponent />
        </ProtectedRoute>
      </BrowserRouter>
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("should allow access when user has one of multiple allowed roles", () => {
    const mockUser: User = {
      id: 2,
      email: "recruiter@example.com",
      role: "recruiter",
      full_name: "Test Recruiter",
      is_active: true,
      created_at: "2024-01-01",
      updated_at: "2024-01-01",
    };

    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      updateProfile: vi.fn(),
    });

    render(
      <BrowserRouter>
        <ProtectedRoute allowedRoles={["recruiter", "admin"]}>
          <TestComponent />
        </ProtectedRoute>
      </BrowserRouter>
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("should allow admin to access all routes", () => {
    const mockUser: User = {
      id: 3,
      email: "admin@example.com",
      role: "admin",
      full_name: "Test Admin",
      is_active: true,
      created_at: "2024-01-01",
      updated_at: "2024-01-01",
    };

    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      updateProfile: vi.fn(),
    });

    render(
      <BrowserRouter>
        <ProtectedRoute allowedRoles={["admin"]}>
          <TestComponent />
        </ProtectedRoute>
      </BrowserRouter>
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });
});
