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
import { authService } from "@/services/auth";

export default function VerifyEmailScreen() {
  const { email, phone, nextStep } = useLocalSearchParams<{
    email: string;
    phone?: string;
    nextStep?: string;
  }>();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  useEffect(() => {
    // Auto-send verification email when component mounts
    if (email) {
      sendVerificationEmail();
    }
  }, [email]);

  const sendVerificationEmail = async () => {
    if (!email) return;

    try {
      setResendLoading(true);
      const result = await authService.sendEmailVerification(email);

      if (result.success) {
        setTimeLeft(300);
        Alert.alert(
          "Verification Email Sent",
          `Please check your email at ${email} for the verification code.${result.verificationCode ? `\n\nFor demo: ${result.verificationCode}` : ""}`,
        );
      } else {
        Alert.alert(
          "Error",
          result.error || "Failed to send verification email",
        );
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to send verification email. Please try again.",
      );
    } finally {
      setResendLoading(false);
    }
  };

  const handleCodeChange = (value: string, index: number) => {
    if (value.length > 1) {
      // Handle paste operation
      const pastedCode = value.slice(0, 6).split("");
      const newCode = [...code];
      pastedCode.forEach((digit, i) => {
        if (i < 6) newCode[i] = digit;
      });
      setCode(newCode);

      // Focus the next empty input or the last input
      const nextIndex = Math.min(pastedCode.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (event: any, index: number) => {
    if (event.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyCode = async () => {
    const verificationCode = code.join("");

    if (verificationCode.length !== 6) {
      Alert.alert("Error", "Please enter the complete 6-digit code");
      return;
    }

    if (!email) {
      Alert.alert("Error", "Email address not found");
      return;
    }

    setLoading(true);
    try {
      const result = await authService.verifyEmail(email, verificationCode);

      if (result.success) {
        if (nextStep === "phone" && phone) {
          Alert.alert(
            "Email Verified!",
            "Great! Now let's verify your phone number to complete the setup.",
            [
              {
                text: "Verify Phone",
                onPress: () =>
                  router.push({
                    pathname: "/verify-phone",
                    params: { phone },
                  }),
              },
            ],
          );
        } else {
          Alert.alert(
            "Email Verified!",
            "Your email has been successfully verified. You can now log in to your account.",
            [
              {
                text: "Continue to Login",
                onPress: () => router.replace("/login"),
              },
            ],
          );
        }
      } else {
        Alert.alert(
          "Verification Failed",
          result.error || "Invalid verification code",
        );
      }
    } catch (error) {
      Alert.alert("Error", "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = () => {
    if (timeLeft > 0) return;
    sendVerificationEmail();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const isCodeComplete = code.every((digit) => digit.length === 1);

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
        <Text style={styles.title}>Verify Email Address</Text>
        <Text style={styles.subtitle}>
          Enter the 6-digit code sent to{"\n"}
          <Text style={styles.emailAddress}>{email}</Text>
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.codeContainer}>
          <Text style={styles.label}>Enter Verification Code</Text>
          <View style={styles.codeInputContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                style={[styles.codeInput, digit && styles.codeInputFilled]}
                value={digit}
                onChangeText={(value) => handleCodeChange(value, index)}
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
              onPress={handleResendCode}
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
              opacity: isCodeComplete && !loading ? 1 : 0.6,
            },
          ]}
          onPress={handleVerifyCode}
          disabled={!isCodeComplete || loading}
        >
          <Text style={styles.verifyButtonText}>
            {loading ? "Verifying..." : "Verify Email"}
          </Text>
        </TouchableOpacity>

        <View style={styles.infoContainer}>
          <Text style={styles.infoIcon}>📧</Text>
          <Text style={styles.infoText}>
            Please check your email inbox and spam folder for the verification
            code.
            {nextStep === "phone" &&
              " After email verification, we'll verify your phone number."}
          </Text>
        </View>

        <View style={styles.helpContainer}>
          <Text style={styles.helpTitle}>Didn't receive the email?</Text>
          <Text style={styles.helpText}>
            • Check your spam/junk folder{"\n"}• Ensure the email address is
            correct{"\n"}• Try resending the code{"\n"}• Contact support if
            issues persist
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
    backgroundColor: "#1e40af",
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
  emailAddress: {
    fontWeight: "600",
    fontSize: 18,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  codeContainer: {
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
  codeInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  codeInput: {
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
  codeInputFilled: {
    borderColor: "#1e40af",
    backgroundColor: "#f0f9ff",
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
    color: "#1e40af",
    fontWeight: "500",
  },
  verifyButton: {
    backgroundColor: "#1e40af",
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
