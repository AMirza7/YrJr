import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  LegalTheme,
  BorderRadius,
  FontSizes,
  FontWeights,
  Spacing,
  Shadows,
} from "@/constants/Theme";
import { useColorScheme } from "@/hooks/useColorScheme";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "small" | "medium" | "large";
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  gradient?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  loading = false,
  disabled = false,
  fullWidth = false,
  gradient = false,
  icon,
  style,
  textStyle,
}) => {
  const colorScheme = useColorScheme();
  const theme = LegalTheme[colorScheme ?? "light"];

  const getButtonStyles = (): ViewStyle => {
    const baseStyles: ViewStyle = {
      borderRadius: BorderRadius.md,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
    };

    // Size styles
    switch (size) {
      case "small":
        baseStyles.paddingVertical = Spacing.sm;
        baseStyles.paddingHorizontal = Spacing.md;
        baseStyles.minHeight = 36;
        break;
      case "large":
        baseStyles.paddingVertical = Spacing.lg;
        baseStyles.paddingHorizontal = Spacing.xl;
        baseStyles.minHeight = 56;
        break;
      default:
        baseStyles.paddingVertical = Spacing.md;
        baseStyles.paddingHorizontal = Spacing.lg;
        baseStyles.minHeight = 48;
        break;
    }

    // Width styles
    if (fullWidth) {
      baseStyles.width = "100%";
    }

    // Variant styles
    switch (variant) {
      case "secondary":
        baseStyles.backgroundColor = theme.secondary;
        break;
      case "outline":
        baseStyles.backgroundColor = "transparent";
        baseStyles.borderWidth = 1;
        baseStyles.borderColor = theme.primary;
        break;
      case "ghost":
        baseStyles.backgroundColor = "transparent";
        break;
      case "danger":
        baseStyles.backgroundColor = theme.error;
        break;
      default:
        if (!gradient) {
          baseStyles.backgroundColor = theme.primary;
        }
        break;
    }

    // Disabled styles
    if (disabled) {
      baseStyles.opacity = 0.5;
    }

    // Shadow for non-outline variants
    if (variant !== "outline" && variant !== "ghost") {
      Object.assign(baseStyles, Shadows.sm);
    }

    return baseStyles;
  };

  const getTextStyles = (): TextStyle => {
    const baseTextStyles: TextStyle = {
      fontWeight: FontWeights.semibold,
      textAlign: "center",
    };

    // Size styles
    switch (size) {
      case "small":
        baseTextStyles.fontSize = FontSizes.sm;
        break;
      case "large":
        baseTextStyles.fontSize = FontSizes.lg;
        break;
      default:
        baseTextStyles.fontSize = FontSizes.md;
        break;
    }

    // Variant styles
    switch (variant) {
      case "outline":
        baseTextStyles.color = theme.primary;
        break;
      case "ghost":
        baseTextStyles.color = theme.primary;
        break;
      case "danger":
        baseTextStyles.color = theme.textInverse;
        break;
      default:
        baseTextStyles.color = theme.textInverse;
        break;
    }

    return baseTextStyles;
  };

  const renderContent = () => (
    <>
      {loading && (
        <ActivityIndicator
          size="small"
          color={
            variant === "outline" || variant === "ghost"
              ? theme.primary
              : theme.textInverse
          }
          style={{ marginRight: icon || title ? Spacing.sm : 0 }}
        />
      )}
      {icon && !loading && <>{icon}</>}
      {title && (
        <Text
          style={[
            getTextStyles(),
            textStyle,
            icon && { marginLeft: Spacing.sm },
          ]}
        >
          {title}
        </Text>
      )}
    </>
  );

  if (gradient && variant === "primary" && !disabled) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        style={[getButtonStyles(), style]}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[theme.primary, theme.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[StyleSheet.absoluteFill, { borderRadius: BorderRadius.md }]}
        />
        {renderContent()}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[getButtonStyles(), style]}
      activeOpacity={0.8}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};
