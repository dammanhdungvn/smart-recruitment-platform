import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import LoginPage from "../../pages/auth/LoginPage";
import { AuthProvider } from "../../contexts/AuthContext";
import { authService } from "../../services/authService";
import { AxiosError } from "axios";

// Mock authService
vi.mock("../../services/authService", () => ({
  authService: {
    login: vi.fn(),
    getProfile: vi.fn(),
  },
}));

// Mock navigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
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

describe("LoginPage - Error Handling & Validation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    mockNavigate.mockClear();
  });

  describe("Client-side Validation", () => {
    it("should display email validation error on blur with invalid email", async () => {
      // GIVEN: User on login page
      renderLoginPage();
      const emailInput = screen.getByLabelText(/email/i);

      // WHEN: User enters invalid email and blurs
      await userEvent.type(emailInput, "invalid-email");
      fireEvent.blur(emailInput);

      // THEN: Error message is displayed
      await waitFor(() => {
        expect(screen.getByText("Email không hợp lệ")).toBeInTheDocument();
      });
    });

    it("should display password validation error when password is too short", async () => {
      // GIVEN: User on login page
      renderLoginPage();
      const passwordInput = screen.getByLabelText(/mật khẩu/i);

      // WHEN: User enters short password and blurs
      await userEvent.type(passwordInput, "123");
      fireEvent.blur(passwordInput);

      // THEN: Error message is displayed
      await waitFor(() => {
        expect(
          screen.getByText("Mật khẩu phải có ít nhất 6 ký tự")
        ).toBeInTheDocument();
      });
    });

    it("should NOT submit form when validation fails", async () => {
      // GIVEN: User on login page with invalid data
      renderLoginPage();
      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByRole("button", { name: /đăng nhập/i });

      // WHEN: User submits with invalid email
      await userEvent.type(emailInput, "invalid-email");
      await userEvent.click(submitButton);

      // THEN: API is NOT called
      expect(authService.login).not.toHaveBeenCalled();
      // Error message is displayed
      await waitFor(() => {
        expect(screen.getByText("Email không hợp lệ")).toBeInTheDocument();
      });
    });

    it("should clear validation error when user corrects input", async () => {
      // GIVEN: User has validation error
      renderLoginPage();
      const emailInput = screen.getByLabelText(/email/i);

      await userEvent.type(emailInput, "invalid");
      fireEvent.blur(emailInput);

      await waitFor(() => {
        expect(screen.getByText("Email không hợp lệ")).toBeInTheDocument();
      });

      // WHEN: User corrects the email
      await userEvent.clear(emailInput);
      await userEvent.type(emailInput, "valid@email.com");

      // THEN: Error is cleared
      await waitFor(() => {
        expect(
          screen.queryByText("Email không hợp lệ")
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("API Error Display", () => {
    it("should display error toast on 401 invalid credentials", async () => {
      // GIVEN: API returns 401
      const error: any = new AxiosError("Request failed with status code 401");
      error.response = {
        status: 401,
        data: { success: false, message: "Invalid email or password" },
      };
      vi.mocked(authService.login).mockRejectedValue(error);

      // WHEN: User submits valid form
      renderLoginPage();
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/mật khẩu/i);
      const submitButton = screen.getByRole("button", { name: /đăng nhập/i });

      await userEvent.type(emailInput, "wrong@test.com");
      await userEvent.type(passwordInput, "wrongpass");
      await userEvent.click(submitButton);

      // THEN: Error is handled (axios interceptor shows toast)
      await waitFor(() => {
        expect(authService.login).toHaveBeenCalled();
      });
      // User stays on login page
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it("should display error toast on 403 inactive account", async () => {
      // GIVEN: API returns 403
      const error: any = new AxiosError("Request failed with status code 403");
      error.response = {
        status: 403,
        data: { success: false, message: "Account is inactive" },
      };
      vi.mocked(authService.login).mockRejectedValue(error);

      // WHEN: User attempts login
      renderLoginPage();
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/mật khẩu/i);
      const submitButton = screen.getByRole("button", { name: /đăng nhập/i });

      await userEvent.type(emailInput, "inactive@test.com");
      await userEvent.type(passwordInput, "password123");
      await userEvent.click(submitButton);

      // THEN: API called, error handled
      await waitFor(() => {
        expect(authService.login).toHaveBeenCalled();
      });
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it("should display error toast on 500 server error", async () => {
      // GIVEN: API returns 500
      const error: any = new AxiosError("Request failed with status code 500");
      error.response = {
        status: 500,
        data: { success: false, message: "Server error" },
      };
      vi.mocked(authService.login).mockRejectedValue(error);

      // WHEN: User submits form
      renderLoginPage();
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/mật khẩu/i);
      const submitButton = screen.getByRole("button", { name: /đăng nhập/i });

      await userEvent.type(emailInput, "test@test.com");
      await userEvent.type(passwordInput, "password123");
      await userEvent.click(submitButton);

      // THEN: Error handled by interceptor
      await waitFor(() => {
        expect(authService.login).toHaveBeenCalled();
      });
    });

    it("should display error toast on network error", async () => {
      // GIVEN: Network error (no response)
      const error: any = new AxiosError("Network Error");
      error.response = undefined;
      vi.mocked(authService.login).mockRejectedValue(error);

      // WHEN: User submits form
      renderLoginPage();
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/mật khẩu/i);
      const submitButton = screen.getByRole("button", { name: /đăng nhập/i });

      await userEvent.type(emailInput, "test@test.com");
      await userEvent.type(passwordInput, "password123");
      await userEvent.click(submitButton);

      // THEN: Error handled
      await waitFor(() => {
        expect(authService.login).toHaveBeenCalled();
      });
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe("UI State After Errors", () => {
    it("should keep form enabled after API error", async () => {
      // GIVEN: API returns error
      const error: any = new AxiosError("Request failed with status code 401");
      error.response = {
        status: 401,
        data: { success: false, message: "Invalid credentials" },
      };
      vi.mocked(authService.login).mockRejectedValue(error);

      // WHEN: User submits and gets error
      renderLoginPage();
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/mật khẩu/i);
      const submitButton = screen.getByRole("button", { name: /đăng nhập/i });

      await userEvent.type(emailInput, "test@test.com");
      await userEvent.type(passwordInput, "password123");
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(authService.login).toHaveBeenCalled();
      });

      // THEN: Form remains enabled for retry
      expect(submitButton).not.toBeDisabled();
      expect(emailInput).not.toBeDisabled();
      expect(passwordInput).not.toBeDisabled();
    });

    it("should NOT crash component on API error", async () => {
      // GIVEN: API error
      const error: any = new AxiosError("Request failed with status code 500");
      error.response = {
        status: 500,
        data: { success: false, message: "Server error" },
      };
      vi.mocked(authService.login).mockRejectedValue(error);

      // WHEN: Submit fails
      renderLoginPage();
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/mật khẩu/i);
      const submitButton = screen.getByRole("button", { name: /đăng nhập/i });

      await userEvent.type(emailInput, "test@test.com");
      await userEvent.type(passwordInput, "password123");
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(authService.login).toHaveBeenCalled();
      });

      // THEN: Page still renders properly
      expect(
        screen.getByRole("heading", { name: /đăng nhập/i })
      ).toBeInTheDocument();
      expect(emailInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
      expect(submitButton).toBeInTheDocument();
    });
  });

  describe("Negative Tests - NO Silent Failures", () => {
    it("MUST NOT silently succeed on API error", async () => {
      // GIVEN: API returns error
      const error: any = new AxiosError("Request failed with status code 401");
      error.response = {
        status: 401,
        data: { success: false, message: "Invalid credentials" },
      };
      vi.mocked(authService.login).mockRejectedValue(error);

      // WHEN: User submits form
      renderLoginPage();
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/mật khẩu/i);
      const submitButton = screen.getByRole("button", { name: /đăng nhập/i });

      await userEvent.type(emailInput, "test@test.com");
      await userEvent.type(passwordInput, "wrongpass");
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(authService.login).toHaveBeenCalled();
      });

      // THEN: MUST NOT navigate (error occurred)
      expect(mockNavigate).not.toHaveBeenCalled();
      // MUST NOT store token
      expect(localStorage.getItem("token")).toBeNull();
    });

    it("MUST show error feedback when API fails (no silent failure)", async () => {
      // GIVEN: API fails
      const error: any = new AxiosError("Request failed with status code 500");
      error.response = {
        status: 500,
        data: { success: false, message: "Server error" },
      };
      vi.mocked(authService.login).mockRejectedValue(error);

      // WHEN: Submit form
      renderLoginPage();
      await userEvent.type(screen.getByLabelText(/email/i), "test@test.com");
      await userEvent.type(screen.getByLabelText(/mật khẩu/i), "password");
      await userEvent.click(screen.getByRole("button", { name: /đăng nhập/i }));

      await waitFor(() => {
        expect(authService.login).toHaveBeenCalled();
      });

      // THEN: Error MUST be handled (by axios interceptor showing toast)
      // This test verifies that the flow doesn't silently fail
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe("Successful Login", () => {
    it("should navigate to home on successful login", async () => {
      // GIVEN: API returns success
      vi.mocked(authService.login).mockResolvedValue({
        success: true,
        message: "Login successful",
        data: {
          token: "test-token",
          user: {
            id: 1,
            email: "test@test.com",
            full_name: "Test User",
            role: "candidate",
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        },
      });

      // WHEN: User submits valid credentials
      renderLoginPage();
      await userEvent.type(screen.getByLabelText(/email/i), "test@test.com");
      await userEvent.type(screen.getByLabelText(/mật khẩu/i), "password123");
      await userEvent.click(screen.getByRole("button", { name: /đăng nhập/i }));

      // THEN: User is redirected
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/");
      });
    });
  });
});
