import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { AuthProvider, useAuth } from "./AuthContext";
import { authService } from "../services/authService";
import type { ReactNode } from "react";

// Mock services
vi.mock("../services/authService", () => ({
  authService: {
    login: vi.fn(),
    register: vi.fn(),
    getProfile: vi.fn(),
    updateProfile: vi.fn(),
  },
}));

// Mock react-hot-toast
vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("AuthContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    // Spy on localStorage methods
    vi.spyOn(Storage.prototype, "setItem");
    vi.spyOn(Storage.prototype, "getItem");
    vi.spyOn(Storage.prototype, "removeItem");
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  it("should initialize with null user when no token exists", () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it("should login successfully and set user", async () => {
    const mockUser = {
      id: 1,
      email: "test@example.com",
      role: "candidate" as const,
      full_name: "Test User",
      is_active: true,
      created_at: "2024-01-01",
      updated_at: "2024-01-01",
    };

    const mockResponse = {
      success: true,
      message: "Login successful",
      data: {
        user: mockUser,
        token: "mock-token-123",
      },
    };

    vi.mocked(authService.login).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login("test@example.com", "password123");
    });

    expect(result.current.user).toEqual(mockUser);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "token",
      "mock-token-123"
    );
  });

  it("should logout and clear user state", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(localStorage.removeItem).toHaveBeenCalledWith("token");
  });

  it("should load user from token on mount", async () => {
    const mockUser = {
      id: 1,
      email: "test@example.com",
      role: "candidate" as const,
      full_name: "Test User",
      is_active: true,
      created_at: "2024-01-01",
      updated_at: "2024-01-01",
    };

    localStorage.setItem("token", "existing-token");

    vi.mocked(authService.getProfile).mockResolvedValue({
      success: true,
      message: "Profile fetched",
      data: { user: mockUser },
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser);
    });

    expect(authService.getProfile).toHaveBeenCalled();
  });

  it("should handle login error", async () => {
    vi.mocked(authService.login).mockRejectedValue(
      new Error("Invalid credentials")
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await expect(
      result.current.login("wrong@example.com", "wrongpass")
    ).rejects.toThrow("Invalid credentials");

    expect(result.current.user).toBeNull();
  });

  it("should register successfully", async () => {
    const mockUser = {
      id: 1,
      email: "newuser@example.com",
      role: "candidate" as const,
      full_name: "New User",
      is_active: true,
      created_at: "2024-01-01",
      updated_at: "2024-01-01",
    };

    vi.mocked(authService.register).mockResolvedValue({
      success: true,
      message: "Registration successful",
      data: {
        user: mockUser,
        token: "new-token-123",
      },
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.register({
        email: "newuser@example.com",
        password: "password123",
        full_name: "New User",
        role: "candidate",
      });
    });

    expect(result.current.user).toEqual(mockUser);
    expect(localStorage.setItem).toHaveBeenCalledWith("token", "new-token-123");
  });

  it("should update profile successfully", async () => {
    const initialUser = {
      id: 1,
      email: "test@example.com",
      role: "candidate" as const,
      full_name: "Test User",
      is_active: true,
      created_at: "2024-01-01",
      updated_at: "2024-01-01",
    };

    const updatedUser = {
      ...initialUser,
      full_name: "Updated Name",
      phone: "0123456789",
    };

    vi.mocked(authService.login).mockResolvedValue({
      success: true,
      message: "Login successful",
      data: { user: initialUser, token: "token-123" },
    });

    vi.mocked(authService.updateProfile).mockResolvedValue({
      success: true,
      message: "Profile updated",
      data: { user: updatedUser },
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login(initialUser.email, "password123");
    });

    await act(async () => {
      await result.current.updateProfile({
        full_name: "Updated Name",
        phone: "0123456789",
      });
    });

    expect(result.current.user?.full_name).toBe("Updated Name");
  });
});
