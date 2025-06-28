import { DemoAccount } from "@/types";

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    email: "lawyer@yrjr.app",
    password: "demo123",
    role: "lawyer",
    name: "Advocate Rajesh Kumar",
    displayTitle: "Senior Lawyer",
  },
  {
    email: "jr.lawyer@yrjr.app",
    password: "demo123",
    role: "junior_lawyer",
    name: "Priya Sharma",
    displayTitle: "Junior Lawyer",
  },
  {
    email: "assistant@yrjr.app",
    password: "demo123",
    role: "lawyer_assistant",
    name: "Rohit Gupta",
    displayTitle: "Legal Assistant",
  },
  {
    email: "helper@yrjr.app",
    password: "demo123",
    role: "law_office_helper",
    name: "Meera Singh",
    displayTitle: "Office Helper",
  },
  {
    email: "student@yrjr.app",
    password: "demo123",
    role: "law_student",
    name: "Arjun Patel",
    displayTitle: "Law Student",
  },
];

export const ADMIN_CREDENTIALS = {
  email: "admin@yrjr.app",
  password: "admin123",
  role: "admin" as const,
  name: "System Administrator",
  displayTitle: "Admin Dashboard",
};

export const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: false,
};

export const validatePassword = (
  password: string,
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < PASSWORD_REQUIREMENTS.minLength) {
    errors.push(
      `Password must be at least ${PASSWORD_REQUIREMENTS.minLength} characters long`,
    );
  }

  if (PASSWORD_REQUIREMENTS.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (PASSWORD_REQUIREMENTS.requireLowercase && !/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (PASSWORD_REQUIREMENTS.requireNumbers && !/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  if (
    PASSWORD_REQUIREMENTS.requireSpecialChars &&
    !/[!@#$%^&*(),.?":{}|<>]/.test(password)
  ) {
    errors.push("Password must contain at least one special character");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[6-9]\d{9}$/; // Indian mobile number format
  return phoneRegex.test(phone.replace(/\D/g, ""));
};

export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: "Invalid email or password",
  USER_NOT_FOUND: "User not found",
  USER_EXISTS: "User already exists with this email",
  ACCOUNT_PENDING: "Your account is pending approval",
  ACCOUNT_SUSPENDED: "Your account has been suspended",
  EMAIL_NOT_VERIFIED: "Please verify your email before continuing",
  INVALID_TOKEN: "Invalid or expired token",
  PASSWORD_MISMATCH: "Passwords do not match",
  WEAK_PASSWORD: "Password does not meet security requirements",
  INVALID_EMAIL: "Please enter a valid email address",
  INVALID_PHONE: "Please enter a valid phone number",
  NETWORK_ERROR: "Network error. Please check your connection",
  SERVER_ERROR: "Server error. Please try again later",
  UNAUTHORIZED: "You are not authorized to perform this action",
  SESSION_EXPIRED: "Your session has expired. Please login again",
};

export const AUTH_SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: "Welcome back!",
  SIGNUP_SUCCESS: "Account created successfully!",
  LOGOUT_SUCCESS: "Logged out successfully",
  PASSWORD_RESET_SENT: "Password reset email sent",
  PASSWORD_CHANGED: "Password changed successfully",
  EMAIL_VERIFIED: "Email verified successfully",
  PROFILE_UPDATED: "Profile updated successfully",
  ACCOUNT_APPROVED: "Your account has been approved!",
  VERIFICATION_BADGE_GRANTED: "Verification badge granted!",
};

export const BIOMETRIC_CONFIG = {
  title: "Authenticate",
  subtitle: "Use your biometric to access secure features",
  description:
    "Place your finger on the fingerprint sensor or look at the camera",
  fallbackLabel: "Use Password",
  negativeButtonText: "Cancel",
  disableDeviceFallback: false,
};

export const OTP_CONFIG = {
  length: 6,
  resendDelay: 60, // seconds
  maxAttempts: 3,
  expiryTime: 300, // 5 minutes in seconds
};

export const SESSION_CONFIG = {
  tokenExpiryTime: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  refreshTokenExpiryTime: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  autoLogoutTime: 30 * 60 * 1000, // 30 minutes of inactivity
};

export const STORAGE_KEYS = {
  USER_DATA: "user_data",
  AUTH_TOKEN: "auth_token",
  REFRESH_TOKEN: "refresh_token",
  BIOMETRIC_ENABLED: "biometric_enabled",
  LAST_LOGIN: "last_login",
  SESSION_TIMEOUT: "session_timeout",
  DEVICE_ID: "device_id",
  PUSH_TOKEN: "push_token",
};
