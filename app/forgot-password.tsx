import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  TextInput,
} from "react-native";
import { router } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import PhoneInput from "@/components/ui/PhoneInput";
import PasswordInput from "@/components/ui/PasswordInput";
import BackButton from "@/components/navigation/BackButton";

export default function ForgotPasswordScreen() {
  const { theme } = useTheme();
  const { t } = useLocalization();

  const [step, setStep] = useState<
    "method" | "phone" | "email" | "otp" | "reset"
  >("method");
  const [resetMethod, setResetMethod] = useState<"phone" | "email">("phone");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (otpTimer > 0) {
      timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [otpTimer]);

  const sendOtp = async () => {
    if (resetMethod === "phone" && !phone) {
      Alert.alert(t("error"), t("enterPhone"));
      return;
    }
    if (resetMethod === "email" && !email) {
      Alert.alert(t("error"), t("enterEmail"));
      return;
    }

    setLoading(true);
    try {
      // Simulate OTP sending
      await new Promise((resolve) => setTimeout(resolve, 1500));

      Alert.alert(
        "OTP Sent",
        resetMethod === "phone"
          ? `OTP sent to +91-${phone}`
          : `OTP sent to ${email}`,
        [
          {
            text: "OK",
            onPress: () => {
              setStep("otp");
              setOtpTimer(60);
            },
          },
        ],
      );
    } catch (error) {
      Alert.alert(t("error"), "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      Alert.alert(t("error"), "Please enter valid 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      // Simulate OTP verification
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (otp === "123456") {
        setStep("reset");
      } else {
        Alert.alert(t("error"), "Invalid OTP. Please try again.");
      }
    } catch (error) {
      Alert.alert(t("error"), "OTP verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert(t("error"), "Please enter both passwords");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert(t("error"), t("passwordsNotMatch"));
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert(t("error"), "Password must be at least 8 characters long");
      return;
    }

    setLoading(true);
    try {
      // Simulate password reset
      await new Promise((resolve) => setTimeout(resolve, 1500));

      Alert.alert(
        "Success",
        "Password reset successfully! You can now login with your new password.",
        [
          {
            text: "Login Now",
            onPress: () => router.replace("/login"),
          },
        ],
      );
    } catch (error) {
      Alert.alert(t("error"), "Password reset failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setOtpTimer(60);
      Alert.alert("Success", "OTP resent successfully!");
    } catch (error) {
      Alert.alert(t("error"), "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  const renderMethodSelection = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Choose Reset Method</Text>
      <Text style={styles.stepDescription}>
        How would you like to receive your password reset code?
      </Text>

      <TouchableOpacity
        style={[
          styles.methodOption,
          resetMethod === "phone" && styles.methodOptionSelected,
        ]}
        onPress={() => {
          setResetMethod("phone");
          setStep("phone");
        }}
      >
        <Text style={styles.methodIcon}>📱</Text>
        <View style={styles.methodContent}>
          <Text style={styles.methodTitle}>Phone Number (Recommended)</Text>
          <Text style={styles.methodDescription}>
            Get OTP via SMS to your registered mobile number
          </Text>
        </View>
        <Text style={styles.methodArrow}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.methodOption,
          resetMethod === "email" && styles.methodOptionSelected,
        ]}
        onPress={() => {
          setResetMethod("email");
          setStep("email");
        }}
      >
        <Text style={styles.methodIcon}>📧</Text>
        <View style={styles.methodContent}>
          <Text style={styles.methodTitle}>Email Address</Text>
          <Text style={styles.methodDescription}>
            Get OTP via email to your registered email address
          </Text>
        </View>
        <Text style={styles.methodArrow}>›</Text>
      </TouchableOpacity>
    </View>
  );

  const renderPhoneInput = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Enter Phone Number</Text>
      <Text style={styles.stepDescription}>
        Enter your registered mobile number to receive OTP
      </Text>

      <PhoneInput
        value={phone}
        onChangeText={setPhone}
        placeholder="XXXXX-XXXXX"
        label="Registered Phone Number"
      />

      <TouchableOpacity
        style={[styles.button, { opacity: loading ? 0.7 : 1 }]}
        onPress={sendOtp}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Sending OTP..." : "Send OTP"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backToMethodButton}
        onPress={() => setStep("method")}
      >
        <Text style={styles.backToMethodText}>← Choose different method</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmailInput = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Enter Email Address</Text>
      <Text style={styles.stepDescription}>
        Enter your registered email address to receive OTP
      </Text>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Registered Email</Text>
        <TextInput
          style={styles.input}
          placeholder="your.email@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <TouchableOpacity
        style={[styles.button, { opacity: loading ? 0.7 : 1 }]}
        onPress={sendOtp}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Sending OTP..." : "Send OTP"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backToMethodButton}
        onPress={() => setStep("method")}
      >
        <Text style={styles.backToMethodText}>← Choose different method</Text>
      </TouchableOpacity>
    </View>
  );

  const renderOtpInput = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Enter Verification Code</Text>
      <Text style={styles.stepDescription}>
        {resetMethod === "phone"
          ? `Enter the 6-digit code sent to +91-${phone}`
          : `Enter the 6-digit code sent to ${email}`}
      </Text>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>6-Digit OTP</Text>
        <TextInput
          style={[styles.input, styles.otpInput]}
          placeholder="123456"
          value={otp}
          onChangeText={setOtp}
          keyboardType="number-pad"
          maxLength={6}
          textAlign="center"
        />
      </View>

      <TouchableOpacity
        style={[styles.button, { opacity: loading ? 0.7 : 1 }]}
        onPress={verifyOtp}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Verifying..." : "Verify OTP"}
        </Text>
      </TouchableOpacity>

      <View style={styles.resendContainer}>
        {otpTimer > 0 ? (
          <Text style={styles.timerText}>Resend OTP in {otpTimer} seconds</Text>
        ) : (
          <TouchableOpacity onPress={resendOtp} disabled={loading}>
            <Text style={styles.resendText}>
              {loading ? "Sending..." : "Resend OTP"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        style={styles.backToMethodButton}
        onPress={() => setStep(resetMethod)}
      >
        <Text style={styles.backToMethodText}>← Change phone/email</Text>
      </TouchableOpacity>
    </View>
  );

  const renderPasswordReset = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Create New Password</Text>
      <Text style={styles.stepDescription}>
        Your identity has been verified. Create a new secure password.
      </Text>

      <PasswordInput
        label="New Password"
        value={newPassword}
        onChangeText={setNewPassword}
        placeholder="Enter new password"
      />

      <PasswordInput
        label="Confirm New Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Confirm new password"
        error={confirmPassword.length > 0 && newPassword !== confirmPassword}
        errorMessage={
          confirmPassword.length > 0 && newPassword !== confirmPassword
            ? t("passwordsNotMatch")
            : undefined
        }
      />

      <TouchableOpacity
        style={[styles.button, { opacity: loading ? 0.7 : 1 }]}
        onPress={resetPassword}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Resetting..." : "Reset Password"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton title="Login" color="#fff" />
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>Regain access to your account</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {step === "method" && renderMethodSelection()}
        {step === "phone" && renderPhoneInput()}
        {step === "email" && renderEmailInput()}
        {step === "otp" && renderOtpInput()}
        {step === "reset" && renderPasswordReset()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    backgroundColor: "#dc2626",
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  stepContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
  },
  stepDescription: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  methodOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: "#f9fafb",
  },
  methodOptionSelected: {
    borderColor: "#dc2626",
    backgroundColor: "#fef2f2",
  },
  methodIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  methodContent: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  methodDescription: {
    fontSize: 14,
    color: "#6b7280",
  },
  methodArrow: {
    fontSize: 20,
    color: "#9ca3af",
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  otpInput: {
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 8,
  },
  button: {
    backgroundColor: "#dc2626",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  backToMethodButton: {
    alignItems: "center",
    marginTop: 8,
  },
  backToMethodText: {
    color: "#dc2626",
    fontSize: 14,
    fontWeight: "500",
  },
  resendContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  timerText: {
    fontSize: 14,
    color: "#6b7280",
  },
  resendText: {
    fontSize: 14,
    color: "#dc2626",
    fontWeight: "500",
  },
});
