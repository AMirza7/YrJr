import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
  Animated,
  TouchableWithoutFeedback,
} from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface ModalAction {
  text: string;
  onPress: () => void;
  style?: "default" | "destructive" | "cancel" | "primary";
  disabled?: boolean;
}

interface PremiumModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  icon?: string;
  actions?: ModalAction[];
  children?: React.ReactNode;
  type?: "alert" | "confirm" | "custom";
  dismissible?: boolean;
  size?: "small" | "medium" | "large";
}

export default function PremiumModal({
  visible,
  onClose,
  title,
  message,
  icon,
  actions = [],
  children,
  type = "alert",
  dismissible = true,
  size = "medium",
}: PremiumModalProps) {
  const getModalWidth = () => {
    switch (size) {
      case "small":
        return screenWidth * 0.8;
      case "large":
        return screenWidth * 0.95;
      default:
        return screenWidth * 0.85;
    }
  };

  const getActionButtonStyle = (actionStyle: string) => {
    switch (actionStyle) {
      case "destructive":
        return [styles.actionButton, styles.destructiveButton];
      case "cancel":
        return [styles.actionButton, styles.cancelButton];
      case "primary":
        return [styles.actionButton, styles.primaryButton];
      default:
        return [styles.actionButton, styles.defaultButton];
    }
  };

  const getActionTextStyle = (actionStyle: string) => {
    switch (actionStyle) {
      case "destructive":
        return [styles.actionText, styles.destructiveText];
      case "cancel":
        return [styles.actionText, styles.cancelText];
      case "primary":
        return [styles.actionText, styles.primaryText];
      default:
        return [styles.actionText, styles.defaultText];
    }
  };

  const handleOverlayPress = () => {
    if (dismissible) {
      onClose();
    }
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={() => dismissible && onClose()}
    >
      <TouchableWithoutFeedback onPress={handleOverlayPress}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.modalContainer,
                {
                  width: getModalWidth(),
                  maxHeight: screenHeight * 0.8,
                },
              ]}
            >
              {/* Header */}
              {(title || icon) && (
                <View style={styles.header}>
                  {icon && <Text style={styles.icon}>{icon}</Text>}
                  {title && <Text style={styles.title}>{title}</Text>}
                </View>
              )}

              {/* Content */}
              <View style={styles.content}>
                {message && <Text style={styles.message}>{message}</Text>}
                {children}
              </View>

              {/* Actions */}
              {actions.length > 0 && (
                <View style={styles.actionsContainer}>
                  <View
                    style={[
                      styles.actions,
                      actions.length > 2 && styles.actionsVertical,
                    ]}
                  >
                    {actions.map((action, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          getActionButtonStyle(action.style || "default"),
                          actions.length === 2 && styles.actionButtonHalf,
                          actions.length > 2 && styles.actionButtonFull,
                          action.disabled && styles.disabledButton,
                        ]}
                        onPress={action.onPress}
                        disabled={action.disabled}
                        activeOpacity={0.8}
                      >
                        <Text
                          style={[
                            getActionTextStyle(action.style || "default"),
                            action.disabled && styles.disabledText,
                          ]}
                        >
                          {action.text}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

// Convenience functions for common modal types
export const showAlert = (
  title: string,
  message: string,
  onConfirm?: () => void,
  icon?: string,
) => {
  // This would typically be managed by a modal context/provider
  // For now, it's a pattern for how to use the component
  return {
    title,
    message,
    icon,
    actions: [
      {
        text: "OK",
        onPress: onConfirm || (() => {}),
        style: "primary" as const,
      },
    ],
  };
};

export const showConfirm = (
  title: string,
  message: string,
  onConfirm: () => void,
  onCancel?: () => void,
  options?: {
    confirmText?: string;
    cancelText?: string;
    destructive?: boolean;
    icon?: string;
  },
) => {
  return {
    title,
    message,
    icon: options?.icon,
    actions: [
      {
        text: options?.cancelText || "Cancel",
        onPress: onCancel || (() => {}),
        style: "cancel" as const,
      },
      {
        text: options?.confirmText || "Confirm",
        onPress: onConfirm,
        style: (options?.destructive ? "destructive" : "primary") as const,
      },
    ],
  };
};

export const showCustom = (
  title: string,
  children: React.ReactNode,
  actions: ModalAction[],
  options?: {
    icon?: string;
    size?: "small" | "medium" | "large";
    dismissible?: boolean;
  },
) => {
  return {
    title,
    children,
    actions,
    icon: options?.icon,
    size: options?.size || "medium",
    dismissible: options?.dismissible !== false,
  };
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
    transform: [{ scale: 1 }],
  },
  header: {
    padding: 24,
    paddingBottom: 16,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  icon: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    lineHeight: 26,
  },
  content: {
    padding: 24,
    paddingTop: 16,
    paddingBottom: 16,
  },
  message: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 24,
  },
  actionsContainer: {
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    padding: 16,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  actionsVertical: {
    flexDirection: "column",
  },
  actionButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  actionButtonHalf: {
    flex: 1,
  },
  actionButtonFull: {
    width: "100%",
    marginBottom: 8,
  },
  primaryButton: {
    backgroundColor: "#3b82f6",
  },
  destructiveButton: {
    backgroundColor: "#ef4444",
  },
  cancelButton: {
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  defaultButton: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  disabledButton: {
    opacity: 0.5,
  },
  actionText: {
    fontSize: 16,
    fontWeight: "600",
  },
  primaryText: {
    color: "#fff",
  },
  destructiveText: {
    color: "#fff",
  },
  cancelText: {
    color: "#6b7280",
  },
  defaultText: {
    color: "#374151",
  },
  disabledText: {
    color: "#9ca3af",
  },
});
