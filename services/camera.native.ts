import { CameraService } from "./camera.platform";

export default class NativeCameraService implements CameraService {
  async hasCamera(): Promise<boolean> {
    try {
      const { Camera } = await import("expo-camera");
      return true;
    } catch {
      return false;
    }
  }

  async requestPermissions(): Promise<boolean> {
    try {
      const { Camera } = await import("expo-camera");
      const { status } = await Camera.requestCameraPermissionsAsync();
      return status === "granted";
    } catch {
      return false;
    }
  }

  async takePicture(): Promise<string | null> {
    // Implementation would use expo-camera
    return null;
  }

  async scanDocument(): Promise<{ text: string; confidence: number } | null> {
    // Implementation would use expo-camera + OCR
    return null;
  }
}
