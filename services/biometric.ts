import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export interface BiometricAuthResult {
  success: boolean;
  error?: string;
  biometricType?: string;
}

export class BiometricService {
  private static readonly BIOMETRIC_ENABLED_KEY = "biometric_enabled";
  private static readonly PIN_KEY = "user_pin";

  // Check if biometric authentication is available
  static async isBiometricAvailable(): Promise<boolean> {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      return hasHardware && isEnrolled;
    } catch (error) {
      console.error("Error checking biometric availability:", error);
      return false;
    }
  }

  // Get available biometric types
  static async getBiometricTypes(): Promise<
    LocalAuthentication.AuthenticationType[]
  > {
    try {
      return await LocalAuthentication.supportedAuthenticationTypesAsync();
    } catch (error) {
      console.error("Error getting biometric types:", error);
      return [];
    }
  }

  // Get biometric type name for display
  static getBiometricDisplayName(
    types: LocalAuthentication.AuthenticationType[],
  ): string {
    if (
      types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)
    ) {
      return Platform.OS === "ios" ? "Face ID" : "Face Recognition";
    } else if (
      types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)
    ) {
      return Platform.OS === "ios" ? "Touch ID" : "Fingerprint";
    } else if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
      return "Iris Recognition";
    }
    return "Biometric Authentication";
  }

  // Authenticate using biometrics
  static async authenticateWithBiometrics(): Promise<BiometricAuthResult> {
    try {
      const isAvailable = await this.isBiometricAvailable();
      if (!isAvailable) {
        return {
          success: false,
          error: "Biometric authentication is not available or not set up",
        };
      }

      const types = await this.getBiometricTypes();
      const biometricName = this.getBiometricDisplayName(types);

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: `Use ${biometricName} to access the app`,
        cancelLabel: "Cancel",
        fallbackLabel: "Use PIN",
        disableDeviceFallback: false,
      });

      if (result.success) {
        return {
          success: true,
          biometricType: biometricName,
        };
      } else {
        return {
          success: false,
          error: result.error || "Authentication failed",
        };
      }
    } catch (error) {
      console.error("Biometric authentication error:", error);
      return {
        success: false,
        error: "Authentication failed",
      };
    }
  }

  // Check if biometric authentication is enabled by user
  static async isBiometricEnabled(): Promise<boolean> {
    try {
      const enabled = await SecureStore.getItemAsync(
        this.BIOMETRIC_ENABLED_KEY,
      );
      return enabled === "true";
    } catch (error) {
      console.error("Error checking biometric enabled status:", error);
      return false;
    }
  }

  // Enable/disable biometric authentication
  static async setBiometricEnabled(enabled: boolean): Promise<void> {
    try {
      await SecureStore.setItemAsync(
        this.BIOMETRIC_ENABLED_KEY,
        enabled.toString(),
      );
    } catch (error) {
      console.error("Error setting biometric enabled status:", error);
      throw new Error("Failed to update biometric settings");
    }
  }

  // Set PIN for fallback authentication
  static async setPIN(pin: string): Promise<void> {
    try {
      // Hash the PIN before storing (simple implementation)
      const hashedPin = await this.hashPIN(pin);
      await SecureStore.setItemAsync(this.PIN_KEY, hashedPin);
    } catch (error) {
      console.error("Error setting PIN:", error);
      throw new Error("Failed to set PIN");
    }
  }

  // Verify PIN
  static async verifyPIN(pin: string): Promise<boolean> {
    try {
      const storedPin = await SecureStore.getItemAsync(this.PIN_KEY);
      if (!storedPin) return false;

      const hashedPin = await this.hashPIN(pin);
      return hashedPin === storedPin;
    } catch (error) {
      console.error("Error verifying PIN:", error);
      return false;
    }
  }

  // Check if PIN is set
  static async isPINSet(): Promise<boolean> {
    try {
      const pin = await SecureStore.getItemAsync(this.PIN_KEY);
      return !!pin;
    } catch (error) {
      console.error("Error checking PIN status:", error);
      return false;
    }
  }

  // Simple PIN hashing (in production, use a proper hashing library)
  private static async hashPIN(pin: string): Promise<string> {
    // This is a simple implementation - use proper crypto in production
    return Buffer.from(pin).toString("base64");
  }

  // Remove PIN
  static async removePIN(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(this.PIN_KEY);
    } catch (error) {
      console.error("Error removing PIN:", error);
      throw new Error("Failed to remove PIN");
    }
  }

  // Complete biometric setup
  static async setupBiometricAuth(): Promise<BiometricAuthResult> {
    try {
      const isAvailable = await this.isBiometricAvailable();
      if (!isAvailable) {
        return {
          success: false,
          error:
            "Biometric authentication is not available. Please set up biometrics in your device settings.",
        };
      }

      // Test biometric authentication
      const authResult = await this.authenticateWithBiometrics();
      if (authResult.success) {
        await this.setBiometricEnabled(true);
        return {
          success: true,
          biometricType: authResult.biometricType,
        };
      } else {
        return authResult;
      }
    } catch (error) {
      console.error("Error setting up biometric auth:", error);
      return {
        success: false,
        error: "Failed to setup biometric authentication",
      };
    }
  }
}
