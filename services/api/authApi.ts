import { httpClient, ApiResponse } from "@/services/httpClient";
import { Config } from "@/config/env";
import { User, UserRole, LoginCredentials } from "@/types";
import { Logger } from "@/utils/production";

// Auth API types
export interface LoginRequest {
  email: string;
  password: string;
  deviceId?: string;
  pushToken?: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  language?: string;
  termsAccepted: boolean;
}

export interface OTPRequest {
  phone: string;
  email?: string;
  type: "sms" | "email" | "voice";
}

export interface OTPVerifyRequest {
  phone?: string;
  email?: string;
  otp: string;
  type: "sms" | "email" | "voice";
}

export interface ResetPasswordRequest {
  email: string;
  newPassword: string;
  confirmPassword: string;
  resetToken: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  language?: string;
  profileImage?: string;
  bio?: string;
  specializations?: string[];
  experience?: number;
  barCouncilId?: string;
}

// Mock data for development
const MOCK_USERS: User[] = [
  {
    id: "demo_lawyer_001",
    email: "lawyer@yrjr.app",
    phone: "+91 9876543210",
    role: "lawyer",
    name: "Advocate Rajesh Kumar",
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
    bio: "Senior Criminal Lawyer with 15+ years experience",
    specializations: ["Criminal Law", "Constitutional Law"],
    experience: 15,
    barCouncilId: "DL/2024/123456",
  },
  // Add other demo users...
];

// Mock delay utility
const mockDelay = (ms: number = Config.MOCK_API_DELAY) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Auth API service
export class AuthApiService {
  // Login
  static async login(
    credentials: LoginRequest,
  ): Promise<ApiResponse<LoginResponse>> {
    if (Config.ENABLE_API_MOCKS) {
      await mockDelay();

      // Mock login logic
      const user = MOCK_USERS.find((u) => u.email === credentials.email);
      if (!user || credentials.password !== "demo123") {
        throw {
          success: false,
          message: "Invalid email or password",
          statusCode: 401,
        };
      }

      const mockResponse: LoginResponse = {
        user,
        accessToken: `mock_access_token_${Date.now()}`,
        refreshToken: `mock_refresh_token_${Date.now()}`,
        expiresIn: 3600, // 1 hour
      };

      Logger.debug("Mock login successful:", {
        user: user.email,
        role: user.role,
      });

      return {
        success: true,
        data: mockResponse,
        message: "Login successful",
      };
    }

    return httpClient.post<LoginResponse>("/auth/login", credentials);
  }

  // Register
  static async register(
    userData: RegisterRequest,
  ): Promise<ApiResponse<LoginResponse>> {
    if (Config.ENABLE_API_MOCKS) {
      await mockDelay();

      // Mock registration logic
      const newUser: User = {
        id: `user_${Date.now()}`,
        email: userData.email,
        phone: userData.phone,
        role: userData.role,
        name: userData.name,
        isVerified: false,
        subscription: {
          type: "monthly",
          price: 299,
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          isActive: true,
        },
        language: userData.language || "en",
        documents: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockResponse: LoginResponse = {
        user: newUser,
        accessToken: `mock_access_token_${Date.now()}`,
        refreshToken: `mock_refresh_token_${Date.now()}`,
        expiresIn: 3600,
      };

      return {
        success: true,
        data: mockResponse,
        message: "Registration successful",
      };
    }

    return httpClient.post<LoginResponse>("/auth/register", userData);
  }

  // Send OTP
  static async sendOTP(
    otpData: OTPRequest,
  ): Promise<ApiResponse<{ otpId: string; expiresIn: number }>> {
    if (Config.ENABLE_API_MOCKS) {
      await mockDelay(2000); // Longer delay for OTP

      return {
        success: true,
        data: {
          otpId: `otp_${Date.now()}`,
          expiresIn: 300, // 5 minutes
        },
        message: `OTP sent to ${otpData.phone || otpData.email}`,
      };
    }

    return httpClient.post("/auth/send-otp", otpData);
  }

  // Verify OTP
  static async verifyOTP(
    verifyData: OTPVerifyRequest,
  ): Promise<ApiResponse<{ verified: boolean; token?: string }>> {
    if (Config.ENABLE_API_MOCKS) {
      await mockDelay(1500);

      // Mock OTP verification (accept any 4-6 digit number)
      const isValidOTP = /^\d{4,6}$/.test(verifyData.otp);

      return {
        success: true,
        data: {
          verified: isValidOTP,
          token: isValidOTP ? `verify_token_${Date.now()}` : undefined,
        },
        message: isValidOTP ? "OTP verified successfully" : "Invalid OTP",
      };
    }

    return httpClient.post("/auth/verify-otp", verifyData);
  }

  // Logout
  static async logout(): Promise<ApiResponse<{}>> {
    if (Config.ENABLE_API_MOCKS) {
      await mockDelay(500);

      return {
        success: true,
        data: {},
        message: "Logged out successfully",
      };
    }

    return httpClient.post("/auth/logout");
  }

  // Refresh token
  static async refreshToken(
    refreshToken: string,
  ): Promise<ApiResponse<{ accessToken: string; expiresIn: number }>> {
    if (Config.ENABLE_API_MOCKS) {
      await mockDelay();

      return {
        success: true,
        data: {
          accessToken: `mock_access_token_refreshed_${Date.now()}`,
          expiresIn: 3600,
        },
        message: "Token refreshed successfully",
      };
    }

    return httpClient.post("/auth/refresh", { refreshToken });
  }

  // Get current user profile
  static async getProfile(): Promise<ApiResponse<User>> {
    if (Config.ENABLE_API_MOCKS) {
      await mockDelay();

      // Return first mock user for demo
      return {
        success: true,
        data: MOCK_USERS[0],
        message: "Profile fetched successfully",
      };
    }

    return httpClient.get<User>("/auth/profile");
  }

  // Update profile
  static async updateProfile(
    profileData: UpdateProfileRequest,
  ): Promise<ApiResponse<User>> {
    if (Config.ENABLE_API_MOCKS) {
      await mockDelay();

      const updatedUser = {
        ...MOCK_USERS[0],
        ...profileData,
        updatedAt: new Date(),
      };

      return {
        success: true,
        data: updatedUser,
        message: "Profile updated successfully",
      };
    }

    return httpClient.put<User>("/auth/profile", profileData);
  }

  // Change password
  static async changePassword(
    passwordData: ChangePasswordRequest,
  ): Promise<ApiResponse<{}>> {
    if (Config.ENABLE_API_MOCKS) {
      await mockDelay();

      // Mock password validation
      if (passwordData.currentPassword !== "demo123") {
        throw {
          success: false,
          message: "Current password is incorrect",
          statusCode: 400,
        };
      }

      return {
        success: true,
        data: {},
        message: "Password changed successfully",
      };
    }

    return httpClient.put("/auth/change-password", passwordData);
  }

  // Forgot password
  static async forgotPassword(
    email: string,
  ): Promise<ApiResponse<{ resetToken: string }>> {
    if (Config.ENABLE_API_MOCKS) {
      await mockDelay(2000);

      return {
        success: true,
        data: {
          resetToken: `reset_token_${Date.now()}`,
        },
        message: "Password reset email sent",
      };
    }

    return httpClient.post("/auth/forgot-password", { email });
  }

  // Reset password
  static async resetPassword(
    resetData: ResetPasswordRequest,
  ): Promise<ApiResponse<{}>> {
    if (Config.ENABLE_API_MOCKS) {
      await mockDelay();

      return {
        success: true,
        data: {},
        message: "Password reset successfully",
      };
    }

    return httpClient.post("/auth/reset-password", resetData);
  }

  // Verify email
  static async verifyEmail(token: string): Promise<ApiResponse<{}>> {
    if (Config.ENABLE_API_MOCKS) {
      await mockDelay();

      return {
        success: true,
        data: {},
        message: "Email verified successfully",
      };
    }

    return httpClient.post("/auth/verify-email", { token });
  }

  // Resend verification email
  static async resendVerificationEmail(): Promise<ApiResponse<{}>> {
    if (Config.ENABLE_API_MOCKS) {
      await mockDelay();

      return {
        success: true,
        data: {},
        message: "Verification email sent",
      };
    }

    return httpClient.post("/auth/resend-verification");
  }

  // Delete account
  static async deleteAccount(password: string): Promise<ApiResponse<{}>> {
    if (Config.ENABLE_API_MOCKS) {
      await mockDelay(2000);

      return {
        success: true,
        data: {},
        message: "Account deleted successfully",
      };
    }

    return httpClient.delete("/auth/account", { data: { password } });
  }

  // Check email availability
  static async checkEmailAvailability(
    email: string,
  ): Promise<ApiResponse<{ available: boolean }>> {
    if (Config.ENABLE_API_MOCKS) {
      await mockDelay(500);

      const isAvailable = !MOCK_USERS.some((user) => user.email === email);

      return {
        success: true,
        data: {
          available: isAvailable,
        },
        message: isAvailable ? "Email is available" : "Email is already taken",
      };
    }

    return httpClient.get(
      `/auth/check-email?email=${encodeURIComponent(email)}`,
    );
  }

  // Update push token
  static async updatePushToken(
    pushToken: string,
    deviceId: string,
  ): Promise<ApiResponse<{}>> {
    if (Config.ENABLE_API_MOCKS) {
      await mockDelay();

      return {
        success: true,
        data: {},
        message: "Push token updated successfully",
      };
    }

    return httpClient.put("/auth/push-token", { pushToken, deviceId });
  }
}

export default AuthApiService;
