import { Platform } from "react-native";

export interface CameraService {
  hasCamera(): Promise<boolean>;
  requestPermissions(): Promise<boolean>;
  takePicture(): Promise<string | null>;
  scanDocument(): Promise<{ text: string; confidence: number } | null>;
}

// Web implementation (lightweight)
class WebCameraService implements CameraService {
  async hasCamera(): Promise<boolean> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.some((device) => device.kind === "videoinput");
    } catch {
      return false;
    }
  }

  async requestPermissions(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach((track) => track.stop());
      return true;
    } catch {
      return false;
    }
  }

  async takePicture(): Promise<string | null> {
    // Web camera implementation would go here
    return null;
  }

  async scanDocument(): Promise<{ text: string; confidence: number } | null> {
    // Web OCR would use a lightweight library like Tesseract.js
    return null;
  }
}

// Dynamic import for native camera service
const createCameraService = async (): Promise<CameraService> => {
  if (Platform.OS === "web") {
    return new WebCameraService();
  } else {
    // Dynamically import native implementation
    const { default: NativeCameraService } = await import("./camera.native");
    return new NativeCameraService();
  }
};

let cameraServiceInstance: CameraService | null = null;

export const getCameraService = async (): Promise<CameraService> => {
  if (!cameraServiceInstance) {
    cameraServiceInstance = await createCameraService();
  }
  return cameraServiceInstance;
};
