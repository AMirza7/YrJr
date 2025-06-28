import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { ThemeMode } from "@/types";
import { THEME_OPTIONS } from "@/constants/themes";

interface ThemeSelectorProps {
  showLabel?: boolean;
  compact?: boolean;
}

export default function ThemeSelector({
  showLabel = true,
  compact = false,
}: ThemeSelectorProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { theme, themeMode, setThemeMode } = useTheme();
  const { t } = useLocalization();

  const currentThemeOption = THEME_OPTIONS.find(
    (option) => option.value === themeMode,
  );

  const handleThemeSelect = (newTheme: ThemeMode) => {
    setThemeMode(newTheme);
    setIsVisible(false);
  };

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
    },
    selector: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: compact ? 8 : 12,
      paddingVertical: compact ? 6 : 8,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    selectorText: {
      fontSize: compact ? theme.typography.sizes.sm : theme.typography.sizes.md,
      color: theme.colors.text,
      marginLeft: 4,
      fontWeight: theme.typography.weights.medium,
    },
    label: {
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.textSecondary,
      marginRight: 8,
    },
    modal: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      margin: 20,
      minWidth: 280,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 8,
    },
    modalHeader: {
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    modalTitle: {
      fontSize: theme.typography.sizes.lg,
      fontWeight: theme.typography.weights.semibold,
      color: theme.colors.text,
      textAlign: "center",
    },
    themeItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    themeItemSelected: {
      backgroundColor: theme.colors.primary + "10",
    },
    themeIcon: {
      fontSize: 20,
      marginRight: 12,
    },
    themeInfo: {
      flex: 1,
    },
    themeName: {
      fontSize: theme.typography.sizes.md,
      fontWeight: theme.typography.weights.medium,
      color: theme.colors.text,
    },
    selectedIndicator: {
      color: theme.colors.primary,
      fontSize: 18,
    },
    closeButton: {
      padding: 20,
      alignItems: "center",
    },
    closeButtonText: {
      fontSize: theme.typography.sizes.md,
      color: theme.colors.textSecondary,
      fontWeight: theme.typography.weights.medium,
    },
  });

  return (
    <View style={styles.container}>
      {showLabel && <Text style={styles.label}>{t("themeSettings")}</Text>}

      <TouchableOpacity
        style={styles.selector}
        onPress={() => setIsVisible(true)}
      >
        <Text style={styles.selectorText}>
          {currentThemeOption?.icon} {compact ? "" : currentThemeOption?.label}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableOpacity
          style={styles.modal}
          activeOpacity={1}
          onPress={() => setIsVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t("themeSettings")}</Text>
            </View>

            {THEME_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.themeItem,
                  themeMode === option.value && styles.themeItemSelected,
                ]}
                onPress={() => handleThemeSelect(option.value)}
              >
                <Text style={styles.themeIcon}>{option.icon}</Text>
                <View style={styles.themeInfo}>
                  <Text style={styles.themeName}>
                    {t(
                      option.value === "light"
                        ? "lightTheme"
                        : option.value === "dark"
                          ? "darkTheme"
                          : "systemTheme",
                    )}
                  </Text>
                </View>
                {themeMode === option.value && (
                  <Text style={styles.selectedIndicator}>✓</Text>
                )}
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsVisible(false)}
            >
              <Text style={styles.closeButtonText}>{t("cancel")}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
