import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { smsService } from "@/services/sms";
import { authService } from "@/services/auth";

export default function VerifyPhoneScreen() {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  useEffect(() => {
    // Auto-send OTP when component mounts
    if (phone) {
      sendOTP();
    }
  }, [phone]);

  const sendOTP = async () => {
    if (!phone) return;

    try {
      setResendLoading(true);
      const result = await smsService.sendOTP(phone);

      if (result.success) {
        setTimeLeft(120);
        Alert.alert(
          "OTP Sent",
          `Verification code sent to ${phone}${result.otpCode ? `\n\nFor demo: ${result.otpCode}` : ""}`,
        );
      } else {
        Alert.alert("Error", result.error || "Failed to send OTP");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to send OTP. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) {
      // Handle paste operation
      const pastedOtp = value.slice(0, 6).split("");
      const newOtp = [...otp];
      pastedOtp.forEach((digit, i) => {
        if (i < 6) newOtp[i] = digit;
      });
      setOtp(newOtp);

      // Focus the next empty input or the last input
      const nextIndex = Math.min(pastedOtp.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (event: any, index: number) => {
    if (event.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      Alert.alert("Error", "Please enter the complete 6-digit code");
      return;
    }

    if (!phone) {
      Alert.alert("Error", "Phone number not found");
      return;
    }

    setLoading(true);
    try {
      const result = await smsService.verifyOTP(phone, otpCode);

      if (result.success) {
        // Update user phone verification status
        await authService.updatePhoneVerification(phone, true);

        Alert.alert(
          "Phone Verified!",
          "Your phone number has been successfully verified.",
          [
            {
              text: "Continue",
              onPress: () => {
                // Navigate based on user state
                router.replace("/login");
              },
            },
          ],
        );
      } else {
        Alert.alert("Verification Failed", result.error || "Invalid OTP code");
      }
    } catch (error) {
      Alert.alert("Error", "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = () => {
    if (timeLeft > 0) return;
    sendOTP();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const isOtpComplete = otp.every((digit) => digit.length === 1);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Verify Phone Number</Text>
        <Text style={styles.subtitle}>
          Enter the 6-digit code sent to{"\n"}
          <Text style={styles.phoneNumber}>{phone}</Text>
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.otpContainer}>
          <Text style={styles.label}>Enter Verification Code</Text>
          <View style={styles.otpInputContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                style={[styles.otpInput, digit && styles.otpInputFilled]}
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={(event) => handleKeyPress(event, index)}
                keyboardType="numeric"
                maxLength={1}
                selectTextOnFocus
                textAlign="center"
              />
            ))}
          </View>
        </View>

        <View style={styles.resendContainer}>
          {timeLeft > 0 ? (
            <Text style={styles.timerText}>
              Resend code in {formatTime(timeLeft)}
            </Text>
          ) : (
            <TouchableOpacity
              onPress={handleResendOtp}
              disabled={resendLoading}
              style={styles.resendButton}
            >
              <Text style={styles.resendButtonText}>
                {resendLoading ? "Sending..." : "Resend Code"}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.verifyButton,
            {
              opacity: isOtpComplete && !loading ? 1 : 0.6,
            },
          ]}
          onPress={handleVerifyOtp}
          disabled={!isOtpComplete || loading}
        >
          <Text style={styles.verifyButtonText}>
            {loading ? "Verifying..." : "Verify Phone Number"}
          </Text>
        </TouchableOpacity>

        <View style={styles.infoContainer}>
          <Text style={styles.infoIcon}>🔒</Text>
          <Text style={styles.infoText}>
            We use phone verification to secure your account and prevent
            unauthorized access.
          </Text>
        </View>

        <View style={styles.helpContainer}>
          <Text style={styles.helpTitle}>Didn't receive the code?</Text>
          <Text style={styles.helpText}>
            • Check your SMS messages{"\n"}• Ensure you have network coverage
            {"\n"}• Try resending the code{"\n"}• Contact support if issues
            persist
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#059669",
    padding: 20,
    paddingTop: 50,
  },
  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    lineHeight: 22,
  },
  phoneNumber: {
    fontWeight: "600",
    fontSize: 18,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  otpContainer: {
    marginTop: 30,
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 16,
    textAlign: "center",
  },
  otpInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  otpInput: {
    width: 48,
    height: 56,
    borderWidth: 2,
    borderColor: "#d1d5db",
    borderRadius: 12,
    fontSize: 24,
    fontWeight: "600",
    color: "#111827",
    backgroundColor: "#f9fafb",
  },
  otpInputFilled: {
    borderColor: "#059669",
    backgroundColor: "#ecfdf5",
  },
  resendContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  timerText: {
    fontSize: 14,
    color: "#6b7280",
  },
  resendButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  resendButtonText: {
    fontSize: 14,
    color: "#059669",
    fontWeight: "500",
  },
  verifyButton: {
    backgroundColor: "#059669",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 30,
  },
  verifyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#f0f9ff",
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#0ea5e9",
    marginBottom: 20,
  },
  infoIcon: {
    fontSize: 16,
    marginRight: 8,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: "#0369a1",
    lineHeight: 20,
  },
  helpContainer: {
    backgroundColor: "#f9fafb",
    padding: 16,
    borderRadius: 12,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  helpText: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
  },
});
