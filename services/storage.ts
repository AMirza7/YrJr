import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "@/types/auth";

const STORAGE_KEYS = {
  USER: "user_data",
  TOKEN: "auth_token",
};

class StorageService {
  async setUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error("Error saving user:", error);
      throw new Error("Failed to save user data");
    }
  }

  async getUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Error getting user:", error);
      return null;
    }
  }

  async setToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
    } catch (error) {
      console.error("Error saving token:", error);
      throw new Error("Failed to save token");
    }
  }

  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
    } catch (error) {
      console.error("Error getting token:", error);
      return null;
    }
  }

  async clearAuth(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([STORAGE_KEYS.USER, STORAGE_KEYS.TOKEN]);
    } catch (error) {
      console.error("Error clearing auth:", error);
      throw new Error("Failed to clear auth data");
    }
  }
}

export const storage = new StorageService();
