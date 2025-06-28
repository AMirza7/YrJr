import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "@/types";

const KEYS = {
  USER: "user_data",
  TOKEN: "auth_token",
};

export const storage = {
  async setUser(user: User): Promise<void> {
    await AsyncStorage.setItem(KEYS.USER, JSON.stringify(user));
  },

  async getUser(): Promise<User | null> {
    const userData = await AsyncStorage.getItem(KEYS.USER);
    return userData ? JSON.parse(userData) : null;
  },

  async setToken(token: string): Promise<void> {
    await AsyncStorage.setItem(KEYS.TOKEN, token);
  },

  async getToken(): Promise<string | null> {
    return await AsyncStorage.getItem(KEYS.TOKEN);
  },

  async clearAuth(): Promise<void> {
    await AsyncStorage.multiRemove([KEYS.USER, KEYS.TOKEN]);
  },
};
