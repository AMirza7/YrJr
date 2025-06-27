/**
 * Enhanced Token Manager
 * Handles authentication tokens with automatic refresh, logout on 401,
 * and secure storage management
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Config } from "@/config/env";
import { Logger } from "@/utils/production";
import { EventEmitter } from "events";

// Storage keys
const STORAGE_KEYS = {
  ACCESS_TOKEN: "@yrjr/access_token",
  REFRESH_TOKEN: "@yrjr/refresh_token",
  TOKEN_EXPIRY: "@yrjr/token_expiry",
  USER_DATA: "@yrjr/user_data",
  DEVICE_ID: "@yrjr/device_id",
  BIOMETRIC_ENABLED: "@yrjr/biometric_enabled",
} as const;

// Events that can be emitted
export enum AuthEvents {
  TOKEN_REFRESHED = "token_refreshed",
  TOKEN_EXPIRED = "token_expired",
  LOGIN_REQUIRED = "login_required",
  LOGOUT_COMPLETED = "logout_completed",
  BIOMETRIC_ENABLED = "biometric_enabled",
  BIOMETRIC_DISABLED = "biometric_disabled",
}

// Token data interface
export interface TokenData {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // seconds
  tokenType?: string;
  scope?: string;
}

// User data interface
export interface UserData {
  id: string;
  email: string;
  name: string;
  role: string;
  permissions: string[];
  preferences: Record<string, any>;
}

/**
 * Enhanced Token Manager Class
 */
export class TokenManager extends EventEmitter {
  private static instance: TokenManager;
  private refreshPromise: Promise<string> | null = null;
  private refreshTimer: NodeJS.Timeout | null = null;

  private constructor() {
    super();
    this.setupAutoRefresh();
  }

  /**
   * Get singleton instance
   */
  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  // ==================== TOKEN MANAGEMENT ====================

  /**
   * Get access token
   */
  async getAccessToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    } catch (error) {
      Logger.error("Error getting access token:", error);
      return null;
    }
  }

  /**
   * Get refresh token
   */
  async getRefreshToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    } catch (error) {
      Logger.error("Error getting refresh token:", error);
      return null;
    }
  }

  /**
   * Set tokens with automatic refresh setup
   */
  async setTokens(tokenData: TokenData): Promise<void> {
    try {
      const expiryTime = Date.now() + tokenData.expiresIn * 1000;

      await AsyncStorage.multiSet([
        [STORAGE_KEYS.ACCESS_TOKEN, tokenData.accessToken],
        [STORAGE_KEYS.REFRESH_TOKEN, tokenData.refreshToken],
        [STORAGE_KEYS.TOKEN_EXPIRY, expiryTime.toString()],
      ]);

      // Setup auto-refresh timer
      this.setupRefreshTimer(tokenData.expiresIn);

      Logger.debug("Tokens set successfully", {
        expiresAt: new Date(expiryTime).toISOString(),
        expiresIn: tokenData.expiresIn,
      });

      this.emit(AuthEvents.TOKEN_REFRESHED, tokenData);
    } catch (error) {
      Logger.error("Error setting tokens:", error);
      throw new Error("Failed to save authentication tokens");
    }
  }

  /**
   * Clear all tokens and user data
   */
  async clearTokens(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.ACCESS_TOKEN,
        STORAGE_KEYS.REFRESH_TOKEN,
        STORAGE_KEYS.TOKEN_EXPIRY,
        STORAGE_KEYS.USER_DATA,
      ]);

      // Clear refresh timer
      if (this.refreshTimer) {
        clearTimeout(this.refreshTimer);
        this.refreshTimer = null;
      }

      Logger.debug("All tokens cleared");
      this.emit(AuthEvents.LOGOUT_COMPLETED);
    } catch (error) {
      Logger.error("Error clearing tokens:", error);
      throw new Error("Failed to clear authentication tokens");
    }
  }

  /**
   * Check if token is expired
   */
  async isTokenExpired(): Promise<boolean> {
    try {
      const expiryTime = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRY);
      if (!expiryTime) return true;

      const isExpired = Date.now() >= parseInt(expiryTime, 10);

      if (isExpired) {
        Logger.debug("Token is expired");
        this.emit(AuthEvents.TOKEN_EXPIRED);
      }

      return isExpired;
    } catch (error) {
      Logger.error("Error checking token expiry:", error);
      return true;
    }
  }

  /**
   * Get time until token expires (in seconds)
   */
  async getTimeUntilExpiry(): Promise<number> {
    try {
      // Check if AsyncStorage is available (web compatibility)
      if (typeof window === "undefined" || !AsyncStorage) {
        return 0;
      }

      const expiryTime = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRY);
      if (!expiryTime) return 0;

      const timeUntilExpiry = Math.max(
        0,
        (parseInt(expiryTime, 10) - Date.now()) / 1000,
      );
      return Math.floor(timeUntilExpiry);
    } catch (error) {
      Logger.error("Error calculating time until expiry:", error);
      return 0;
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const accessToken = await this.getAccessToken();
    const isExpired = await this.isTokenExpired();

    return !!(accessToken && !isExpired);
  }

  // ==================== TOKEN REFRESH ====================

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(): Promise<string | null> {
    // Prevent multiple simultaneous refresh attempts
    if (this.refreshPromise) {
      Logger.debug("Token refresh already in progress, waiting...");
      return this.refreshPromise;
    }

    this.refreshPromise = this.performTokenRefresh();

    try {
      const newToken = await this.refreshPromise;
      return newToken;
    } finally {
      this.refreshPromise = null;
    }
  }

  /**
   * Perform the actual token refresh
   */
  private async performTokenRefresh(): Promise<string | null> {
    try {
      const refreshToken = await this.getRefreshToken();

      if (!refreshToken) {
        Logger.warn("No refresh token available");
        this.handleAuthFailure();
        return null;
      }

      Logger.debug("Refreshing access token...");

      // Call refresh endpoint
      const response = await fetch(`${Config.API_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error(`Token refresh failed: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success || !data.data.accessToken) {
        throw new Error("Invalid refresh response");
      }

      // Update tokens
      await this.setTokens({
        accessToken: data.data.accessToken,
        refreshToken: data.data.refreshToken || refreshToken,
        expiresIn: data.data.expiresIn || 3600,
      });

      Logger.debug("Token refreshed successfully");
      return data.data.accessToken;
    } catch (error) {
      Logger.error("Token refresh failed:", error);
      this.handleAuthFailure();
      return null;
    }
  }

  /**
   * Setup automatic token refresh
   */
  private async setupAutoRefresh(): Promise<void> {
    const timeUntilExpiry = await this.getTimeUntilExpiry();

    if (timeUntilExpiry > 0) {
      this.setupRefreshTimer(timeUntilExpiry);
    }
  }

  /**
   * Setup refresh timer
   */
  private setupRefreshTimer(expiresIn: number): void {
    // Clear existing timer
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }

    // Refresh when 75% of the token lifetime has passed
    const refreshTime = Math.max(300, expiresIn * 0.75) * 1000; // Minimum 5 minutes

    this.refreshTimer = setTimeout(async () => {
      Logger.debug("Auto-refreshing token...");
      await this.refreshAccessToken();
    }, refreshTime);

    Logger.debug(
      `Auto-refresh scheduled in ${Math.floor(refreshTime / 1000)} seconds`,
    );
  }

  /**
   * Handle authentication failure
   */
  private async handleAuthFailure(): Promise<void> {
    Logger.warn("Authentication failed, clearing tokens");

    await this.clearTokens();
    this.emit(AuthEvents.LOGIN_REQUIRED);
  }

  // ==================== USER DATA MANAGEMENT ====================

  /**
   * Set user data
   */
  async setUserData(userData: UserData): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.USER_DATA,
        JSON.stringify(userData),
      );
      Logger.debug("User data saved successfully");
    } catch (error) {
      Logger.error("Error saving user data:", error);
      throw new Error("Failed to save user data");
    }
  }

  /**
   * Get user data
   */
  async getUserData(): Promise<UserData | null> {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      Logger.error("Error getting user data:", error);
      return null;
    }
  }

  /**
   * Update user data
   */
  async updateUserData(updates: Partial<UserData>): Promise<void> {
    const currentData = await this.getUserData();

    if (!currentData) {
      throw new Error("No user data found to update");
    }

    const updatedData = { ...currentData, ...updates };
    await this.setUserData(updatedData);
  }

  // ==================== DEVICE & BIOMETRIC MANAGEMENT ====================

  /**
   * Get or generate device ID
   */
  async getDeviceId(): Promise<string> {
    try {
      let deviceId = await AsyncStorage.getItem(STORAGE_KEYS.DEVICE_ID);

      if (!deviceId) {
        deviceId = this.generateDeviceId();
        await AsyncStorage.setItem(STORAGE_KEYS.DEVICE_ID, deviceId);
      }

      return deviceId;
    } catch (error) {
      Logger.error("Error getting device ID:", error);
      return this.generateDeviceId();
    }
  }

  /**
   * Generate unique device ID
   */
  private generateDeviceId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 9);
    return `device_${timestamp}_${random}`;
  }

  /**
   * Check if biometric authentication is enabled
   */
  async isBiometricEnabled(): Promise<boolean> {
    try {
      const enabled = await AsyncStorage.getItem(
        STORAGE_KEYS.BIOMETRIC_ENABLED,
      );
      return enabled === "true";
    } catch (error) {
      Logger.error("Error checking biometric status:", error);
      return false;
    }
  }

  /**
   * Enable biometric authentication
   */
  async enableBiometric(): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.BIOMETRIC_ENABLED, "true");
      Logger.debug("Biometric authentication enabled");
      this.emit(AuthEvents.BIOMETRIC_ENABLED);
    } catch (error) {
      Logger.error("Error enabling biometric:", error);
      throw new Error("Failed to enable biometric authentication");
    }
  }

  /**
   * Disable biometric authentication
   */
  async disableBiometric(): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.BIOMETRIC_ENABLED, "false");
      Logger.debug("Biometric authentication disabled");
      this.emit(AuthEvents.BIOMETRIC_DISABLED);
    } catch (error) {
      Logger.error("Error disabling biometric:", error);
      throw new Error("Failed to disable biometric authentication");
    }
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Get authentication status summary
   */
  async getAuthStatus(): Promise<{
    isAuthenticated: boolean;
    hasAccessToken: boolean;
    hasRefreshToken: boolean;
    isTokenExpired: boolean;
    timeUntilExpiry: number;
    biometricEnabled: boolean;
    userId?: string;
    userRole?: string;
  }> {
    const [
      accessToken,
      refreshToken,
      isExpired,
      timeUntilExpiry,
      biometricEnabled,
      userData,
    ] = await Promise.all([
      this.getAccessToken(),
      this.getRefreshToken(),
      this.isTokenExpired(),
      this.getTimeUntilExpiry(),
      this.isBiometricEnabled(),
      this.getUserData(),
    ]);

    return {
      isAuthenticated: !!(accessToken && !isExpired),
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
      isTokenExpired: isExpired,
      timeUntilExpiry,
      biometricEnabled,
      userId: userData?.id,
      userRole: userData?.role,
    };
  }

  /**
   * Force logout and clear all data
   */
  async forceLogout(): Promise<void> {
    Logger.debug("Force logout initiated");

    try {
      // Clear all authentication data
      await this.clearTokens();

      // Additional cleanup if needed
      await AsyncStorage.removeItem(STORAGE_KEYS.BIOMETRIC_ENABLED);

      this.emit(AuthEvents.LOGOUT_COMPLETED);
    } catch (error) {
      Logger.error("Error during force logout:", error);
      throw new Error("Failed to complete logout");
    }
  }

  /**
   * Get debug information
   */
  async getDebugInfo(): Promise<Record<string, any>> {
    if (!Config.IS_DEV) return {};

    const authStatus = await this.getAuthStatus();
    const deviceId = await this.getDeviceId();

    return {
      ...authStatus,
      deviceId,
      autoRefreshEnabled: !!this.refreshTimer,
      refreshInProgress: !!this.refreshPromise,
      storageKeys: STORAGE_KEYS,
    };
  }
}

// Create and export singleton instance
export const tokenManager = TokenManager.getInstance();

// Export additional utilities
export default tokenManager;
