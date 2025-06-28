import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { Platform } from "react-native";
import { User } from "@/types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);

  // Lazy load auth service
  const getAuthService = async () => {
    const { authService } = await import("@/services/auth");
    return authService;
  };

  useEffect(() => {
    loadUser();
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const loadUser = async () => {
    try {
      const authService = await getAuthService();
      const currentUser = await authService.getCurrentUser();

      if (mountedRef.current) {
        setUser(currentUser);
      }
    } catch (error) {
      console.error("Error loading user:", error);
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const authService = await getAuthService();
      const result = await authService.login(email, password);

      if (result.success && result.user && mountedRef.current) {
        setUser(result.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const authService = await getAuthService();
      await authService.logout();

      if (mountedRef.current) {
        setUser(null);
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const updateUser = async (updates: Partial<User>): Promise<boolean> => {
    try {
      if (!user) return false;

      const authService = await getAuthService();
      const success = await authService.updateUser({ ...user, ...updates });

      if (success && mountedRef.current) {
        setUser((prev) => (prev ? { ...prev, ...updates } : null));
      }

      return success;
    } catch (error) {
      console.error("Update user error:", error);
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
