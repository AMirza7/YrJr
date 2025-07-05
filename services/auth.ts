import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  User,
  SignupData,
  AuthResponse,
  UserRole,
  SubscriptionTier,
} from "@/types";
import { DEMO_ACCOUNTS } from "@/constants/auth";

const KEYS = {
  USER: "user_data",
  TOKEN: "auth_token",
  BIOMETRIC_ENABLED: "biometric_enabled",
  LAST_LOGIN: "last_login",
};

// Mock database for demo purposes
const MOCK_USERS: User[] = [];

// Generate demo users from DEMO_ACCOUNTS
DEMO_ACCOUNTS.forEach((account, index) => {
  const demoUser: User = {
    id: `demo_${account.role}_${index}`,
    email: account.email,
    name: account.name,
    role: account.role,
    isVerified: true,
    isApproved: true, // All demo accounts should be approved
    hasVerificationBadge:
      account.role === "lawyer" || account.role === "junior_lawyer",
    subscriptionTier:
      account.role === "lawyer"
        ? "premium"
        : account.role === "junior_lawyer"
          ? "pro"
          : "free",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    lastActiveAt: new Date().toISOString(),
    preferences: {
      theme: "light",
      language: "en",
      notifications: {
        push: true,
        email: true,
        caseUpdates: true,
        reminders: true,
        marketing: false,
      },
      privacy: {
        profileVisible: true,
        contactInfoVisible: false,
        showOnlineStatus: true,
      },
    },
  };

  MOCK_USERS.push(demoUser);
  console.log(`📝 Created demo user: ${demoUser.email} - ${demoUser.role}`);
});

// Add admin account
MOCK_USERS.push({
  id: "admin_001",
  email: "admin@yrjr.app",
  name: "System Administrator",
  role: "admin",
  isVerified: true,
  isApproved: true,
  hasVerificationBadge: true,
  subscriptionTier: "premium",
  createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
  lastActiveAt: new Date().toISOString(),
  preferences: {
    theme: "dark",
    language: "en",
    notifications: {
      push: true,
      email: true,
      caseUpdates: true,
      reminders: true,
      marketing: false,
    },
    privacy: {
      profileVisible: false,
      contactInfoVisible: false,
      showOnlineStatus: false,
    },
  },
});

export const authService = {
  async loginWithPhone(phone: string, password: string): Promise<AuthResponse> {
    try {
      console.log(`📱 Phone login attempt: ${phone}`);

      // For non-demo phone numbers, create a user account or validate
      // This is a simplified implementation - in reality you'd have phone-based user accounts

      return {
        success: false,
        message:
          "Phone-based login not implemented yet. Please use demo account (9876543210).",
      };
    } catch (error) {
      return {
        success: false,
        message: "Phone login failed. Please try again.",
      };
    }
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      console.log(`🔑 Login attempt: ${email} with password: ${password}`);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Check admin account first
      if (email === "admin@yrjr.app" && password === "admin123") {
        console.log("🏛️ Admin login detected");
        const adminUser = MOCK_USERS.find((u) => u.email === "admin@yrjr.app");
        if (adminUser) {
          const token = `token_${adminUser.id}_${Date.now()}`;
          await AsyncStorage.setItem(KEYS.USER, JSON.stringify(adminUser));
          await AsyncStorage.setItem(KEYS.TOKEN, token);
          await AsyncStorage.setItem(KEYS.LAST_LOGIN, new Date().toISOString());

          console.log("✅ Admin login successful");
          return {
            success: true,
            user: adminUser,
            token,
          };
        }
      }

      // Check demo accounts
      const demoAccount = DEMO_ACCOUNTS.find(
        (account) => account.email === email,
      );

      if (demoAccount && password === "demo123") {
        console.log(`👤 Demo account found: ${demoAccount.role}`);
        const user = MOCK_USERS.find((u) => u.email === email);
        if (user) {
          const token = `token_${user.id}_${Date.now()}`;
          await AsyncStorage.setItem(KEYS.USER, JSON.stringify(user));
          await AsyncStorage.setItem(KEYS.TOKEN, token);
          await AsyncStorage.setItem(KEYS.LAST_LOGIN, new Date().toISOString());

          console.log(`✅ Demo login successful for ${user.role}`);
          return {
            success: true,
            user,
            token,
          };
        } else {
          console.error(`❌ Demo user not found in MOCK_USERS for ${email}`);
        }
      }

      console.log("❌ Invalid credentials or user not found");
      return {
        success: false,
        message: "Invalid email or password",
      };
    } catch (error) {
      console.error("❌ Login error:", error);
      return {
        success: false,
        message: "Login failed. Please try again.",
      };
    }
  },

  async signup(data: SignupData): Promise<AuthResponse> {
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Check if user already exists
      const existingUser = MOCK_USERS.find((u) => u.email === data.email);
      if (existingUser) {
        return {
          success: false,
          message: "User already exists with this email",
        };
      }

      // Create new user
      const newUser: User = {
        id: `user_${Date.now()}`,
        email: data.email,
        phone: data.phone,
        name: data.name,
        role: data.role,
        isVerified: false,
        isApproved: false,
        hasVerificationBadge: false,
        subscriptionTier: "free",
        specialization: data.specialization,
        practiceYears: data.practiceYears,
        barCouncilNumber: data.barCouncilNumber,
        officeAddress: data.officeAddress,
        createdAt: new Date().toISOString(),
        lastActiveAt: new Date().toISOString(),
        preferences: {
          theme: "light",
          language: "en",
          notifications: {
            push: true,
            email: true,
            caseUpdates: true,
            reminders: true,
            marketing: false,
          },
          privacy: {
            profileVisible: true,
            contactInfoVisible: false,
            showOnlineStatus: true,
          },
        },
      };

      // Add to mock database
      MOCK_USERS.push(newUser);

      // For lawyers and junior lawyers, require approval
      const requiresApproval =
        data.role === "lawyer" || data.role === "junior_lawyer";

      return {
        success: true,
        user: newUser,
        message: requiresApproval
          ? "Account created successfully! Your account is pending approval from an administrator."
          : "Account created successfully! Please verify your email to continue.",
        requiresVerification: true,
      };
    } catch (error) {
      return {
        success: false,
        message: "Signup failed. Please try again.",
      };
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem(KEYS.USER);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  },

  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(KEYS.TOKEN);
    } catch (error) {
      console.error("Error getting token:", error);
      return null;
    }
  },

  async updateUser(updates: Partial<User>): Promise<boolean> {
    try {
      const currentUser = await this.getCurrentUser();
      if (!currentUser) return false;

      const updatedUser = { ...currentUser, ...updates };
      await AsyncStorage.setItem(KEYS.USER, JSON.stringify(updatedUser));

      // Update in mock database
      const index = MOCK_USERS.findIndex((u) => u.id === currentUser.id);
      if (index !== -1) {
        MOCK_USERS[index] = updatedUser;
      }

      return true;
    } catch (error) {
      console.error("Error updating user:", error);
      return false;
    }
  },

  async logout(): Promise<void> {
    try {
      // Clear all auth-related data
      await AsyncStorage.multiRemove([
        KEYS.USER,
        KEYS.TOKEN,
        KEYS.BIOMETRIC_ENABLED,
        KEYS.LAST_LOGIN,
      ]);

      // Clear any other sensitive data
      await AsyncStorage.removeItem("app_session_data");
      await AsyncStorage.removeItem("user_preferences");
      await AsyncStorage.removeItem("secure_notes_auth");
      await AsyncStorage.removeItem("cached_user_data");
      await AsyncStorage.removeItem("feature_flags");

      // Clear any pinboard or case data
      await AsyncStorage.removeItem("pinboard_items");
      await AsyncStorage.removeItem("case_timeline_data");
      await AsyncStorage.removeItem("flashcard_progress");

      console.log("Logout completed successfully - all data cleared");
    } catch (error) {
      console.error("Error during logout:", error);
      // Even if there's an error, ensure we clear what we can
      try {
        // Clear all storage as fallback
        const allKeys = await AsyncStorage.getAllKeys();
        if (allKeys.length > 0) {
          await AsyncStorage.multiRemove(allKeys);
        }
      } catch (clearError) {
        console.error("Error clearing AsyncStorage:", clearError);
      }
    }
  },

  async enableBiometric(): Promise<boolean> {
    try {
      await AsyncStorage.setItem(KEYS.BIOMETRIC_ENABLED, "true");
      return true;
    } catch (error) {
      console.error("Error enabling biometric:", error);
      return false;
    }
  },

  async isBiometricEnabled(): Promise<boolean> {
    try {
      const enabled = await AsyncStorage.getItem(KEYS.BIOMETRIC_ENABLED);
      return enabled === "true";
    } catch (error) {
      return false;
    }
  },

  async sendPasswordReset(email: string): Promise<boolean> {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const user = MOCK_USERS.find((u) => u.email === email);
      return !!user;
    } catch (error) {
      return false;
    }
  },

  async verifyEmail(token: string): Promise<boolean> {
    try {
      // Simulate email verification
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const currentUser = await this.getCurrentUser();
      if (currentUser) {
        await this.updateUser({ isVerified: true });
        return true;
      }

      return false;
    } catch (error) {
      return false;
    }
  },

  async resendVerificationEmail(): Promise<boolean> {
    try {
      const currentUser = await this.getCurrentUser();
      if (!currentUser) return false;

      // Simulate resending verification email
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return true;
    } catch (error) {
      return false;
    }
  },

  async changePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<boolean> {
    try {
      // Simulate password change
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return true;
    } catch (error) {
      return false;
    }
  },

  async deleteAccount(): Promise<boolean> {
    try {
      const currentUser = await this.getCurrentUser();
      if (!currentUser) return false;

      // Remove from mock database
      const index = MOCK_USERS.findIndex((u) => u.id === currentUser.id);
      if (index !== -1) {
        MOCK_USERS.splice(index, 1);
      }

      await this.logout();
      return true;
    } catch (error) {
      return false;
    }
  },

  // Public method to get verified lawyers for directory
  async getPublicLawyers(): Promise<User[]> {
    try {
      // Return only public information for verified lawyers
      return MOCK_USERS.filter(
        (user) =>
          (user.role === "lawyer" || user.role === "junior_lawyer") &&
          user.isVerified &&
          user.isApproved,
      );
    } catch (error) {
      console.error("Error getting public lawyers:", error);
      return [];
    }
  },

  // Admin functions
  async getAllUsers(): Promise<User[]> {
    try {
      const currentUser = await this.getCurrentUser();
      if (!currentUser || currentUser.role !== "admin") {
        throw new Error("Unauthorized");
      }

      return [...MOCK_USERS];
    } catch (error) {
      console.error("Error getting all users:", error);
      return [];
    }
  },

  async approveUser(userId: string): Promise<boolean> {
    try {
      const currentUser = await this.getCurrentUser();
      if (!currentUser || currentUser.role !== "admin") {
        throw new Error("Unauthorized");
      }

      const index = MOCK_USERS.findIndex((u) => u.id === userId);
      if (index !== -1) {
        MOCK_USERS[index].isApproved = true;
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error approving user:", error);
      return false;
    }
  },

  async rejectUser(userId: string, reason?: string): Promise<boolean> {
    try {
      const currentUser = await this.getCurrentUser();
      if (!currentUser || currentUser.role !== "admin") {
        throw new Error("Unauthorized");
      }

      const index = MOCK_USERS.findIndex((u) => u.id === userId);
      if (index !== -1) {
        MOCK_USERS[index].isApproved = false;
        // In a real app, you might also set a rejection reason
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error rejecting user:", error);
      return false;
    }
  },

  async grantVerificationBadge(userId: string): Promise<boolean> {
    try {
      const currentUser = await this.getCurrentUser();
      if (!currentUser || currentUser.role !== "admin") {
        throw new Error("Unauthorized");
      }

      const index = MOCK_USERS.findIndex((u) => u.id === userId);
      if (index !== -1) {
        MOCK_USERS[index].hasVerificationBadge = true;
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error granting verification badge:", error);
      return false;
    }
  },

  async revokeVerificationBadge(userId: string): Promise<boolean> {
    try {
      const currentUser = await this.getCurrentUser();
      if (!currentUser || currentUser.role !== "admin") {
        throw new Error("Unauthorized");
      }

      const index = MOCK_USERS.findIndex((u) => u.id === userId);
      if (index !== -1) {
        MOCK_USERS[index].hasVerificationBadge = false;
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error revoking verification badge:", error);
      return false;
    }
  },

  async updateUserSubscription(
    userId: string,
    tier: SubscriptionTier,
  ): Promise<boolean> {
    try {
      const currentUser = await this.getCurrentUser();
      if (!currentUser || currentUser.role !== "admin") {
        throw new Error("Unauthorized");
      }

      const index = MOCK_USERS.findIndex((u) => u.id === userId);
      if (index !== -1) {
        MOCK_USERS[index].subscriptionTier = tier;
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error updating user subscription:", error);
      return false;
    }
  },

  // Demo account credentials
  getDemoCredentials(): Array<{
    email: string;
    password: string;
    role: string;
    description: string;
  }> {
    const credentials = DEMO_ACCOUNTS.map((account) => ({
      email: account.email,
      password: "demo123",
      role: account.role,
      description: account.displayTitle,
    }));

    // Add admin credentials
    credentials.push({
      email: "admin@yrjr.app",
      password: "admin123",
      role: "admin",
      description: "System Administrator",
    });

    return credentials;
  },
};
