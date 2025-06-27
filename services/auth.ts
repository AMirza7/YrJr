// Simple auth service for the rebuilt app
import { storage } from "./storage";

export class AuthService {
  static async isAuthenticated(): Promise<boolean> {
    try {
      const token = await storage.getToken();
      return !!token;
    } catch {
      return false;
    }
  }
}
