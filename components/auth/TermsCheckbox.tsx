import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocalization } from "@/contexts/LocalizationContext";

interface TermsCheckboxProps {
  isChecked: boolean;
  onToggle: (checked: boolean) => void;
  error?: boolean;
}

export default function TermsCheckbox({
  isChecked,
  onToggle,
  error,
}: TermsCheckboxProps) {
  const { theme } = useTheme();
  const { t } = useLocalization();

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginVertical: 16,
    },
    checkbox: {
      width: 20,
      height: 20,
      borderRadius: 4,
      borderWidth: 2,
      borderColor: error ? theme.colors.error : theme.colors.border,
      backgroundColor: isChecked ? theme.colors.primary : theme.colors.surface,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
      marginTop: 2,
    },
    checkboxChecked: {
      borderColor: theme.colors.primary,
    },
    checkboxError: {
      borderColor: theme.colors.error,
    },
    checkmark: {
      color: theme.colors.surface,
      fontSize: 14,
      fontWeight: "bold",
    },
    textContainer: {
      flex: 1,
    },
    text: {
      fontSize: theme.typography.sizes.sm,
      color: error ? theme.colors.error : theme.colors.text,
      lineHeight: 20,
    },
    link: {
      color: theme.colors.primary,
      fontWeight: theme.typography.weights.medium,
    },
    errorContainer: {
      marginTop: 4,
    },
    errorText: {
      fontSize: theme.typography.sizes.xs,
      color: theme.colors.error,
    },
  });

  return (
    <View>
      <TouchableOpacity
        style={styles.container}
        onPress={() => onToggle(!isChecked)}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.checkbox,
            isChecked && styles.checkboxChecked,
            error && styles.checkboxError,
          ]}
        >
          {isChecked && <Text style={styles.checkmark}>✓</Text>}
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.text}>
            {t("byCreatingAccount")}{" "}
            <Text style={styles.link}>{t("termsAndConditions")}</Text> and{" "}
            <Text style={styles.link}>{t("privacyPolicy")}</Text>
          </Text>
        </View>
      </TouchableOpacity>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {t("agreeToTerms")} required to continue
          </Text>
        </View>
      )}
    </View>
  );
}
