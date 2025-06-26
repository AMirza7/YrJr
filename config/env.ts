import { Platform } from "react-native";

// Environment configuration with type safety and fallbacks
export interface AppConfig {
  // API Configuration
  API_BASE_URL: string;
  API_TIMEOUT: number;

  // Feature Flags
  ENABLE_AI_ASSISTANT: boolean;
  ENABLE_BIOMETRIC_AUTH: boolean;
  ENABLE_VOICE_SEARCH: boolean;
  ENABLE_DOCUMENT_SCANNER: boolean;
  ENABLE_PUSH_NOTIFICATIONS: boolean;
  ENABLE_OFFLINE_MODE: boolean;
  ENABLE_ANALYTICS: boolean;
  ENABLE_DEBUG_MODE: boolean;

  // Language & Localization
  DEFAULT_LANGUAGE: string;
  SUPPORTED_LANGUAGES: string[];
  RTL_LANGUAGES: string[];

  // External Services
  FIREBASE_API_KEY: string;
  FIREBASE_PROJECT_ID: string;
  FIREBASE_MESSAGING_SENDER_ID: string;

  // AI & ML Services
  OPENAI_API_KEY: string;
  GOOGLE_TRANSLATE_API_KEY: string;
  OCR_SERVICE_URL: string;

  // Analytics & Monitoring
  SENTRY_DSN: string;
  MIXPANEL_TOKEN: string;
  GOOGLE_ANALYTICS_ID: string;

  // Payment Gateway
  RAZORPAY_KEY_ID: string;
  STRIPE_PUBLISHABLE_KEY: string;

  // Maps & Location
  GOOGLE_MAPS_API_KEY: string;

  // Content Delivery
  CDN_BASE_URL: string;
  ASSETS_BASE_URL: string;

  // Development & Testing
  MOCK_API_DELAY: number;
  ENABLE_API_MOCKS: boolean;
  LOG_LEVEL: "debug" | "info" | "warn" | "error";

  // Security
  ENCRYPTION_KEY: string;
  API_RATE_LIMIT: number;
  MAX_FILE_UPLOAD_SIZE: string;

  // Regional Settings
  DEFAULT_TIMEZONE: string;
  DEFAULT_CURRENCY: string;
  DEFAULT_COUNTRY: string;

  // Platform specific
  IS_DEV: boolean;
  IS_IOS: boolean;
  IS_ANDROID: boolean;
}

// Get environment variable with fallback
const getEnvVar = (key: string, fallback: string = ""): string => {
  // In React Native, we use process.env for environment variables
  // Note: In production, you might want to use a different approach
  // like react-native-config or expo-constants
  return process.env[key] || fallback;
};

// Parse boolean environment variable
const getEnvBool = (key: string, fallback: boolean = false): boolean => {
  const value = getEnvVar(key).toLowerCase();
  return value === "true" || value === "1";
};

// Parse number environment variable
const getEnvNumber = (key: string, fallback: number = 0): number => {
  const value = getEnvVar(key);
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? fallback : parsed;
};

// Parse array environment variable
const getEnvArray = (key: string, fallback: string[] = []): string[] => {
  const value = getEnvVar(key);
  return value ? value.split(",").map((item) => item.trim()) : fallback;
};

// Default configuration for development
const createConfig = (): AppConfig => ({
  // API Configuration
  API_BASE_URL: getEnvVar(
    "API_BASE_URL",
    __DEV__ ? "http://localhost:3000/api/v1" : "https://api.yrjr.app/v1",
  ),
  API_TIMEOUT: getEnvNumber("API_TIMEOUT", 30000),

  // Feature Flags
  ENABLE_AI_ASSISTANT: getEnvBool("ENABLE_AI_ASSISTANT", true),
  ENABLE_BIOMETRIC_AUTH: getEnvBool("ENABLE_BIOMETRIC_AUTH", true),
  ENABLE_VOICE_SEARCH: getEnvBool("ENABLE_VOICE_SEARCH", true),
  ENABLE_DOCUMENT_SCANNER: getEnvBool("ENABLE_DOCUMENT_SCANNER", true),
  ENABLE_PUSH_NOTIFICATIONS: getEnvBool("ENABLE_PUSH_NOTIFICATIONS", true),
  ENABLE_OFFLINE_MODE: getEnvBool("ENABLE_OFFLINE_MODE", false),
  ENABLE_ANALYTICS: getEnvBool("ENABLE_ANALYTICS", !__DEV__),
  ENABLE_DEBUG_MODE: getEnvBool("ENABLE_DEBUG_MODE", __DEV__),

  // Language & Localization
  DEFAULT_LANGUAGE: getEnvVar("DEFAULT_LANGUAGE", "en"),
  SUPPORTED_LANGUAGES: getEnvArray("SUPPORTED_LANGUAGES", [
    "en",
    "hi",
    "bn",
    "ta",
    "te",
    "mr",
    "gu",
    "kn",
    "ml",
    "pa",
    "ur",
    "or",
    "as",
  ]),
  RTL_LANGUAGES: getEnvArray("RTL_LANGUAGES", ["ur", "ar"]),

  // External Services
  FIREBASE_API_KEY: getEnvVar("FIREBASE_API_KEY", ""),
  FIREBASE_PROJECT_ID: getEnvVar("FIREBASE_PROJECT_ID", ""),
  FIREBASE_MESSAGING_SENDER_ID: getEnvVar("FIREBASE_MESSAGING_SENDER_ID", ""),

  // AI & ML Services
  OPENAI_API_KEY: getEnvVar("OPENAI_API_KEY", ""),
  GOOGLE_TRANSLATE_API_KEY: getEnvVar("GOOGLE_TRANSLATE_API_KEY", ""),
  OCR_SERVICE_URL: getEnvVar("OCR_SERVICE_URL", "https://ocr.yrjr.app/v1"),

  // Analytics & Monitoring
  SENTRY_DSN: getEnvVar("SENTRY_DSN", ""),
  MIXPANEL_TOKEN: getEnvVar("MIXPANEL_TOKEN", ""),
  GOOGLE_ANALYTICS_ID: getEnvVar("GOOGLE_ANALYTICS_ID", ""),

  // Payment Gateway
  RAZORPAY_KEY_ID: getEnvVar("RAZORPAY_KEY_ID", ""),
  STRIPE_PUBLISHABLE_KEY: getEnvVar("STRIPE_PUBLISHABLE_KEY", ""),

  // Maps & Location
  GOOGLE_MAPS_API_KEY: getEnvVar("GOOGLE_MAPS_API_KEY", ""),

  // Content Delivery
  CDN_BASE_URL: getEnvVar("CDN_BASE_URL", "https://cdn.yrjr.app"),
  ASSETS_BASE_URL: getEnvVar("ASSETS_BASE_URL", "https://assets.yrjr.app"),

  // Development & Testing
  MOCK_API_DELAY: getEnvNumber("MOCK_API_DELAY", __DEV__ ? 1000 : 0),
  ENABLE_API_MOCKS: getEnvBool("ENABLE_API_MOCKS", __DEV__),
  LOG_LEVEL: getEnvVar(
    "LOG_LEVEL",
    __DEV__ ? "debug" : "error",
  ) as AppConfig["LOG_LEVEL"],

  // Security
  ENCRYPTION_KEY: getEnvVar(
    "ENCRYPTION_KEY",
    "default-dev-key-change-in-production",
  ),
  API_RATE_LIMIT: getEnvNumber("API_RATE_LIMIT", 100),
  MAX_FILE_UPLOAD_SIZE: getEnvVar("MAX_FILE_UPLOAD_SIZE", "10MB"),

  // Regional Settings
  DEFAULT_TIMEZONE: getEnvVar("DEFAULT_TIMEZONE", "Asia/Kolkata"),
  DEFAULT_CURRENCY: getEnvVar("DEFAULT_CURRENCY", "INR"),
  DEFAULT_COUNTRY: getEnvVar("DEFAULT_COUNTRY", "IN"),

  // Platform specific
  IS_DEV: __DEV__,
  IS_IOS: Platform.OS === "ios",
  IS_ANDROID: Platform.OS === "android",
});

// Create and export configuration
export const Config: AppConfig = createConfig();

// Helper functions for feature flags
export const FeatureFlags = {
  isEnabled: (
    feature: keyof Pick<
      AppConfig,
      | "ENABLE_AI_ASSISTANT"
      | "ENABLE_BIOMETRIC_AUTH"
      | "ENABLE_VOICE_SEARCH"
      | "ENABLE_DOCUMENT_SCANNER"
      | "ENABLE_PUSH_NOTIFICATIONS"
      | "ENABLE_OFFLINE_MODE"
      | "ENABLE_ANALYTICS"
      | "ENABLE_DEBUG_MODE"
    >,
  ): boolean => {
    return Config[feature];
  },

  getAllEnabled: (): Record<string, boolean> => {
    return {
      AI_ASSISTANT: Config.ENABLE_AI_ASSISTANT,
      BIOMETRIC_AUTH: Config.ENABLE_BIOMETRIC_AUTH,
      VOICE_SEARCH: Config.ENABLE_VOICE_SEARCH,
      DOCUMENT_SCANNER: Config.ENABLE_DOCUMENT_SCANNER,
      PUSH_NOTIFICATIONS: Config.ENABLE_PUSH_NOTIFICATIONS,
      OFFLINE_MODE: Config.ENABLE_OFFLINE_MODE,
      ANALYTICS: Config.ENABLE_ANALYTICS,
      DEBUG_MODE: Config.ENABLE_DEBUG_MODE,
    };
  },
};

// Environment validation
export const validateConfig = (): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Required in production
  if (!Config.IS_DEV) {
    if (!Config.API_BASE_URL)
      errors.push("API_BASE_URL is required in production");
    if (
      !Config.ENCRYPTION_KEY ||
      Config.ENCRYPTION_KEY === "default-dev-key-change-in-production"
    ) {
      errors.push("ENCRYPTION_KEY must be set in production");
    }
  }

  // Validate API URL format
  try {
    new URL(Config.API_BASE_URL);
  } catch {
    errors.push("API_BASE_URL must be a valid URL");
  }

  // Validate language codes
  if (!Config.SUPPORTED_LANGUAGES.includes(Config.DEFAULT_LANGUAGE)) {
    errors.push("DEFAULT_LANGUAGE must be included in SUPPORTED_LANGUAGES");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Export default
export default Config;
