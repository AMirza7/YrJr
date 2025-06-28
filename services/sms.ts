import { Alert } from "react-native";

export interface SMSResult {
  success: boolean;
  error?: string;
  otpCode?: string; // For demo purposes
}

class SMSService {
  private otpStorage: Map<
    string,
    { code: string; timestamp: number; attempts: number }
  > = new Map();
  private readonly OTP_EXPIRY = 10 * 60 * 1000; // 10 minutes
  private readonly MAX_ATTEMPTS = 3;

  // Generate a random 6-digit OTP
  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Send OTP to phone number
  async sendOTP(phoneNumber: string): Promise<SMSResult> {
    try {
      // Validate phone number format
      if (!this.validatePhoneNumber(phoneNumber)) {
        return { success: false, error: "Invalid phone number format" };
      }

      // Generate OTP
      const otpCode = this.generateOTP();
      const timestamp = Date.now();

      // Store OTP with timestamp and reset attempts
      this.otpStorage.set(phoneNumber, {
        code: otpCode,
        timestamp,
        attempts: 0,
      });

      // In a real app, you would integrate with an SMS service like:
      // - Twilio
      // - AWS SNS
      // - Firebase Phone Auth
      // - MSG91
      // - TextLocal

      // For demo purposes, we'll simulate SMS sending
      console.log(`SMS OTP for ${phoneNumber}: ${otpCode}`);

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Return success with OTP code for demo
      return {
        success: true,
        otpCode: otpCode, // Only for demo - remove in production
      };
    } catch (error) {
      console.error("SMS sending error:", error);
      return { success: false, error: "Failed to send SMS. Please try again." };
    }
  }

  // Verify OTP
  async verifyOTP(phoneNumber: string, otpCode: string): Promise<SMSResult> {
    try {
      const storedData = this.otpStorage.get(phoneNumber);

      if (!storedData) {
        return {
          success: false,
          error: "No OTP found. Please request a new code.",
        };
      }

      // Check if OTP has expired
      const currentTime = Date.now();
      if (currentTime - storedData.timestamp > this.OTP_EXPIRY) {
        this.otpStorage.delete(phoneNumber);
        return {
          success: false,
          error: "OTP has expired. Please request a new code.",
        };
      }

      // Check attempts limit
      if (storedData.attempts >= this.MAX_ATTEMPTS) {
        this.otpStorage.delete(phoneNumber);
        return {
          success: false,
          error:
            "Maximum verification attempts exceeded. Please request a new code.",
        };
      }

      // Increment attempts
      storedData.attempts += 1;
      this.otpStorage.set(phoneNumber, storedData);

      // Verify OTP
      if (storedData.code === otpCode) {
        // Remove OTP after successful verification
        this.otpStorage.delete(phoneNumber);
        return { success: true };
      } else {
        const remainingAttempts = this.MAX_ATTEMPTS - storedData.attempts;
        return {
          success: false,
          error: `Invalid OTP. ${remainingAttempts} attempts remaining.`,
        };
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      return {
        success: false,
        error: "Verification failed. Please try again.",
      };
    }
  }

  // Validate phone number format (Indian format)
  private validatePhoneNumber(phoneNumber: string): boolean {
    // Remove any non-digits
    const cleanNumber = phoneNumber.replace(/\D/g, "");

    // Check for Indian mobile number format
    // Should be 10 digits starting with 6-9
    const indianMobileRegex = /^[6-9]\d{9}$/;

    // Also accept numbers with +91 country code
    const indiaCountryCodeRegex = /^91[6-9]\d{9}$/;

    return (
      indianMobileRegex.test(cleanNumber) ||
      indiaCountryCodeRegex.test(cleanNumber)
    );
  }

  // Format phone number for display
  formatPhoneNumber(phoneNumber: string): string {
    const cleanNumber = phoneNumber.replace(/\D/g, "");

    if (cleanNumber.length === 10) {
      return `+91-${cleanNumber}`;
    } else if (cleanNumber.length === 12 && cleanNumber.startsWith("91")) {
      return `+${cleanNumber.slice(0, 2)}-${cleanNumber.slice(2)}`;
    }

    return phoneNumber;
  }

  // Check if OTP is still valid for a phone number
  isOTPValid(phoneNumber: string): boolean {
    const storedData = this.otpStorage.get(phoneNumber);
    if (!storedData) return false;

    const currentTime = Date.now();
    return currentTime - storedData.timestamp <= this.OTP_EXPIRY;
  }

  // Get remaining time for OTP
  getOTPRemainingTime(phoneNumber: string): number {
    const storedData = this.otpStorage.get(phoneNumber);
    if (!storedData) return 0;

    const currentTime = Date.now();
    const timeElapsed = currentTime - storedData.timestamp;
    const timeRemaining = this.OTP_EXPIRY - timeElapsed;

    return Math.max(0, Math.floor(timeRemaining / 1000));
  }

  // Clear expired OTPs (cleanup function)
  cleanupExpiredOTPs(): void {
    const currentTime = Date.now();

    for (const [phoneNumber, data] of this.otpStorage.entries()) {
      if (currentTime - data.timestamp > this.OTP_EXPIRY) {
        this.otpStorage.delete(phoneNumber);
      }
    }
  }

  // Send SMS using real SMS provider (placeholder for real implementation)
  private async sendSMSWithProvider(
    phoneNumber: string,
    message: string,
  ): Promise<boolean> {
    try {
      // Example integration with Twilio
      /*
      const accountSid = 'your_account_sid';
      const authToken = 'your_auth_token';
      const client = require('twilio')(accountSid, authToken);

      const message = await client.messages.create({
        body: `Your YRJR Legal Assistant verification code is: ${otpCode}. Valid for 10 minutes.`,
        from: '+1234567890', // Your Twilio phone number
        to: phoneNumber
      });

      return message.sid ? true : false;
      */

      // Example integration with Firebase Phone Auth
      /*
      import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
      import { PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
      
      const phoneProvider = new PhoneAuthProvider(auth);
      const verificationId = await phoneProvider.verifyPhoneNumber(
        phoneNumber,
        recaptchaVerifier.current
      );
      */

      // For now, just simulate success
      return true;
    } catch (error) {
      console.error("SMS provider error:", error);
      return false;
    }
  }

  // Demo function for testing
  simulateOTPVerification(phoneNumber: string): Promise<string> {
    return new Promise((resolve) => {
      const otpCode = this.generateOTP();

      Alert.alert("Demo OTP", `Simulated OTP for ${phoneNumber}: ${otpCode}`, [
        {
          text: "Use OTP",
          onPress: () => resolve(otpCode),
        },
      ]);
    });
  }
}

export const smsService = new SMSService();
