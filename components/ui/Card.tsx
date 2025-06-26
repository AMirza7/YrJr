import React from "react";
import { View, StyleSheet, ViewStyle, TouchableOpacity } from "react-native";
import { LegalTheme, BorderRadius, Spacing, Shadows } from "@/constants/Theme";
import { useColorScheme } from "@/hooks/useColorScheme";

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  disabled?: boolean;
  padding?: "none" | "small" | "medium" | "large";
  shadow?: "none" | "small" | "medium" | "large";
  borderRadius?: "small" | "medium" | "large";
  backgroundColor?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  disabled = false,
  padding = "medium",
  shadow = "small",
  borderRadius = "medium",
  backgroundColor,
}) => {
  const colorScheme = useColorScheme();
  const theme = LegalTheme[colorScheme ?? "light"];

  const getCardStyles = (): ViewStyle => {
    const baseStyles: ViewStyle = {
      backgroundColor: backgroundColor || theme.cardBackground,
      borderWidth: 1,
      borderColor: theme.cardBorder,
    };

    // Padding
    switch (padding) {
      case "none":
        break;
      case "small":
        baseStyles.padding = Spacing.sm;
        break;
      case "large":
        baseStyles.padding = Spacing.xl;
        break;
      default:
        baseStyles.padding = Spacing.md;
        break;
    }

    // Border radius
    switch (borderRadius) {
      case "small":
        baseStyles.borderRadius = BorderRadius.sm;
        break;
      case "large":
        baseStyles.borderRadius = BorderRadius.lg;
        break;
      default:
        baseStyles.borderRadius = BorderRadius.md;
        break;
    }

    // Shadow
    switch (shadow) {
      case "none":
        break;
      case "medium":
        Object.assign(baseStyles, Shadows.md);
        break;
      case "large":
        Object.assign(baseStyles, Shadows.lg);
        break;
      default:
        Object.assign(baseStyles, Shadows.sm);
        break;
    }

    // Disabled styles
    if (disabled) {
      baseStyles.opacity = 0.6;
    }

    return baseStyles;
  };

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        style={[getCardStyles(), style]}
        activeOpacity={0.8}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={[getCardStyles(), style]}>{children}</View>;
};
