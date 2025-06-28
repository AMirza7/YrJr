import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  TextInputProps,
} from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocalization } from "@/contexts/LocalizationContext";

interface PasswordInputProps extends Omit<TextInputProps, "secureTextEntry"> {
  error?: boolean;
  errorMessage?: string;
  containerStyle?: any;
  inputStyle?: any;
  label?: string;
}

export default function PasswordInput({
  error,
  errorMessage,
  containerStyle,
  inputStyle,
  label,
  ...props
}: PasswordInputProps) {
  const { theme } = useTheme();
  const { t } = useLocalization();
  const [isVisible, setIsVisible] = useState(false);

  const styles = StyleSheet.create({
    container: {
      marginBottom: 16,
    },
    label: {
      fontSize: 14,
      fontWeight: "500",
      color: theme.colors.text,
      marginBottom: 6,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderColor: error ? theme.colors.error : theme.colors.border,
      borderRadius: 8,
      backgroundColor: theme.colors.surface,
    },
    input: {
      flex: 1,
      padding: 12,
      fontSize: 16,
      color: theme.colors.text,
    },
    toggleButton: {
      padding: 12,
      justifyContent: "center",
      alignItems: "center",
    },
    toggleIcon: {
      fontSize: 18,
      color: theme.colors.textSecondary,
    },
    errorContainer: {
      marginTop: 4,
    },
    errorText: {
      fontSize: 12,
      color: theme.colors.error,
    },
  });

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={styles.inputContainer}>
        <TextInput
          {...props}
          style={[styles.input, inputStyle]}
          secureTextEntry={!isVisible}
          placeholderTextColor={theme.colors.textSecondary}
        />

        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setIsVisible(!isVisible)}
          accessibilityLabel={isVisible ? t("hidePassword") : t("showPassword")}
        >
          <Text style={styles.toggleIcon}>{isVisible ? "🙈" : "👁️"}</Text>
        </TouchableOpacity>
      </View>

      {error && errorMessage && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      )}
    </View>
  );
}
