import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { BiometricService, BiometricAuthResult } from "@/services/biometric";
import {
  LegalTheme,
  FontSizes,
  FontWeights,
  Spacing,
  BorderRadius,
} from "@/constants/Theme";
import { useColorScheme } from "@/hooks/useColorScheme";

interface BiometricAuthProps {
  visible: boolean;
  onSuccess: () => void;
  onCancel: () => void;
  title?: string;
  subtitle?: string;
  allowPINFallback?: boolean;
}

export const BiometricAuth: React.FC<BiometricAuthProps> = ({
  visible,
  onSuccess,
  onCancel,
  title = "Secure Access",
  subtitle = "Use your biometric or PIN to access the app",
  allowPINFallback = true,
}) => {
  const colorScheme = useColorScheme();
  const theme = LegalTheme[colorScheme ?? "light"];

  const [loading, setLoading] = useState(false);
  const [showPINInput, setShowPINInput] = useState(false);
  const [pin, setPin] = useState("");
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState<string>("");
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [pinSet, setPinSet] = useState(false);

  useEffect(() => {
    if (visible) {
      checkBiometricStatus();
    }
  }, [visible]);

  const checkBiometricStatus = async () => {
    try {
      const [available, enabled, hasPIN, types] = await Promise.all([
        BiometricService.isBiometricAvailable(),
        BiometricService.isBiometricEnabled(),
        BiometricService.isPINSet(),
        BiometricService.getBiometricTypes(),
      ]);

      setBiometricAvailable(available);
      setBiometricEnabled(enabled);
      setPinSet(hasPIN);

      if (available && types.length > 0) {
        setBiometricType(BiometricService.getBiometricDisplayName(types));
      }

      // Auto-trigger biometric if available and enabled
      if (available && enabled) {
        handleBiometricAuth();
      } else if (!available && !hasPIN) {
        // No security method available
        Alert.alert(
          "Security Setup Required",
          "Please set up biometric authentication or PIN in your device settings.",
          [
            { text: "Cancel", onPress: onCancel },
            { text: "Continue Anyway", onPress: onSuccess },
          ],
        );
      }
    } catch (error) {
      console.error("Error checking biometric status:", error);
    }
  };

  const handleBiometricAuth = async () => {
    try {
      setLoading(true);
      const result: BiometricAuthResult =
        await BiometricService.authenticateWithBiometrics();

      if (result.success) {
        onSuccess();
      } else {
        if (allowPINFallback && pinSet) {
          setShowPINInput(true);
        } else {
          Alert.alert(
            "Authentication Failed",
            result.error || "Please try again",
          );
        }
      }
    } catch (error) {
      console.error("Biometric authentication error:", error);
      Alert.alert("Error", "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePINAuth = async () => {
    if (pin.length < 4) {
      Alert.alert("Invalid PIN", "PIN must be at least 4 digits");
      return;
    }

    try {
      setLoading(true);
      const isValid = await BiometricService.verifyPIN(pin);

      if (isValid) {
        onSuccess();
      } else {
        Alert.alert("Invalid PIN", "The PIN you entered is incorrect");
        setPin("");
      }
    } catch (error) {
      console.error("PIN authentication error:", error);
      Alert.alert("Error", "PIN verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getBiometricIcon = () => {
    if (biometricType.includes("Face")) {
      return "face-recognition" as any;
    } else if (
      biometricType.includes("Touch") ||
      biometricType.includes("Fingerprint")
    ) {
      return "finger-print";
    }
    return "shield-checkmark";
  };

  const renderBiometricAuth = () => (
    <View style={styles.authContainer}>
      <View
        style={[
          styles.biometricIcon,
          { backgroundColor: theme.primary + "20" },
        ]}
      >
        <Ionicons name={getBiometricIcon()} size={48} color={theme.primary} />
      </View>

      <Text style={[styles.authTitle, { color: theme.text }]}>
        {biometricType} Authentication
      </Text>

      <Text style={[styles.authSubtitle, { color: theme.textSecondary }]}>
        Touch the sensor to continue
      </Text>

      <Button
        title={`Use ${biometricType}`}
        onPress={handleBiometricAuth}
        loading={loading}
        fullWidth
        gradient
        style={styles.authButton}
      />

      {allowPINFallback && pinSet && (
        <TouchableOpacity
          onPress={() => setShowPINInput(true)}
          style={styles.fallbackButton}
        >
          <Text style={[styles.fallbackText, { color: theme.primary }]}>
            Use PIN instead
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderPINAuth = () => (
    <View style={styles.authContainer}>
      <View
        style={[
          styles.biometricIcon,
          { backgroundColor: theme.secondary + "20" },
        ]}
      >
        <Ionicons name="keypad" size={48} color={theme.secondary} />
      </View>

      <Text style={[styles.authTitle, { color: theme.text }]}>
        Enter Your PIN
      </Text>

      <Text style={[styles.authSubtitle, { color: theme.textSecondary }]}>
        Enter your 4-digit PIN to continue
      </Text>

      <Input
        value={pin}
        onChangeText={setPin}
        placeholder="Enter PIN"
        secureTextEntry
        keyboardType="numeric"
        maxLength={6}
        style={styles.pinInput}
        textAlign="center"
        fontSize={24}
      />

      <Button
        title="Verify PIN"
        onPress={handlePINAuth}
        loading={loading}
        disabled={pin.length < 4}
        fullWidth
        style={styles.authButton}
      />

      {biometricAvailable && biometricEnabled && (
        <TouchableOpacity
          onPress={() => {
            setShowPINInput(false);
            setPin("");
          }}
          style={styles.fallbackButton}
        >
          <Text style={[styles.fallbackText, { color: theme.primary }]}>
            Use {biometricType} instead
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <LinearGradient
          colors={[theme.primary + "10", theme.secondary + "10"]}
          style={StyleSheet.absoluteFill}
        />

        <View style={styles.container}>
          <Card style={styles.authCard} padding="large">
            <View style={styles.header}>
              <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
              <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                {subtitle}
              </Text>
            </View>

            {loading && !showPINInput && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.primary} />
                <Text
                  style={[styles.loadingText, { color: theme.textSecondary }]}
                >
                  Authenticating...
                </Text>
              </View>
            )}

            {!loading &&
              !showPINInput &&
              biometricAvailable &&
              biometricEnabled &&
              renderBiometricAuth()}
            {!loading &&
              (showPINInput || (!biometricAvailable && pinSet)) &&
              renderPINAuth()}

            {!loading && !biometricAvailable && !pinSet && (
              <View style={styles.authContainer}>
                <View
                  style={[
                    styles.biometricIcon,
                    { backgroundColor: theme.warning + "20" },
                  ]}
                >
                  <Ionicons name="warning" size={48} color={theme.warning} />
                </View>

                <Text style={[styles.authTitle, { color: theme.text }]}>
                  No Security Method
                </Text>

                <Text
                  style={[styles.authSubtitle, { color: theme.textSecondary }]}
                >
                  Please set up biometric authentication or PIN
                </Text>

                <Button
                  title="Continue Anyway"
                  onPress={onSuccess}
                  variant="outline"
                  fullWidth
                  style={styles.authButton}
                />
              </View>
            )}

            <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
              <Text style={[styles.cancelText, { color: theme.textSecondary }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </Card>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "90%",
    maxWidth: 400,
  },
  authCard: {
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSizes.md,
    textAlign: "center",
    lineHeight: 22,
  },
  authContainer: {
    alignItems: "center",
    width: "100%",
  },
  biometricIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  authTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.sm,
  },
  authSubtitle: {
    fontSize: FontSizes.sm,
    textAlign: "center",
    marginBottom: Spacing.xl,
    lineHeight: 20,
  },
  authButton: {
    marginTop: Spacing.lg,
  },
  pinInput: {
    marginBottom: Spacing.lg,
    letterSpacing: 8,
  },
  fallbackButton: {
    marginTop: Spacing.lg,
    padding: Spacing.sm,
  },
  fallbackText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: Spacing.xl,
  },
  loadingText: {
    fontSize: FontSizes.sm,
    marginTop: Spacing.md,
  },
  cancelButton: {
    marginTop: Spacing.xl,
    padding: Spacing.sm,
  },
  cancelText: {
    fontSize: FontSizes.sm,
    textAlign: "center",
  },
});
