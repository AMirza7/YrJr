import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { LegalTheme, FontSizes, FontWeights, Spacing } from "@/constants/Theme";
import { useColorScheme } from "@/hooks/useColorScheme";
import { AuthService } from "@/services/auth";

export default function EmailVerificationScreen() {
  const colorScheme = useColorScheme();
  const theme = LegalTheme[colorScheme ?? "light"];
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleSendOtp = async () => {
    if (!email || !email.includes("@")) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const result = await AuthService.sendEmailOTP(email);
      if (result.success) {
        setIsOtpSent(true);
        setResendTimer(60);
        Alert.alert("Success", "OTP sent to your email address");
      } else {
        Alert.alert("Error", result.message);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 6) {
      Alert.alert("Error", "Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const result = await AuthService.verifyEmailOTP(email, otp);
      if (result.success) {
        router.push("/(onboarding)/subscription");
      } else {
        Alert.alert("Error", result.message);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to verify OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = () => {
    if (resendTimer === 0) {
      handleSendOtp();
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>
          Email Verification
        </Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View
            style={[styles.icon, { backgroundColor: theme.primary + "20" }]}
          >
            <Ionicons name="mail" size={48} color={theme.primary} />
          </View>
        </View>

        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          {isOtpSent
            ? `Enter the 6-digit OTP sent to ${email}`
            : "Enter your email address to receive verification code"}
        </Text>

        <View style={styles.formContainer}>
          {!isOtpSent ? (
            <Input
              label="Email Address"
              placeholder="Enter your email address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon="mail"
            />
          ) : (
            <Input
              label="Verification Code"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChangeText={setOtp}
              keyboardType="numeric"
              maxLength={6}
              leftIcon="lock-closed"
            />
          )}

          {isOtpSent && (
            <View style={styles.resendContainer}>
              <Text style={[styles.resendText, { color: theme.textSecondary }]}>
                Didn't receive the code?
              </Text>
              <TouchableOpacity
                onPress={handleResendOtp}
                disabled={resendTimer > 0}
              >
                <Text
                  style={[
                    styles.resendButton,
                    {
                      color:
                        resendTimer > 0 ? theme.textTertiary : theme.primary,
                    },
                  ]}
                >
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title={isOtpSent ? "Verify Email" : "Send OTP"}
            onPress={isOtpSent ? handleVerifyOtp : handleSendOtp}
            variant="primary"
            size="large"
            fullWidth
            gradient
            loading={loading}
            disabled={isOtpSent ? !otp : !email}
          />
        </View>

        <View style={styles.helpContainer}>
          <Text style={[styles.helpText, { color: theme.textTertiary }]}>
            💡 For demo purposes, use OTP: 123456
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  backButton: {
    padding: Spacing.sm,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.semibold,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  icon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  subtitle: {
    fontSize: FontSizes.md,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },
  formContainer: {
    marginBottom: Spacing.xl,
  },
  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing.md,
  },
  resendText: {
    fontSize: FontSizes.sm,
    marginRight: Spacing.xs,
  },
  resendButton: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
  },
  buttonContainer: {
    marginBottom: Spacing.lg,
  },
  helpContainer: {
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
  },
  helpText: {
    fontSize: FontSizes.sm,
    textAlign: "center",
    fontStyle: "italic",
  },
});
