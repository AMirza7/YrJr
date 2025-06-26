import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";

import { Button } from "@/components/ui/Button";
import { BiometricAuth } from "@/components/auth/BiometricAuth";
import { useAuth } from "@/components/auth/AuthContext";
import { BiometricService } from "@/services/biometric";
import { DEMO_ACCOUNTS, ROLE_DISPLAY_INFO } from "@/constants/AuthConstants";
import { LegalTheme, FontSizes, FontWeights, Spacing } from "@/constants/Theme";
import { useColorScheme } from "@/hooks/useColorScheme";
import { UserRole } from "@/types";

export default function LoginScreen() {
  const colorScheme = useColorScheme();
  const theme = LegalTheme[colorScheme ?? "light"];
  const { login, loginWithDemo } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [showBiometric, setShowBiometric] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    try {
      const isAvailable = await BiometricService.isBiometricAvailable();
      const isEnabled = await BiometricService.isBiometricEnabled();
      setBiometricAvailable(isAvailable && isEnabled);
    } catch (error) {
      console.error("Error checking biometric availability:", error);
    }
  };

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const result = await login(formData);
      if (result.success) {
        router.replace("/(main)/(tabs)/home");
      } else {
        Alert.alert("Login Failed", result.message);
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (role: UserRole) => {
    setIsLoading(true);
    try {
      const result = await loginWithDemo(role);
      if (result.success) {
        router.replace("/(main)/(tabs)/home");
      } else {
        Alert.alert("Login Failed", result.message);
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToWelcome = () => {
    router.back();
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

      <LinearGradient
        colors={[theme.primary + "20", theme.secondary + "20"]}
        style={styles.gradient}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={[styles.backButton, { backgroundColor: theme.card }]}
              onPress={handleBackToWelcome}
            >
              <Ionicons name="arrow-back" size={24} color={theme.text} />
            </TouchableOpacity>

            <View style={styles.logoContainer}>
              <View
                style={[styles.logoCircle, { backgroundColor: theme.primary }]}
              >
                <Text style={[styles.logoText, { color: theme.textInverse }]}>
                  ⚖️
                </Text>
              </View>
              <Text style={[styles.appName, { color: theme.text }]}>
                YrJr Login
              </Text>
              <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                Welcome back to your legal assistant
              </Text>
            </View>
          </View>

          {/* Login Form */}
          {!showDemo && (
            <View
              style={[styles.formContainer, { backgroundColor: theme.card }]}
            >
              <Text style={[styles.formTitle, { color: theme.text }]}>
                Sign In
              </Text>

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: theme.text }]}>
                  Email
                </Text>
                <View
                  style={[
                    styles.inputWrapper,
                    {
                      borderColor: theme.border,
                      backgroundColor: theme.background,
                    },
                  ]}
                >
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color={theme.textSecondary}
                  />
                  <TextInput
                    style={[styles.textInput, { color: theme.text }]}
                    placeholder="Enter your email"
                    placeholderTextColor={theme.textSecondary}
                    value={formData.email}
                    onChangeText={(text) =>
                      setFormData((prev) => ({ ...prev, email: text }))
                    }
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: theme.text }]}>
                  Password
                </Text>
                <View
                  style={[
                    styles.inputWrapper,
                    {
                      borderColor: theme.border,
                      backgroundColor: theme.background,
                    },
                  ]}
                >
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color={theme.textSecondary}
                  />
                  <TextInput
                    style={[styles.textInput, { color: theme.text }]}
                    placeholder="Enter your password"
                    placeholderTextColor={theme.textSecondary}
                    value={formData.password}
                    onChangeText={(text) =>
                      setFormData((prev) => ({ ...prev, password: text }))
                    }
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Ionicons
                      name={showPassword ? "eye-outline" : "eye-off-outline"}
                      size={20}
                      color={theme.textSecondary}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Login Button */}
              <Button
                title={isLoading ? "Signing In..." : "Sign In"}
                onPress={handleLogin}
                variant="primary"
                size="large"
                fullWidth
                disabled={isLoading}
                gradient
                style={styles.loginButton}
              />

              {/* Demo Accounts Button */}
              <TouchableOpacity
                style={[styles.demoButton, { borderColor: theme.primary }]}
                onPress={() => setShowDemo(true)}
                disabled={isLoading}
              >
                <Ionicons
                  name="play-circle-outline"
                  size={20}
                  color={theme.primary}
                />
                <Text style={[styles.demoButtonText, { color: theme.primary }]}>
                  Try Demo Accounts
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Demo Accounts */}
          {showDemo && (
            <View
              style={[styles.demoContainer, { backgroundColor: theme.card }]}
            >
              <View style={styles.demoHeader}>
                <Text style={[styles.demoTitle, { color: theme.text }]}>
                  Demo Accounts
                </Text>
                <TouchableOpacity onPress={() => setShowDemo(false)}>
                  <Ionicons
                    name="close"
                    size={24}
                    color={theme.textSecondary}
                  />
                </TouchableOpacity>
              </View>

              <Text
                style={[styles.demoSubtitle, { color: theme.textSecondary }]}
              >
                Try different user roles with pre-configured access levels
              </Text>

              {DEMO_ACCOUNTS.map((account) => {
                const roleInfo = ROLE_DISPLAY_INFO[account.role];
                return (
                  <TouchableOpacity
                    key={account.role}
                    style={[
                      styles.demoAccountCard,
                      { backgroundColor: theme.background },
                    ]}
                    onPress={() => handleDemoLogin(account.role)}
                    disabled={isLoading}
                  >
                    <View
                      style={[
                        styles.roleIcon,
                        { backgroundColor: roleInfo.color + "20" },
                      ]}
                    >
                      <Ionicons
                        name={roleInfo.icon as any}
                        size={24}
                        color={roleInfo.color}
                      />
                    </View>
                    <View style={styles.roleInfo}>
                      <Text style={[styles.roleName, { color: theme.text }]}>
                        {roleInfo.title}
                      </Text>
                      <Text
                        style={[
                          styles.roleDescription,
                          { color: theme.textSecondary },
                        ]}
                      >
                        {roleInfo.description}
                      </Text>
                      <Text
                        style={[
                          styles.roleCredentials,
                          { color: theme.textSecondary },
                        ]}
                      >
                        {account.email}
                      </Text>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={theme.textSecondary}
                    />
                  </TouchableOpacity>
                );
              })}

              <TouchableOpacity
                style={[
                  styles.backToLoginButton,
                  { borderColor: theme.border },
                ]}
                onPress={() => setShowDemo(false)}
              >
                <Text
                  style={[
                    styles.backToLoginText,
                    { color: theme.textSecondary },
                  ]}
                >
                  Back to Login
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {isLoading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color={theme.primary} />
            </View>
          )}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  header: {
    paddingTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  logoContainer: {
    alignItems: "center",
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  logoText: {
    fontSize: 32,
  },
  appName: {
    fontSize: FontSizes.heading,
    fontWeight: FontWeights.bold,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSizes.md,
    textAlign: "center",
  },
  formContainer: {
    borderRadius: 16,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  formTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    marginBottom: Spacing.lg,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: Spacing.md,
  },
  inputLabel: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    marginBottom: Spacing.xs,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
    height: 50,
  },
  textInput: {
    flex: 1,
    fontSize: FontSizes.md,
    marginLeft: Spacing.sm,
  },
  loginButton: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  demoButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  demoButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    marginLeft: Spacing.sm,
  },
  demoContainer: {
    borderRadius: 16,
    padding: Spacing.lg,
  },
  demoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  demoTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
  },
  demoSubtitle: {
    fontSize: FontSizes.sm,
    marginBottom: Spacing.lg,
    lineHeight: 20,
  },
  demoAccountCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  roleIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  roleInfo: {
    flex: 1,
  },
  roleName: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.xs,
  },
  roleDescription: {
    fontSize: FontSizes.sm,
    marginBottom: Spacing.xs,
    lineHeight: 16,
  },
  roleCredentials: {
    fontSize: FontSizes.xs,
    fontStyle: "italic",
  },
  backToLoginButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: Spacing.sm,
    alignItems: "center",
    marginTop: Spacing.md,
  },
  backToLoginText: {
    fontSize: FontSizes.md,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.1)",
  },
});
