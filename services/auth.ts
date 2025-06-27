import { User, UserRole, SubscriptionPlan } from "@/types";
import { httpClient } from "./httpClient";
import { tokenManager } from "./tokenManager";
import AuthApiService from "./api/authApi";
import { Logger } from "@/utils/production";

export class AuthService {
  static async setUser(user: User): Promise<void> {
    try {
      await tokenManager.setUserData({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        permissions: [], // Add permissions based on role
        preferences: {
          language: user.language,
          subscription: user.subscription,
        },
      });
    } catch (error) {
      console.error("Error saving user data:", error);
      throw new Error("Failed to save user data");
    }
  }

  static async getUser(): Promise<User | null> {
    try {
      const userData = await tokenManager.getUserData();
      if (!userData) return null;

      // Convert back to User format
      return {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role as UserRole,
        language: userData.preferences?.language || "en",
        subscription: userData.preferences?.subscription || {
          type: "monthly",
          price: 299,
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          isActive: true,
        },
        isVerified: false,
        phone: "",
        documents: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User;
    } catch (error) {
      console.error("Error retrieving user data:", error);
      return null;
    }
  }

  static async setAuthToken(
    token: string,
    refreshToken?: string,
  ): Promise<void> {
    try {
      // Use token manager for all token operations
      if (refreshToken) {
        await tokenManager.setTokens({
          accessToken: token,
          refreshToken,
          expiresIn: 3600, // Default 1 hour
        });
      } else {
        // If only access token provided, get existing refresh token
        const existingRefreshToken = await tokenManager.getRefreshToken();
        await tokenManager.setTokens({
          accessToken: token,
          refreshToken: existingRefreshToken || "",
          expiresIn: 3600,
        });
      }

      Logger.debug("Auth tokens updated successfully");
    } catch (error) {
      Logger.error("Error saving auth token:", error);
      throw new Error("Failed to save auth token");
    }
  }

  static async getAuthToken(): Promise<string | null> {
    try {
      return await tokenManager.getAccessToken();
    } catch (error) {
      Logger.error("Error retrieving auth token:", error);
      return null;
    }
  }

  static async isAuthenticated(): Promise<boolean> {
    return await tokenManager.isAuthenticated();
  }

  static async logout(): Promise<void> {
    try {
      // Call API logout endpoint
      await AuthApiService.logout();

      // Clear all tokens using enhanced token manager
      await tokenManager.clearTokens();

      Logger.debug("Logout completed successfully");
    } catch (error) {
      Logger.error("Error during logout:", error);

      // Even if API call fails, clear local data
      await tokenManager.forceLogout();

      throw new Error("Failed to logout");
    }
  }

  static async updateUser(updates: Partial<User>): Promise<void> {
    const currentUser = await this.getUser();
    if (!currentUser) {
      throw new Error("No user found");
    }

    const updatedUser = { ...currentUser, ...updates };
    await this.setUser(updatedUser);
  }

  // Mock authentication methods for demo
  static async sendPhoneOTP(
    phone: string,
  ): Promise<{ success: boolean; message: string }> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { success: true, message: "OTP sent successfully" };
  }

  static async verifyPhoneOTP(
    phone: string,
    otp: string,
  ): Promise<{ success: boolean; message: string }> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // For demo, accept 123456 as valid OTP
    if (otp === "123456") {
      return { success: true, message: "Phone verified successfully" };
    }
    return { success: false, message: "Invalid OTP" };
  }

  static async sendEmailOTP(
    email: string,
  ): Promise<{ success: boolean; message: string }> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { success: true, message: "OTP sent to email" };
  }

  static async verifyEmailOTP(
    email: string,
    otp: string,
  ): Promise<{ success: boolean; message: string }> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // For demo, accept 123456 as valid OTP
    if (otp === "123456") {
      return { success: true, message: "Email verified successfully" };
    }
    return { success: false, message: "Invalid OTP" };
  }

  static async createUser(userData: {
    email: string;
    phone: string;
    role: UserRole;
    name: string;
    language: string;
    subscription: SubscriptionPlan;
    barCouncilId?: string;
  }): Promise<User> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const user: User = {
      id: Date.now().toString(),
      ...userData,
      isVerified: false,
      documents: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.setUser(user);
    await this.setAuthToken("demo_token_" + user.id);

    return user;
  }
}
