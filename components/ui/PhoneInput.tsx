import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TextInputProps,
} from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocalization } from "@/contexts/LocalizationContext";

interface PhoneInputProps
  extends Omit<TextInputProps, "value" | "onChangeText"> {
  value: string;
  onChangeText: (text: string) => void;
  error?: boolean;
  errorMessage?: string;
  containerStyle?: any;
  inputStyle?: any;
  label?: string;
}

export default function PhoneInput({
  value,
  onChangeText,
  error,
  errorMessage,
  containerStyle,
  inputStyle,
  label,
  ...props
}: PhoneInputProps) {
  const { theme } = useTheme();
  const { t } = useLocalization();

  const validateIndianPhone = (phone: string): boolean => {
    // Remove all non-digit characters
    const cleanPhone = phone.replace(/\D/g, "");

    // Check if it's exactly 10 digits and starts with valid Indian mobile prefixes
    if (cleanPhone.length === 10) {
      const validPrefixes = ["6", "7", "8", "9"];
      return validPrefixes.includes(cleanPhone[0]);
    }

    return false;
  };

  const handleTextChange = (text: string) => {
    // Remove all non-digit characters
    const cleanText = text.replace(/\D/g, "");

    // Limit to 10 digits
    const limitedText = cleanText.slice(0, 10);

    onChangeText(limitedText);
  };

  const formatDisplayValue = (phone: string): string => {
    if (phone.length === 0) return "";

    // Format as: +91-XXXXX-XXXXX
    if (phone.length <= 5) {
      return phone;
    } else {
      return `${phone.slice(0, 5)}-${phone.slice(5)}`;
    }
  };

  const isValid = validateIndianPhone(value);
  const showError =
    error || (value.length > 0 && !isValid && value.length === 10);

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
      borderColor: showError ? theme.colors.error : theme.colors.border,
      borderRadius: 8,
      backgroundColor: theme.colors.surface,
    },
    countryCode: {
      paddingLeft: 12,
      paddingRight: 8,
      fontSize: 16,
      color: theme.colors.text,
      fontWeight: "500",
    },
    separator: {
      width: 1,
      height: 20,
      backgroundColor: theme.colors.border,
      marginRight: 8,
    },
    input: {
      flex: 1,
      padding: 12,
      paddingLeft: 0,
      fontSize: 16,
      color: theme.colors.text,
    },
    errorContainer: {
      marginTop: 4,
    },
    errorText: {
      fontSize: 12,
      color: theme.colors.error,
    },
    helperContainer: {
      marginTop: 4,
    },
    helperText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    validIndicator: {
      marginTop: 4,
    },
    validText: {
      fontSize: 12,
      color: theme.colors.success,
    },
  });

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={styles.inputContainer}>
        <Text style={styles.countryCode}>+91</Text>
        <View style={styles.separator} />
        <TextInput
          {...props}
          style={[styles.input, inputStyle]}
          value={formatDisplayValue(value)}
          onChangeText={handleTextChange}
          keyboardType="phone-pad"
          maxLength={11} // Including the hyphen
          placeholderTextColor={theme.colors.textSecondary}
          placeholder="XXXXX-XXXXX"
        />
      </View>

      {showError && errorMessage && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      )}

      {!showError && value.length === 0 && (
        <View style={styles.helperContainer}>
          <Text style={styles.helperText}>{t("phoneNumberFormat")}</Text>
        </View>
      )}

      {!showError && value.length > 0 && value.length < 10 && (
        <View style={styles.helperContainer}>
          <Text style={styles.helperText}>
            {10 - value.length} more digits required
          </Text>
        </View>
      )}

      {isValid && value.length === 10 && (
        <View style={styles.validIndicator}>
          <Text style={styles.validText}>✓ Valid Indian mobile number</Text>
        </View>
      )}
    </View>
  );
}
