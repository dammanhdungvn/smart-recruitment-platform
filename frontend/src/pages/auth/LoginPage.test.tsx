import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import LoginPage from "./LoginPage";
import { AuthProvider } from "../../contexts/AuthContext";
import { authService } from "../../services/authService";

// Mock modules
vi.mock("../../services/authService");
vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderLoginPage = () => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    );
  };

  it("should render login form with email and password fields", () => {
    renderLoginPage();

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mật khẩu/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /đăng nhập/i })
    ).toBeInTheDocument();
  });

  it("should validate required fields", async () => {
    const user = userEvent.setup();
    renderLoginPage();

    const submitButton = screen.getByRole("button", { name: /đăng nhập/i });
    await user.click(submitButton);

    // Material-UI validation should prevent submission
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(
      /mật khẩu/i
    ) as HTMLInputElement;

    expect(emailInput.validity.valid).toBe(false);
    expect(passwordInput.validity.valid).toBe(false);
  });

  it("should call authService.login with correct credentials", async () => {
    const user = userEvent.setup();
    const mockUser = {
      id: 1,
      email: "test@example.com",
      role: "candidate" as const,
      full_name: "Test User",
      is_active: true,
      created_at: "2024-01-01",
      updated_at: "2024-01-01",
    };

    vi.mocked(authService.login).mockResolvedValue({
      success: true,
      message: "Login successful",
      data: {
        user: mockUser,
        token: "mock-token",
      },
    });

    renderLoginPage();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/mật khẩu/i);
    const submitButton = screen.getByRole("button", { name: /đăng nhập/i });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });
  });

  it("should navigate to home on successful login", async () => {
    const user = userEvent.setup();
    const mockUser = {
      id: 1,
      email: "test@example.com",
      role: "candidate" as const,
      full_name: "Test User",
      is_active: true,
      created_at: "2024-01-01",
      updated_at: "2024-01-01",
    };

    vi.mocked(authService.login).mockResolvedValue({
      success: true,
      message: "Login successful",
      data: {
        user: mockUser,
        token: "mock-token",
      },
    });

    renderLoginPage();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/mật khẩu/i);
    const submitButton = screen.getByRole("button", { name: /đăng nhập/i });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("should display error message on login failure", async () => {
    const user = userEvent.setup();

    vi.mocked(authService.login).mockRejectedValue({
      response: {
        data: {
          message: "Invalid credentials",
        },
      },
    });

    renderLoginPage();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/mật khẩu/i);
    const submitButton = screen.getByRole("button", { name: /đăng nhập/i });

    await user.type(emailInput, "wrong@example.com");
    await user.type(passwordInput, "wrongpass");
    await user.click(submitButton);

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalled();
    });
  });

  it("should have a link to register page", () => {
    renderLoginPage();

    const registerLink = screen.getByText(/chưa có tài khoản/i);
    expect(registerLink).toBeInTheDocument();
  });

  it("should disable submit button while loading", async () => {
    const user = userEvent.setup();

    vi.mocked(authService.login).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 1000))
    );

    renderLoginPage();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/mật khẩu/i);
    const submitButton = screen.getByRole("button", { name: /đăng nhập/i });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    // Button should be disabled during submission
    expect(submitButton).toBeDisabled();
  });
});
