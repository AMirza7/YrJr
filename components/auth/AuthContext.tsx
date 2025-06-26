import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { AuthState, User, UserRole, LoginCredentials } from "@/types";
import { AuthService } from "@/services/auth";
import { DEMO_ACCOUNTS } from "@/constants/AuthConstants";

interface AuthContextType extends AuthState {
  login: (
    credentials: LoginCredentials,
  ) => Promise<{ success: boolean; message: string }>;
  loginWithDemo: (
    role: UserRole,
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  checkPermission: (
    permission: keyof import("@/types").RolePermissions,
  ) => boolean;
  hasFeatureAccess: (featureId: string) => boolean;
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
      const isAuthenticated = await AuthService.isAuthenticated();

      if (!mountedRef.current) return;

      if (isAuthenticated) {
        const user = await AuthService.getUser();
        if (mountedRef.current) {
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        }
      } else {
        if (mountedRef.current) {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
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
    credentials: LoginCredentials,
  ): Promise<{ success: boolean; message: string }> => {
    try {
      if (mountedRef.current) {
        setAuthState((prev) => ({ ...prev, isLoading: true }));
      }

      // Check if credentials match any demo account
      const demoAccount = DEMO_ACCOUNTS.find(
        (account) =>
          account.email === credentials.email &&
          account.password === credentials.password,
      );

      if (!demoAccount) {
        if (mountedRef.current) {
          setAuthState((prev) => ({ ...prev, isLoading: false }));
        }
        return { success: false, message: "Invalid email or password" };
      }

      // Create user object for demo account
      const user: User = {
        id: `demo_${demoAccount.role}_${Date.now()}`,
        email: demoAccount.email,
        phone: "+91 9876543210",
        role: demoAccount.role,
        name: demoAccount.name,
        isVerified: true,
        subscription: {
          type: "yearly",
          price: 2999,
          startDate: new Date(),
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          isActive: true,
        },
        language: "en",
        documents: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Save user and token
      await AuthService.setUser(user);
      await AuthService.setAuthToken(`demo_token_${user.id}`);

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

    return login({
      email: demoAccount.email,
      password: demoAccount.password,
    });
  };

  const logout = async (): Promise<void> => {
    try {
      await AuthService.logout();
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

  const updateUser = async (updates: Partial<User>): Promise<void> => {
    try {
      if (!authState.user) {
        throw new Error("No user logged in");
      }

      const updatedUser = { ...authState.user, ...updates };
      await AuthService.updateUser(updates);

      if (mountedRef.current) {
        setAuthState((prev) => ({
          ...prev,
          user: updatedUser,
        }));
      }
    } catch (error) {
      console.error("Update user error:", error);
      throw error;
    }
  };

  const checkPermission = (
    permission: keyof import("@/types").RolePermissions,
  ): boolean => {
    if (!authState.user) return false;

    const { ROLE_PERMISSIONS } = require("@/constants/AuthConstants");
    const userPermissions = ROLE_PERMISSIONS[authState.user.role];
    return userPermissions[permission];
  };

  const hasFeatureAccess = (featureId: string): boolean => {
    if (!authState.user) return false;

    const { ROLE_FEATURES } = require("@/constants/AuthConstants");
    const userFeatures = ROLE_FEATURES[authState.user.role];
    return userFeatures.includes(featureId);
  };

  const value: AuthContextType = {
    ...authState,
    login,
    loginWithDemo,
    logout,
    updateUser,
    checkPermission,
    hasFeatureAccess,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
