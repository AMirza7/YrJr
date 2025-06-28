import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { authService } from "@/services/auth";

export default function VerifyEmailScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerifyEmail = async () => {
    if (!verificationCode.trim()) {
      Alert.alert("Error", "Please enter the verification code");
      return;
    }

    if (verificationCode.length !== 6) {
      Alert.alert("Error", "Please enter a valid 6-digit code");
      return;
    }

    setLoading(true);
    try {
      // Mock verification - in real app this would call the backend
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate 90% success rate
      const isSuccess = Math.random() > 0.1;

      if (isSuccess) {
        Alert.alert(
          "Email Verified!",
          "Your email has been successfully verified. You can now log in.",
          [
            {
              text: "Continue to Login",
              onPress: () => router.replace("/login"),
            },
          ],
        );
      } else {
        Alert.alert(
          "Verification Failed",
          "Invalid verification code. Please try again.",
        );
      }
    } catch (error) {
      Alert.alert("Error", "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0) return;

    setResending(true);
    try {
      // Mock resend API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      Alert.alert(
        "Code Sent",
        "A new verification code has been sent to your email.",
      );
      setCountdown(60);
    } catch (error) {
      Alert.alert("Error", "Failed to resend verification code.");
    } finally {
      setResending(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>📧</Text>
        </View>

        <Text style={styles.title}>Verify Your Email</Text>
        <Text style={styles.subtitle}>
          We've sent a 6-digit verification code to
        </Text>
        <Text style={styles.email}>{email}</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Verification Code</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter 6-digit code"
            value={verificationCode}
            onChangeText={setVerificationCode}
            keyboardType="numeric"
            maxLength={6}
            autoCapitalize="none"
            textAlign="center"
            fontSize={20}
            letterSpacing={4}
          />
        </View>

        <TouchableOpacity
          style={[styles.verifyButton, loading && styles.buttonDisabled]}
          onPress={handleVerifyEmail}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.verifyButtonText}>Verify Email</Text>
          )}
        </TouchableOpacity>

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive the code?</Text>
          <TouchableOpacity
            onPress={handleResendCode}
            disabled={countdown > 0 || resending}
            style={styles.resendButton}
          >
            {resending ? (
              <ActivityIndicator size="small" color="#3b82f6" />
            ) : (
              <Text
                style={[
                  styles.resendButtonText,
                  countdown > 0 && styles.resendButtonTextDisabled,
                ]}
              >
                {countdown > 0 ? `Resend in ${countdown}s` : "Resend Code"}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>📱 Check your email</Text>
          <Text style={styles.infoText}>
            • Check your inbox and spam folder{"\n"}• The code expires in 10
            minutes{"\n"}• You can request a new code if needed
          </Text>
        </View>

        <View style={styles.supportContainer}>
          <Text style={styles.supportText}>
            Having trouble? Contact our support team
          </Text>
          <TouchableOpacity
            style={styles.supportButton}
            onPress={() =>
              Alert.alert(
                "Support",
                "Email: support@yrjr.app\nPhone: +91-9876543210",
              )
            }
          >
            <Text style={styles.supportButtonText}>Get Help</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    backgroundColor: "#fff",
    padding: 20,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  backButton: {
    alignSelf: "flex-start",
  },
  backButtonText: {
    fontSize: 16,
    color: "#3b82f6",
    fontWeight: "500",
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  icon: {
    fontSize: 64,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3b82f6",
    textAlign: "center",
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 16,
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    letterSpacing: 4,
  },
  verifyButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 24,
  },
  verifyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  resendContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  resendText: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 8,
  },
  resendButton: {
    padding: 8,
  },
  resendButtonText: {
    fontSize: 14,
    color: "#3b82f6",
    fontWeight: "500",
  },
  resendButtonTextDisabled: {
    color: "#9ca3af",
  },
  infoBox: {
    backgroundColor: "#f0f9ff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#dbeafe",
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e40af",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#3b82f6",
    lineHeight: 20,
  },
  supportContainer: {
    alignItems: "center",
  },
  supportText: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 12,
    textAlign: "center",
  },
  supportButton: {
    backgroundColor: "#059669",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  supportButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
});
