import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
  AppState,
  AppStateStatus,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
  withSequence,
} from "react-native-reanimated";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useAuth } from "@/components/auth/AuthContext";
import {
  LegalTheme,
  FontSizes,
  FontWeights,
  Spacing,
  BorderRadius,
} from "@/constants/Theme";
import { useColorScheme } from "@/hooks/useColorScheme";

interface SessionManagerProps {
  children: React.ReactNode;
}

// Session timeout in milliseconds (30 minutes)
const SESSION_TIMEOUT = 30 * 60 * 1000;
// Warning before timeout (5 minutes)
const WARNING_TIME = 5 * 60 * 1000;

export const SessionManager: React.FC<SessionManagerProps> = ({ children }) => {
  const colorScheme = useColorScheme();
  const theme = LegalTheme[colorScheme ?? "light"];
  const { logout, isAuthenticated } = useAuth();

  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(WARNING_TIME);

  const lastActivityRef = useRef(Date.now());
  const warningTimerRef = useRef<NodeJS.Timeout>();
  const timeoutTimerRef = useRef<NodeJS.Timeout>();
  const countdownTimerRef = useRef<NodeJS.Timeout>();

  const fadeValue = useSharedValue(0);
  const scaleValue = useSharedValue(0.8);
  const pulseValue = useSharedValue(1);

  useEffect(() => {
    if (isAuthenticated) {
      resetSessionTimer();

      const handleAppStateChange = (nextAppState: AppStateStatus) => {
        if (nextAppState === "active") {
          resetSessionTimer();
        } else if (
          nextAppState === "background" ||
          nextAppState === "inactive"
        ) {
          // Pause timers when app goes to background
          clearTimers();
        }
      };

      const subscription = AppState.addEventListener(
        "change",
        handleAppStateChange,
      );

      return () => {
        clearTimers();
        subscription?.remove();
      };
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (showTimeoutWarning) {
      fadeValue.value = withTiming(1, { duration: 300 });
      scaleValue.value = withSpring(1, { damping: 15, stiffness: 200 });

      // Start pulsing animation for urgency
      pulseValue.value = withSequence(
        withTiming(1.05, { duration: 1000 }),
        withTiming(1, { duration: 1000 }),
      );

      // Start countdown
      startCountdown();
    } else {
      fadeValue.value = withTiming(0, { duration: 200 });
      scaleValue.value = withTiming(0.8, { duration: 200 });
      clearInterval(countdownTimerRef.current);
    }
  }, [showTimeoutWarning]);

  const resetSessionTimer = () => {
    lastActivityRef.current = Date.now();
    clearTimers();

    // Set warning timer
    warningTimerRef.current = setTimeout(() => {
      setShowTimeoutWarning(true);
    }, SESSION_TIMEOUT - WARNING_TIME);

    // Set logout timer
    timeoutTimerRef.current = setTimeout(() => {
      handleSessionTimeout();
    }, SESSION_TIMEOUT);
  };

  const clearTimers = () => {
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    if (timeoutTimerRef.current) clearTimeout(timeoutTimerRef.current);
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
  };

  const startCountdown = () => {
    setTimeRemaining(WARNING_TIME);

    countdownTimerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1000) {
          handleSessionTimeout();
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);
  };

  const handleSessionTimeout = async () => {
    clearTimers();
    setShowTimeoutWarning(false);

    Alert.alert(
      "Session Expired",
      "Your session has expired for security reasons. Please log in again.",
      [
        {
          text: "OK",
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              console.error("Logout error:", error);
            }
          },
        },
      ],
      { cancelable: false },
    );
  };

  const handleExtendSession = () => {
    setShowTimeoutWarning(false);
    resetSessionTimer();
  };

  const handleLogoutNow = () => {
    setShowTimeoutWarning(false);
    setShowLogoutConfirm(true);
  };

  const confirmLogout = async () => {
    setShowLogoutConfirm(false);
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
      Alert.alert("Error", "Failed to logout. Please try again.");
    }
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
    resetSessionTimer();
  };

  const formatTime = (milliseconds: number): string => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const animatedModalStyle = useAnimatedStyle(() => ({
    opacity: fadeValue.value,
    transform: [{ scale: scaleValue.value }, { scale: pulseValue.value }],
  }));

  // Add activity tracking to reset timer on user interaction
  const trackActivity = () => {
    if (isAuthenticated && !showTimeoutWarning) {
      resetSessionTimer();
    }
  };

  return (
    <View
      style={styles.container}
      onStartShouldSetResponder={() => {
        trackActivity();
        return false;
      }}
    >
      {children}

      {/* Session Timeout Warning Modal */}
      <Modal
        visible={showTimeoutWarning}
        transparent
        animationType="none"
        statusBarTranslucent
      >
        <View style={styles.modalOverlay}>
          <LinearGradient
            colors={["rgba(0,0,0,0.4)", "rgba(0,0,0,0.8)"]}
            style={StyleSheet.absoluteFill}
          />

          <Animated.View style={[animatedModalStyle]}>
            <Card
              style={[styles.warningCard, { backgroundColor: theme.surface }]}
              padding="large"
            >
              <View style={styles.warningHeader}>
                <View
                  style={[
                    styles.warningIcon,
                    { backgroundColor: theme.warning + "20" },
                  ]}
                >
                  <Ionicons name="warning" size={32} color={theme.warning} />
                </View>

                <Text style={[styles.warningTitle, { color: theme.text }]}>
                  Session Expiring Soon
                </Text>

                <Text
                  style={[
                    styles.warningMessage,
                    { color: theme.textSecondary },
                  ]}
                >
                  Your session will expire in {formatTime(timeRemaining)} for
                  security reasons.
                </Text>
              </View>

              <View style={styles.warningActions}>
                <Button
                  title="Stay Logged In"
                  onPress={handleExtendSession}
                  variant="primary"
                  gradient
                  fullWidth
                  style={styles.warningButton}
                />

                <Button
                  title="Logout Now"
                  onPress={handleLogoutNow}
                  variant="outline"
                  fullWidth
                  style={styles.warningButton}
                />
              </View>

              <Text
                style={[styles.securityNote, { color: theme.textTertiary }]}
              >
                This security measure protects your legal data from unauthorized
                access.
              </Text>
            </Card>
          </Animated.View>
        </View>
      </Modal>

      {/* Logout Confirmation Modal */}
      <Modal
        visible={showLogoutConfirm}
        transparent
        animationType="fade"
        statusBarTranslucent
      >
        <View style={styles.modalOverlay}>
          <LinearGradient
            colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.6)"]}
            style={StyleSheet.absoluteFill}
          />

          <Card
            style={[styles.confirmCard, { backgroundColor: theme.surface }]}
            padding="large"
          >
            <View style={styles.confirmHeader}>
              <View
                style={[
                  styles.confirmIcon,
                  { backgroundColor: theme.error + "20" },
                ]}
              >
                <Ionicons name="log-out" size={28} color={theme.error} />
              </View>

              <Text style={[styles.confirmTitle, { color: theme.text }]}>
                Confirm Logout
              </Text>

              <Text
                style={[styles.confirmMessage, { color: theme.textSecondary }]}
              >
                Are you sure you want to logout? You'll need to sign in again to
                access your account.
              </Text>
            </View>

            <View style={styles.confirmActions}>
              <Button
                title="Cancel"
                onPress={cancelLogout}
                variant="outline"
                style={styles.confirmButton}
              />

              <Button
                title="Logout"
                onPress={confirmLogout}
                variant="danger"
                style={styles.confirmButton}
              />
            </View>
          </Card>
        </View>
      </Modal>
    </View>
  );
};

// Hook to trigger logout confirmation
export const useLogoutConfirm = () => {
  const { logout } = useAuth();

  return () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();
          } catch (error) {
            console.error("Logout error:", error);
            Alert.alert("Error", "Failed to logout. Please try again.");
          }
        },
      },
    ]);
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
  },
  warningCard: {
    width: "100%",
    maxWidth: 400,
    borderRadius: BorderRadius.xl,
  },
  warningHeader: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  warningIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  warningTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  warningMessage: {
    fontSize: FontSizes.md,
    textAlign: "center",
    lineHeight: 22,
  },
  warningActions: {
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  warningButton: {
    marginBottom: Spacing.xs,
  },
  securityNote: {
    fontSize: FontSizes.sm,
    textAlign: "center",
    fontStyle: "italic",
  },
  confirmCard: {
    width: "100%",
    maxWidth: 350,
    borderRadius: BorderRadius.lg,
  },
  confirmHeader: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  confirmIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  confirmTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  confirmMessage: {
    fontSize: FontSizes.sm,
    textAlign: "center",
    lineHeight: 20,
  },
  confirmActions: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  confirmButton: {
    flex: 1,
  },
});
