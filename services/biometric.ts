// Simple mock for biometric service
export interface BiometricCapabilities {
  isAvailable: boolean;
  types: string[];
}

class BiometricService {
  async isBiometricAvailable(): Promise<boolean> {
    return true; // Mock availability
  }

  async authenticate(): Promise<boolean> {
    return true; // Mock success
  }

  async getCapabilities(): Promise<BiometricCapabilities> {
    return {
      isAvailable: true,
      types: ["fingerprint", "face"],
    };
  }

  async isBiometricEnabled(): Promise<boolean> {
    return false;
  }

  async enableBiometric(): Promise<void> {
    console.log("Biometric enabled");
  }

  async disableBiometric(): Promise<void> {
    console.log("Biometric disabled");
  }
}

export const biometricService = new BiometricService();
