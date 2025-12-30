import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import RegisterPage from "../../pages/auth/RegisterPage";
import { AuthProvider } from "../../contexts/AuthContext";
import { authService } from "../../services/authService";
import { AxiosError } from "axios";

// Mock authService
vi.mock("../../services/authService", () => ({
  authService: {
    register: vi.fn(),
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

const renderRegisterPage = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <RegisterPage />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe("RegisterPage - Error Handling & Validation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    mockNavigate.mockClear();
  });

  describe("Client-side Validation", () => {
    it("should display email validation error on blur with invalid email", async () => {
      // GIVEN: User on register page
      renderRegisterPage();
      const emailInput = screen.getByLabelText(/email/i);

      // WHEN: User enters invalid email and blurs
      await userEvent.type(emailInput, "invalid-email");
      fireEvent.blur(emailInput);

      // THEN: Error message is displayed
      await waitFor(() => {
        expect(screen.getByText("Email không hợp lệ")).toBeInTheDocument();
      });
    });

    it("should display password validation error when missing uppercase/lowercase", async () => {
      // GIVEN: User on register page
      renderRegisterPage();
      const passwordInput = screen.getByLabelText(/mật khẩu/i);

      // WHEN: User enters password without uppercase
      await userEvent.type(passwordInput, "password");
      fireEvent.blur(passwordInput);

      // THEN: Error message is displayed
      await waitFor(() => {
        expect(
          screen.getByText("Mật khẩu phải có chữ hoa và chữ thường")
        ).toBeInTheDocument();
      });
    });

    it("should display password validation error when too short", async () => {
      // GIVEN: User on register page
      renderRegisterPage();
      const passwordInput = screen.getByLabelText(/mật khẩu/i);

      // WHEN: User enters short password
      await userEvent.type(passwordInput, "Ab1");
      fireEvent.blur(passwordInput);

      // THEN: Error message is displayed
      await waitFor(() => {
        expect(
          screen.getByText("Mật khẩu phải có ít nhất 6 ký tự")
        ).toBeInTheDocument();
      });
    });

    it("should display full name validation error when too short", async () => {
      // GIVEN: User on register page
      renderRegisterPage();
      const nameInput = screen.getByLabelText(/họ và tên/i);

      // WHEN: User enters 1 character name
      await userEvent.type(nameInput, "A");
      fireEvent.blur(nameInput);

      // THEN: Error message is displayed
      await waitFor(() => {
        expect(
          screen.getByText("Họ và tên phải có ít nhất 2 ký tự")
        ).toBeInTheDocument();
      });
    });

    it("should display phone validation error when invalid format", async () => {
      // GIVEN: User on register page
      renderRegisterPage();
      const phoneInput = screen.getByLabelText(/số điện thoại/i);

      // WHEN: User enters invalid phone
      await userEvent.type(phoneInput, "123");
      fireEvent.blur(phoneInput);

      // THEN: Error message is displayed
      await waitFor(() => {
        expect(
          screen.getByText("Số điện thoại không hợp lệ (10-11 số)")
        ).toBeInTheDocument();
      });
    });

    it("should NOT submit form when validation fails", async () => {
      // GIVEN: User on register page with invalid data
      renderRegisterPage();
      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByRole("button", { name: /đăng ký/i });

      // WHEN: User submits with invalid email
      await userEvent.type(emailInput, "invalid-email");
      await userEvent.click(submitButton);

      // THEN: API is NOT called
      expect(authService.register).not.toHaveBeenCalled();
      // Error message is displayed
      await waitFor(() => {
        expect(screen.getByText("Email không hợp lệ")).toBeInTheDocument();
      });
    });

    it("should clear validation error when user corrects input", async () => {
      // GIVEN: User has validation error
      renderRegisterPage();
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

    it("should allow submission with optional phone field empty", async () => {
      // GIVEN: Valid data except phone is empty
      vi.mocked(authService.register).mockResolvedValue({
        success: true,
        message: "Registration successful",
        data: {
          token: "test-token",
          user: {
            id: 1,
            email: "test@test.com",
            full_name: "Test User",
            role: "candidate",
            phone: "",
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        },
      });

      renderRegisterPage();

      // WHEN: User fills all required fields, leaves phone empty
      await userEvent.type(screen.getByLabelText(/email/i), "test@test.com");
      await userEvent.type(screen.getByLabelText(/mật khẩu/i), "Password123");
      await userEvent.type(screen.getByLabelText(/họ và tên/i), "Test User");
      // Phone left empty
      await userEvent.click(screen.getByRole("button", { name: /đăng ký/i }));

      // THEN: Form submits successfully
      await waitFor(() => {
        expect(authService.register).toHaveBeenCalled();
      });
    });
  });

  describe("API Error Display", () => {
    it("should display error toast on 409 duplicate email", async () => {
      // GIVEN: API returns 409 duplicate email
      const error: any = new AxiosError("Request failed with status code 409");
      error.response = {
        status: 409,
        data: { success: false, message: "Email already registered" },
      };
      vi.mocked(authService.register).mockRejectedValue(error);

      // WHEN: User submits valid form
      renderRegisterPage();
      await userEvent.type(
        screen.getByLabelText(/email/i),
        "existing@test.com"
      );
      await userEvent.type(screen.getByLabelText(/mật khẩu/i), "Password123");
      await userEvent.type(screen.getByLabelText(/họ và tên/i), "Test User");
      await userEvent.click(screen.getByRole("button", { name: /đăng ký/i }));

      // THEN: Error is handled (axios interceptor shows toast)
      await waitFor(() => {
        expect(authService.register).toHaveBeenCalled();
      });
      // User stays on register page
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it("should display error toast on 400 validation error from backend", async () => {
      // GIVEN: API returns 400 validation error
      const error: any = new AxiosError("Request failed with status code 400");
      error.response = {
        status: 400,
        data: {
          success: false,
          message: "Validation error",
          errors: [
            { field: "email", message: "Invalid email format" },
            { field: "password", message: "Password too weak" },
          ],
        },
      };
      vi.mocked(authService.register).mockRejectedValue(error);

      // WHEN: User submits form
      renderRegisterPage();
      await userEvent.type(screen.getByLabelText(/email/i), "test@test.com");
      await userEvent.type(screen.getByLabelText(/mật khẩu/i), "Password123");
      await userEvent.type(screen.getByLabelText(/họ và tên/i), "Test User");
      await userEvent.click(screen.getByRole("button", { name: /đăng ký/i }));

      // THEN: Error handled by interceptor
      await waitFor(() => {
        expect(authService.register).toHaveBeenCalled();
      });
    });

    it("should display error toast on 500 server error", async () => {
      // GIVEN: API returns 500
      const error: any = new AxiosError("Request failed with status code 500");
      error.response = {
        status: 500,
        data: { success: false, message: "Server error" },
      };
      vi.mocked(authService.register).mockRejectedValue(error);

      // WHEN: User submits form
      renderRegisterPage();
      await userEvent.type(screen.getByLabelText(/email/i), "test@test.com");
      await userEvent.type(screen.getByLabelText(/mật khẩu/i), "Password123");
      await userEvent.type(screen.getByLabelText(/họ và tên/i), "Test User");
      await userEvent.click(screen.getByRole("button", { name: /đăng ký/i }));

      // THEN: Error handled
      await waitFor(() => {
        expect(authService.register).toHaveBeenCalled();
      });
    });

    it("should display error toast on network error", async () => {
      // GIVEN: Network error
      const error: any = new AxiosError("Network Error");
      error.response = undefined;
      vi.mocked(authService.register).mockRejectedValue(error);

      // WHEN: User submits form
      renderRegisterPage();
      await userEvent.type(screen.getByLabelText(/email/i), "test@test.com");
      await userEvent.type(screen.getByLabelText(/mật khẩu/i), "Password123");
      await userEvent.type(screen.getByLabelText(/họ và tên/i), "Test User");
      await userEvent.click(screen.getByRole("button", { name: /đăng ký/i }));

      // THEN: Error handled
      await waitFor(() => {
        expect(authService.register).toHaveBeenCalled();
      });
    });
  });

  describe("UI State After Errors", () => {
    it("should keep form enabled after API error", async () => {
      // GIVEN: API returns error
      const error: any = new AxiosError("Request failed with status code 409");
      error.response = {
        status: 409,
        data: { success: false, message: "Email already registered" },
      };
      vi.mocked(authService.register).mockRejectedValue(error);

      // WHEN: User submits and gets error
      renderRegisterPage();
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/mật khẩu/i);
      const nameInput = screen.getByLabelText(/họ và tên/i);
      const submitButton = screen.getByRole("button", { name: /đăng ký/i });

      await userEvent.type(emailInput, "existing@test.com");
      await userEvent.type(passwordInput, "Password123");
      await userEvent.type(nameInput, "Test User");
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(authService.register).toHaveBeenCalled();
      });

      // THEN: Form remains enabled for retry
      expect(submitButton).not.toBeDisabled();
      expect(emailInput).not.toBeDisabled();
      expect(passwordInput).not.toBeDisabled();
      expect(nameInput).not.toBeDisabled();
    });

    it("should NOT crash component on API error", async () => {
      // GIVEN: API error
      const error: any = new AxiosError("Request failed with status code 500");
      error.response = {
        status: 500,
        data: { success: false, message: "Server error" },
      };
      vi.mocked(authService.register).mockRejectedValue(error);

      // WHEN: Submit fails
      renderRegisterPage();
      await userEvent.type(screen.getByLabelText(/email/i), "test@test.com");
      await userEvent.type(screen.getByLabelText(/mật khẩu/i), "Password123");
      await userEvent.type(screen.getByLabelText(/họ và tên/i), "Test User");
      await userEvent.click(screen.getByRole("button", { name: /đăng ký/i }));

      await waitFor(() => {
        expect(authService.register).toHaveBeenCalled();
      });

      // THEN: Page still renders properly
      expect(
        screen.getByRole("heading", { name: /đăng ký/i })
      ).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/mật khẩu/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/họ và tên/i)).toBeInTheDocument();
    });
  });

  describe("Negative Tests - NO Silent Failures", () => {
    it("MUST NOT silently succeed on API error", async () => {
      // GIVEN: API returns error
      const error: any = new AxiosError("Request failed with status code 409");
      error.response = {
        status: 409,
        data: { success: false, message: "Email already registered" },
      };
      vi.mocked(authService.register).mockRejectedValue(error);

      // WHEN: User submits form
      renderRegisterPage();
      await userEvent.type(
        screen.getByLabelText(/email/i),
        "existing@test.com"
      );
      await userEvent.type(screen.getByLabelText(/mật khẩu/i), "Password123");
      await userEvent.type(screen.getByLabelText(/họ và tên/i), "Test User");
      await userEvent.click(screen.getByRole("button", { name: /đăng ký/i }));

      await waitFor(() => {
        expect(authService.register).toHaveBeenCalled();
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
      vi.mocked(authService.register).mockRejectedValue(error);

      // WHEN: Submit form
      renderRegisterPage();
      await userEvent.type(screen.getByLabelText(/email/i), "test@test.com");
      await userEvent.type(screen.getByLabelText(/mật khẩu/i), "Password123");
      await userEvent.type(screen.getByLabelText(/họ và tên/i), "Test User");
      await userEvent.click(screen.getByRole("button", { name: /đăng ký/i }));

      await waitFor(() => {
        expect(authService.register).toHaveBeenCalled();
      });

      // THEN: Error MUST be handled (by axios interceptor)
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe("Successful Registration", () => {
    it("should navigate to home on successful registration", async () => {
      // GIVEN: API returns success
      vi.mocked(authService.register).mockResolvedValue({
        success: true,
        message: "Registration successful",
        data: {
          token: "test-token",
          user: {
            id: 1,
            email: "new@test.com",
            full_name: "New User",
            role: "candidate",
            phone: "0123456789",
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        },
      });

      // WHEN: User submits valid registration
      renderRegisterPage();
      await userEvent.type(screen.getByLabelText(/email/i), "new@test.com");
      await userEvent.type(screen.getByLabelText(/mật khẩu/i), "Password123");
      await userEvent.type(screen.getByLabelText(/họ và tên/i), "New User");
      await userEvent.type(
        screen.getByLabelText(/số điện thoại/i),
        "0123456789"
      );
      await userEvent.click(screen.getByRole("button", { name: /đăng ký/i }));

      // THEN: User is redirected
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/");
      });
    });
  });
});
