import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "../../contexts/AuthContext";
import { authService } from "../../services/authService";
import { AxiosError } from "axios";

// Mock authService
vi.mock("../../services/authService", () => ({
  authService: {
    login: vi.fn(),
    register: vi.fn(),
    getProfile: vi.fn(),
    updateProfile: vi.fn(),
  },
}));

describe("AuthContext - Error Handling", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe("Login Error Handling", () => {
    it("should handle 401 invalid credentials error", async () => {
      // GIVEN: Invalid credentials
      const error: any = new AxiosError("Request failed with status code 401");
      error.response = {
        status: 401,
        data: {
          success: false,
          message: "Invalid email or password",
        },
      };
      vi.mocked(authService.login).mockRejectedValue(error);

      // WHEN: User attempts to login
      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let loginError;
      await act(async () => {
        try {
          await result.current.login("wrong@email.com", "wrongpassword");
        } catch (err) {
          loginError = err;
        }
      });

      // THEN: Error is thrown (handled by axios interceptor)
      expect(loginError).toBeDefined();
      expect(authService.login).toHaveBeenCalledWith({
        email: "wrong@email.com",
        password: "wrongpassword",
      });
      // User state should not be set
      expect(result.current.user).toBeNull();
      // Token should not be stored
      expect(localStorage.getItem("token")).toBeNull();
    });

    it("should handle 403 inactive account error", async () => {
      // GIVEN: Account is inactive
      const error: any = new AxiosError("Request failed with status code 403");
      error.response = {
        status: 403,
        data: {
          success: false,
          message: "Account is inactive",
        },
      };
      vi.mocked(authService.login).mockRejectedValue(error);

      // WHEN: User attempts to login
      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let loginError;
      await act(async () => {
        try {
          await result.current.login("inactive@test.com", "password123");
        } catch (err) {
          loginError = err;
        }
      });

      // THEN: Error is thrown
      expect(loginError).toBeDefined();
      expect(result.current.user).toBeNull();
      expect(localStorage.getItem("token")).toBeNull();
    });

    it("should NOT crash component on login error", async () => {
      // GIVEN: API error
      const error: any = new AxiosError("Request failed with status code 500");
      error.response = {
        status: 500,
        data: { success: false, message: "Server error" },
      };
      vi.mocked(authService.login).mockRejectedValue(error);

      // WHEN: Login fails
      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        try {
          await result.current.login("test@test.com", "password");
        } catch (err) {
          // Expected error
        }
      });

      // THEN: Context still functional
      expect(result.current.user).toBeNull();
      expect(result.current.loading).toBe(false);
      expect(result.current.login).toBeDefined();
      expect(result.current.logout).toBeDefined();
    });
  });

  describe("Register Error Handling", () => {
    it("should handle 409 duplicate email error", async () => {
      // GIVEN: Email already exists
      const error: any = new AxiosError("Request failed with status code 409");
      error.response = {
        status: 409,
        data: {
          success: false,
          message: "Email already registered",
        },
      };
      vi.mocked(authService.register).mockRejectedValue(error);

      // WHEN: User tries to register with existing email
      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let registerError;
      await act(async () => {
        try {
          await result.current.register({
            email: "existing@test.com",
            password: "password123",
            full_name: "Test User",
            role: "candidate",
          });
        } catch (err) {
          registerError = err;
        }
      });

      // THEN: Error is thrown and handled
      expect(registerError).toBeDefined();
      expect(authService.register).toHaveBeenCalled();
      expect(result.current.user).toBeNull();
      expect(localStorage.getItem("token")).toBeNull();
    });

    it("should handle 400 validation error", async () => {
      // GIVEN: Invalid data
      const error: any = new AxiosError("Request failed with status code 400");
      error.response = {
        status: 400,
        data: {
          success: false,
          message: "Validation error",
          errors: [
            { field: "email", message: "Invalid email format" },
            { field: "password", message: "Password too short" },
          ],
        },
      };
      vi.mocked(authService.register).mockRejectedValue(error);

      // WHEN: Register with invalid data
      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let registerError;
      await act(async () => {
        try {
          await result.current.register({
            email: "invalid-email",
            password: "123",
            full_name: "A",
            role: "candidate",
          });
        } catch (err) {
          registerError = err;
        }
      });

      // THEN: Error is thrown
      expect(registerError).toBeDefined();
      expect(result.current.user).toBeNull();
    });
  });

  describe("Network Error Handling", () => {
    it("should handle network error (no response)", async () => {
      // GIVEN: Network is down
      const error: any = new AxiosError("Network Error");
      error.response = undefined; // No response means network error
      vi.mocked(authService.login).mockRejectedValue(error);

      // WHEN: Login attempt with no network
      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let loginError;
      await act(async () => {
        try {
          await result.current.login("test@test.com", "password");
        } catch (err) {
          loginError = err;
        }
      });

      // THEN: Error is thrown, app doesn't crash
      expect(loginError).toBeDefined();
      expect(result.current.user).toBeNull();
      expect(result.current.loading).toBe(false);
    });
  });

  describe("Token Expiration Handling", () => {
    it("should clear token and user on 401 during profile load", async () => {
      // GIVEN: Token exists but is expired
      // Clear cached user to force API call
      localStorage.removeItem("user");
      localStorage.setItem("token", "expired-token");

      const error: any = new AxiosError("Request failed with status code 401");
      error.response = {
        status: 401,
        data: { success: false, message: "Token expired" },
      };
      vi.mocked(authService.getProfile).mockRejectedValue(error);

      // WHEN: AuthProvider loads and calls getProfile
      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      // Wait for loadUser to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // THEN: Token and user are cleared
      expect(result.current.user).toBeNull();
      expect(localStorage.getItem("token")).toBeNull();
      expect(localStorage.getItem("user")).toBeNull();
    });

    it("should NOT clear token on non-auth errors during profile load", async () => {
      // GIVEN: Token exists, but server returns 500
      localStorage.setItem("token", "valid-token");
      // Don't set cached user - this forces API call
      localStorage.removeItem("user");

      const error: any = new AxiosError("Request failed with status code 500");
      error.response = {
        status: 500,
        data: { success: false, message: "Server error" },
      };
      vi.mocked(authService.getProfile).mockRejectedValue(error);

      // WHEN: AuthProvider loads and calls getProfile
      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      // Wait for loadUser to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // THEN: Token should NOT be cleared (not an auth error)
      expect(localStorage.getItem("token")).toBe("valid-token");
      // But user state is null because profile fetch failed
      expect(result.current.user).toBeNull();
    });
  });

  describe("Negative Tests - Silent Failures", () => {
    it("MUST throw error on login failure (no silent success)", async () => {
      // GIVEN: API returns error
      const error: any = new AxiosError("Request failed with status code 401");
      error.response = {
        status: 401,
        data: { success: false, message: "Invalid credentials" },
      };
      vi.mocked(authService.login).mockRejectedValue(error);

      // WHEN: Login is called
      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // THEN: Must throw error (NOT silent failure)
      await expect(async () => {
        await act(async () => {
          await result.current.login("test@test.com", "wrong");
        });
      }).rejects.toThrow();
    });

    it("MUST throw error on register failure (no silent success)", async () => {
      // GIVEN: API returns error
      const error: any = new AxiosError("Request failed with status code 409");
      error.response = {
        status: 409,
        data: { success: false, message: "Email already registered" },
      };
      vi.mocked(authService.register).mockRejectedValue(error);

      // WHEN: Register is called
      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // THEN: Must throw error
      await expect(async () => {
        await act(async () => {
          await result.current.register({
            email: "test@test.com",
            password: "password",
            full_name: "Test",
            role: "candidate",
          });
        });
      }).rejects.toThrow();
    });
  });
});
