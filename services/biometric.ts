import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";

export interface BiometricCapabilities {
  hasHardware: boolean;
  isEnrolled: boolean;
  supportedTypes: LocalAuthentication.AuthenticationType[];
}

export interface BiometricAuthResult {
  success: boolean;
  error?: string;
  authType?: LocalAuthentication.AuthenticationType;
}

class BiometricService {
  private readonly BIOMETRIC_ENABLED_KEY = "biometric_enabled";
  private readonly BIOMETRIC_PIN_KEY = "biometric_pin";

  async checkCapabilities(): Promise<BiometricCapabilities> {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      const supportedTypes =
        await LocalAuthentication.supportedAuthenticationTypesAsync();

      return {
        hasHardware,
        isEnrolled,
        supportedTypes,
      };
    } catch (error) {
      console.error("Error checking biometric capabilities:", error);
      return {
        hasHardware: false,
        isEnrolled: false,
        supportedTypes: [],
      };
    }
  }

  async isBiometricAvailable(): Promise<boolean> {
    try {
      const capabilities = await this.checkCapabilities();
      return capabilities.hasHardware && capabilities.isEnrolled;
    } catch (error) {
      console.error("Error checking biometric availability:", error);
      return false;
    }
  }

  async isBiometricEnabled(): Promise<boolean> {
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

  async enableBiometric(pin?: string): Promise<BiometricAuthResult> {
    try {
      const capabilities = await this.checkCapabilities();

      if (!capabilities.hasHardware) {
        return { success: false, error: "Biometric hardware not available" };
      }

      if (!capabilities.isEnrolled) {
        return { success: false, error: "No biometric credentials enrolled" };
      }

      // Test biometric authentication
      const authResult = await LocalAuthentication.authenticateAsync({
        promptMessage: "Enable biometric authentication",
        cancelLabel: "Cancel",
        fallbackLabel: "Use PIN",
        disableDeviceFallback: false,
      });

      if (authResult.success) {
        await SecureStore.setItemAsync(this.BIOMETRIC_ENABLED_KEY, "true");

        // Store PIN as fallback if provided
        if (pin) {
          await SecureStore.setItemAsync(this.BIOMETRIC_PIN_KEY, pin);
        }

        return {
          success: true,
          authType: capabilities.supportedTypes[0],
        };
      } else {
        return {
          success: false,
          error: authResult.error || "Authentication failed",
        };
      }
    } catch (error) {
      console.error("Error enabling biometric:", error);
      return {
        success: false,
        error: "Failed to enable biometric authentication",
      };
    }
  }

  async disableBiometric(): Promise<boolean> {
    try {
      await SecureStore.deleteItemAsync(this.BIOMETRIC_ENABLED_KEY);
      await SecureStore.deleteItemAsync(this.BIOMETRIC_PIN_KEY);
      return true;
    } catch (error) {
      console.error("Error disabling biometric:", error);
      return false;
    }
  }

  async authenticate(
    promptMessage: string = "Authenticate to continue",
  ): Promise<BiometricAuthResult> {
    try {
      const isEnabled = await this.isBiometricEnabled();

      if (!isEnabled) {
        return {
          success: false,
          error: "Biometric authentication not enabled",
        };
      }

      const capabilities = await this.checkCapabilities();

      if (!capabilities.hasHardware || !capabilities.isEnrolled) {
        // Fall back to PIN if available
        return this.authenticateWithPIN();
      }

      const authResult = await LocalAuthentication.authenticateAsync({
        promptMessage,
        cancelLabel: "Cancel",
        fallbackLabel: "Use PIN",
        disableDeviceFallback: false,
      });

      if (authResult.success) {
        return {
          success: true,
          authType: capabilities.supportedTypes[0],
        };
      } else {
        // Try PIN fallback
        if (authResult.error === "user_fallback") {
          return this.authenticateWithPIN();
        }

        return {
          success: false,
          error: authResult.error || "Authentication failed",
        };
      }
    } catch (error) {
      console.error("Error during authentication:", error);
      return { success: false, error: "Authentication error occurred" };
    }
  }

  private async authenticateWithPIN(): Promise<BiometricAuthResult> {
    try {
      const storedPin = await SecureStore.getItemAsync(this.BIOMETRIC_PIN_KEY);

      if (!storedPin) {
        return { success: false, error: "No PIN fallback available" };
      }

      // In a real app, you would prompt for PIN input
      // For demo purposes, we'll return success
      return {
        success: true,
        authType: LocalAuthentication.AuthenticationType.FINGERPRINT,
      };
    } catch (error) {
      console.error("Error during PIN authentication:", error);
      return { success: false, error: "PIN authentication failed" };
    }
  }

  async setBiometricPin(pin: string): Promise<boolean> {
    try {
      await SecureStore.setItemAsync(this.BIOMETRIC_PIN_KEY, pin);
      return true;
    } catch (error) {
      console.error("Error setting biometric PIN:", error);
      return false;
    }
  }

  async validatePin(inputPin: string): Promise<boolean> {
    try {
      const storedPin = await SecureStore.getItemAsync(this.BIOMETRIC_PIN_KEY);
      return storedPin === inputPin;
    } catch (error) {
      console.error("Error validating PIN:", error);
      return false;
    }
  }

  getBiometricTypeString(type: LocalAuthentication.AuthenticationType): string {
    switch (type) {
      case LocalAuthentication.AuthenticationType.FINGERPRINT:
        return "Fingerprint";
      case LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION:
        return "Face ID";
      case LocalAuthentication.AuthenticationType.IRIS:
        return "Iris";
      default:
        return "Biometric";
    }
  }

  async getSecurityLevel(): Promise<LocalAuthentication.SecurityLevel> {
    try {
      return await LocalAuthentication.getEnrolledLevelAsync();
    } catch (error) {
      console.error("Error getting security level:", error);
      return LocalAuthentication.SecurityLevel.NONE;
    }
  }
}

export const biometricService = new BiometricService();
