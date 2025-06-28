import { Platform } from "react-native";

// Platform-specific biometric authentication
export interface BiometricAuthResult {
  success: boolean;
  error?: string;
  authType?: string;
}

export interface BiometricService {
  checkCapabilities(): Promise<any>;
  isBiometricAvailable(): Promise<boolean>;
  isBiometricEnabled(): Promise<boolean>;
  authenticate(
    message?: string,
    subtitle?: string,
  ): Promise<BiometricAuthResult>;
  enableBiometric(pin?: string): Promise<BiometricAuthResult>;
  disableBiometric(): Promise<boolean>;
}

// Web implementation (lightweight)
class WebBiometricService implements BiometricService {
  async checkCapabilities() {
    return {
      hasHardware: false,
      isEnrolled: false,
      supportedTypes: [],
    };
  }

  async isBiometricAvailable(): Promise<boolean> {
    return false;
  }

  async isBiometricEnabled(): Promise<boolean> {
    try {
      const enabled = localStorage.getItem("biometric_enabled");
      return enabled === "true";
    } catch {
      return false;
    }
  }

  async authenticate(message?: string): Promise<BiometricAuthResult> {
    // Simulate web authentication (could use Web Authentication API in production)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, authType: "web-fallback" });
      }, 500);
    });
  }

  async enableBiometric(): Promise<BiometricAuthResult> {
    try {
      localStorage.setItem("biometric_enabled", "true");
      return { success: true };
    } catch (error) {
      return { success: false, error: "Failed to enable biometric" };
    }
  }

  async disableBiometric(): Promise<boolean> {
    try {
      localStorage.removeItem("biometric_enabled");
      return true;
    } catch {
      return false;
    }
  }
}

// Dynamic import for native biometric service
const createBiometricService = async (): Promise<BiometricService> => {
  if (Platform.OS === "web") {
    return new WebBiometricService();
  } else {
    // Dynamically import native implementation only when needed
    const { biometricService } = await import("./biometric");
    return biometricService;
  }
};

// Singleton pattern with lazy loading
let biometricServiceInstance: BiometricService | null = null;

export const getBiometricService = async (): Promise<BiometricService> => {
  if (!biometricServiceInstance) {
    biometricServiceInstance = await createBiometricService();
  }
  return biometricServiceInstance;
};

// For immediate access in non-critical paths
export const biometricServicePlatform =
  Platform.OS === "web" ? new WebBiometricService() : null;
