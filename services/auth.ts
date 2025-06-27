import AsyncStorage from "@react-native-async-storage/async-storage";
import { User, UserRole, SubscriptionPlan } from "@/types";
import { httpClient } from "./httpClient";
import AuthApiService from "./api/authApi";
import { Logger } from "@/utils/production";

export class AuthService {
  private static readonly USER_KEY = "user_data";
  private static readonly AUTH_TOKEN_KEY = "auth_token";

  static async setUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(this.USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error("Error saving user data:", error);
      throw new Error("Failed to save user data");
    }
  }

  static async getUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem(this.USER_KEY);
      return userData ? JSON.parse(userData) : null;
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
      await AsyncStorage.setItem(this.AUTH_TOKEN_KEY, token);

      // Also update HTTP client tokens
      if (refreshToken) {
        await httpClient.setAuthTokens(token, refreshToken);
      }

      Logger.debug("Auth tokens updated successfully");
    } catch (error) {
      Logger.error("Error saving auth token:", error);
      throw new Error("Failed to save auth token");
    }
  }

  static async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(this.AUTH_TOKEN_KEY);
    } catch (error) {
      Logger.error("Error retrieving auth token:", error);
      return null;
    }
  }

  static async isAuthenticated(): Promise<boolean> {
    // Use HTTP client's authentication check which includes token expiry
    return await httpClient.isAuthenticated();
  }

  static async logout(): Promise<void> {
    try {
      // Call API logout endpoint
      await AuthApiService.logout();

      // Clear all local storage
      await AsyncStorage.multiRemove([this.USER_KEY, this.AUTH_TOKEN_KEY]);

      // Clear HTTP client tokens
      await httpClient.clearAuthTokens();

      Logger.debug("Logout completed successfully");
    } catch (error) {
      Logger.error("Error during logout:", error);

      // Even if API call fails, clear local data
      await AsyncStorage.multiRemove([this.USER_KEY, this.AUTH_TOKEN_KEY]);
      await httpClient.clearAuthTokens();

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
