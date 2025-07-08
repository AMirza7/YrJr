import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
} from "react-native";
import { biometricService, BiometricCapabilities } from "@/services/biometric";
import { useModal } from "@/contexts/ModalContext";

interface BiometricAuthProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mode: "setup" | "authenticate";
  title?: string;
  message?: string;
}

export default function BiometricAuth({
  visible,
  onClose,
  onSuccess,
  mode,
  title,
  message,
}: BiometricAuthProps) {
  const [capabilities, setCapabilities] =
    useState<BiometricCapabilities | null>(null);
  const [loading, setLoading] = useState(false);
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [showPinInput, setShowPinInput] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    if (visible) {
      loadCapabilities();
      checkIfEnabled();
    }
  }, [visible]);

  const loadCapabilities = async () => {
    const caps = await biometricService.checkCapabilities();
    setCapabilities(caps);
  };

  const checkIfEnabled = async () => {
    const enabled = await biometricService.isBiometricEnabled();
    setIsEnabled(enabled);
  };

  const handleSetupBiometric = async () => {
    if (!capabilities) return;

    setLoading(true);
    try {
      if (!capabilities.hasHardware) {
        Alert.alert(
          "Not Available",
          "Biometric hardware is not available on this device.",
        );
        return;
      }

      if (!capabilities.isEnrolled) {
        Alert.alert(
          "No Biometrics Enrolled",
          "Please enroll your fingerprint or face in device settings first.",
        );
        return;
      }

      // If setting up, require PIN as fallback
      if (mode === "setup" && !pin) {
        setShowPinInput(true);
        return;
      }

      if (mode === "setup" && pin !== confirmPin) {
        Alert.alert("Error", "PINs do not match. Please try again.");
        return;
      }

      const result = await biometricService.enableBiometric(
        mode === "setup" ? pin : undefined,
      );

      if (result.success) {
        Alert.alert(
          "Success!",
          `${biometricService.getBiometricTypeString(result.authType!)} authentication has been enabled.`,
          [{ text: "OK", onPress: onSuccess }],
        );
      } else {
        Alert.alert(
          "Error",
          result.error || "Failed to enable biometric authentication",
        );
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleAuthenticate = async () => {
    setLoading(true);
    try {
      const result = await biometricService.authenticate(
        message || "Authenticate to continue",
      );

      if (result.success) {
        onSuccess();
      } else {
        Alert.alert(
          "Authentication Failed",
          result.error || "Please try again",
        );
      }
    } catch (error) {
      Alert.alert("Error", "Authentication error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDisableBiometric = async () => {
    Alert.alert(
      "Disable Biometric Authentication",
      "Are you sure you want to disable biometric authentication?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Disable",
          style: "destructive",
          onPress: async () => {
            const success = await biometricService.disableBiometric();
            if (success) {
              setIsEnabled(false);
              Alert.alert(
                "Disabled",
                "Biometric authentication has been disabled.",
              );
            } else {
              Alert.alert(
                "Error",
                "Failed to disable biometric authentication",
              );
            }
          },
        },
      ],
    );
  };

  const renderSetupContent = () => {
    if (!capabilities) {
      return (
        <View style={styles.content}>
          <Text style={styles.loadingText}>
            Checking device capabilities...
          </Text>
        </View>
      );
    }

    if (!capabilities.hasHardware) {
      return (
        <View style={styles.content}>
          <Text style={styles.errorIcon}>❌</Text>
          <Text style={styles.errorTitle}>Not Supported</Text>
          <Text style={styles.errorMessage}>
            This device does not support biometric authentication.
          </Text>
        </View>
      );
    }

    if (!capabilities.isEnrolled) {
      return (
        <View style={styles.content}>
          <Text style={styles.warningIcon}>⚠️</Text>
          <Text style={styles.warningTitle}>Setup Required</Text>
          <Text style={styles.warningMessage}>
            Please enroll your biometric credentials in device settings first.
          </Text>
        </View>
      );
    }

    if (isEnabled) {
      return (
        <View style={styles.content}>
          <Text style={styles.successIcon}>✅</Text>
          <Text style={styles.successTitle}>Already Enabled</Text>
          <Text style={styles.successMessage}>
            Biometric authentication is already enabled for your account.
          </Text>

          <TouchableOpacity
            style={styles.disableButton}
            onPress={handleDisableBiometric}
          >
            <Text style={styles.disableButtonText}>Disable Biometric Auth</Text>
          </TouchableOpacity>
        </View>
      );
    }

    const supportedTypeNames = capabilities.supportedTypes
      .map((type) => biometricService.getBiometricTypeString(type))
      .join(", ");

    return (
      <View style={styles.content}>
        <Text style={styles.biometricIcon}>🔐</Text>
        <Text style={styles.title}>
          {title || "Enable Biometric Authentication"}
        </Text>
        <Text style={styles.message}>
          Use {supportedTypeNames} to quickly and securely access your legal
          documents.
        </Text>

        {showPinInput && (
          <View style={styles.pinSection}>
            <Text style={styles.pinLabel}>Set Backup PIN (Required)</Text>
            <TextInput
              style={styles.pinInput}
              value={pin}
              onChangeText={setPin}
              placeholder="Enter 4-6 digit PIN"
              secureTextEntry
              keyboardType="numeric"
              maxLength={6}
            />
            <TextInput
              style={styles.pinInput}
              value={confirmPin}
              onChangeText={setConfirmPin}
              placeholder="Confirm PIN"
              secureTextEntry
              keyboardType="numeric"
              maxLength={6}
            />
          </View>
        )}

        <TouchableOpacity
          style={[styles.setupButton, loading && styles.buttonDisabled]}
          onPress={handleSetupBiometric}
          disabled={loading}
        >
          <Text style={styles.setupButtonText}>
            {loading ? "Setting up..." : `Enable ${supportedTypeNames}`}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderAuthContent = () => {
    if (!capabilities?.hasHardware || !isEnabled) {
      return (
        <View style={styles.content}>
          <Text style={styles.errorIcon}>❌</Text>
          <Text style={styles.errorTitle}>Not Available</Text>
          <Text style={styles.errorMessage}>
            Biometric authentication is not available or not enabled.
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.content}>
        <Text style={styles.biometricIcon}>🔐</Text>
        <Text style={styles.title}>{title || "Authenticate"}</Text>
        <Text style={styles.message}>
          {message || "Use your biometric to authenticate"}
        </Text>

        <TouchableOpacity
          style={[styles.authButton, loading && styles.buttonDisabled]}
          onPress={handleAuthenticate}
          disabled={loading}
        >
          <Text style={styles.authButtonText}>
            {loading ? "Authenticating..." : "Authenticate"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {mode === "setup" ? renderSetupContent() : renderAuthContent()}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: 20,
    width: "100%",
    maxWidth: 400,
    maxHeight: "80%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 16,
    paddingBottom: 0,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
    color: "#6b7280",
    fontWeight: "bold",
  },
  content: {
    padding: 24,
    alignItems: "center",
  },
  biometricIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  successIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  warningIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 12,
    textAlign: "center",
  },
  successTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#059669",
    marginBottom: 12,
    textAlign: "center",
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#dc2626",
    marginBottom: 12,
    textAlign: "center",
  },
  warningTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#f59e0b",
    marginBottom: 12,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24,
  },
  successMessage: {
    fontSize: 16,
    color: "#059669",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24,
  },
  errorMessage: {
    fontSize: 16,
    color: "#dc2626",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24,
  },
  warningMessage: {
    fontSize: 16,
    color: "#f59e0b",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24,
  },
  loadingText: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
  },
  pinSection: {
    width: "100%",
    marginBottom: 24,
  },
  pinLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  pinInput: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    textAlign: "center",
  },
  setupButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: "100%",
  },
  authButton: {
    backgroundColor: "#059669",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: "100%",
  },
  disableButton: {
    backgroundColor: "#dc2626",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 16,
  },
  setupButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  authButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  disableButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
