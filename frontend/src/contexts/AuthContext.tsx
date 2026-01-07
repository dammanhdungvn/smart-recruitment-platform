import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { User } from "../types/user.types";
import { authService } from "../services/authService";
import toast from "react-hot-toast";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: any) => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(() => {
    // Initialize from localStorage cache
    const cachedUser = localStorage.getItem("user");
    return cachedUser ? JSON.parse(cachedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await authService.getProfile();
      const userData = response.data.user;
      setUser(userData);
      // Cache user data
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (error: any) {
      // Clear on auth errors (401) or not found (404)
      if (error?.response?.status === 401 || error?.response?.status === 404) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Only fetch if no cached user or has token
    const token = localStorage.getItem("token");
    const cachedUser = localStorage.getItem("user");

    if (token && !cachedUser) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, [loadUser]);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      const { token, user: userData } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      toast.success("Đăng nhập thành công!");
    } catch (error: any) {
      // Error already handled by axios interceptor
      throw error;
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    toast.success("Đã đăng xuất");
  }, []);

  const register = async (data: any) => {
    try {
      const response = await authService.register(data);
      const { token, user: userData } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      toast.success("Đăng ký thành công!");
    } catch (error: any) {
      // Error already handled by axios interceptor
      throw error;
    }
  };

  const updateProfile = async (data: any) => {
    try {
      const response = await authService.updateProfile(data);
      const userData = response.data.user;
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      toast.success("Cập nhật thông tin thành công!");
    } catch (error: any) {
      // Error already handled by axios interceptor
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, register, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
