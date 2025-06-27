import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { AuthState, User, UserRole } from "@/types/auth";
import { DEMO_ACCOUNTS } from "@/constants/auth";
import { storage } from "@/services/storage";

interface AuthContextType extends AuthState {
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; message: string }>;
  loginWithDemo: (
    role: UserRole,
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const mountedRef = useRef(true);

  useEffect(() => {
    checkAuthStatus();
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const checkAuthStatus = async () => {
    try {
      const userData = await storage.getUser();
      const token = await storage.getToken();

      if (mountedRef.current) {
        setAuthState({
          user: userData,
          isAuthenticated: !!(userData && token),
          isLoading: false,
        });
      }
    } catch (error) {
      console.error("Auth check error:", error);
      if (mountedRef.current) {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    }
  };

  const login = async (
    email: string,
    password: string,
  ): Promise<{ success: boolean; message: string }> => {
    try {
      if (mountedRef.current) {
        setAuthState((prev) => ({ ...prev, isLoading: true }));
      }

      // Check demo accounts
      const demoAccount = DEMO_ACCOUNTS.find(
        (account) => account.email === email && account.password === password,
      );

      if (!demoAccount) {
        if (mountedRef.current) {
          setAuthState((prev) => ({ ...prev, isLoading: false }));
        }
        return { success: false, message: "Invalid email or password" };
      }

      // Create user object
      const user: User = {
        id: `demo_${demoAccount.role}_${Date.now()}`,
        email: demoAccount.email,
        name: demoAccount.name,
        role: demoAccount.role,
        isVerified: true,
        createdAt: new Date(),
      };

      // Save to storage
      await storage.setUser(user);
      await storage.setToken(`demo_token_${user.id}`);

      if (mountedRef.current) {
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      }

      return { success: true, message: "Login successful" };
    } catch (error) {
      console.error("Login error:", error);
      if (mountedRef.current) {
        setAuthState((prev) => ({ ...prev, isLoading: false }));
      }
      return { success: false, message: "Login failed. Please try again." };
    }
  };

  const loginWithDemo = async (
    role: UserRole,
  ): Promise<{ success: boolean; message: string }> => {
    const demoAccount = DEMO_ACCOUNTS.find((account) => account.role === role);
    if (!demoAccount) {
      return { success: false, message: "Demo account not found" };
    }
    return login(demoAccount.email, demoAccount.password);
  };

  const logout = async (): Promise<void> => {
    try {
      await storage.clearAuth();
      if (mountedRef.current) {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  const value: AuthContextType = {
    ...authState,
    login,
    loginWithDemo,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
