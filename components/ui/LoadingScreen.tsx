import React from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import { LegalTheme } from "@/constants/Theme";
import { useColorScheme } from "@/hooks/useColorScheme";

interface LoadingScreenProps {
  message?: string;
  showLogo?: boolean;
}

export default function LoadingScreen({
  message = "Loading...",
  showLogo = true,
}: LoadingScreenProps) {
  const colorScheme = useColorScheme();
  const theme = LegalTheme[colorScheme ?? "light"];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.background,
      paddingHorizontal: 32,
    },
    logoContainer: {
      marginBottom: 32,
      alignItems: "center",
    },
    logo: {
      fontSize: 32,
      fontWeight: "bold",
      color: theme.primary,
      marginBottom: 8,
    },
    tagline: {
      fontSize: 14,
      color: theme.textSecondary,
      textAlign: "center",
    },
    loadingContainer: {
      alignItems: "center",
      marginTop: 24,
    },
    loadingText: {
      marginTop: 16,
      fontSize: 16,
      color: theme.textSecondary,
      textAlign: "center",
    },
    dots: {
      flexDirection: "row",
      marginTop: 12,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.primary,
      marginHorizontal: 2,
      opacity: 0.3,
    },
    dotActive: {
      opacity: 1,
    },
  });

  return (
    <View style={styles.container}>
      {showLogo && (
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>YrJr</Text>
          <Text style={styles.tagline}>Legal Assistant</Text>
        </View>
      )}

      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={styles.loadingText}>{message}</Text>

        <View style={styles.dots}>
          {[1, 2, 3].map((_, index) => (
            <View
              key={index}
              style={[styles.dot, index === 0 && styles.dotActive]}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

// Export a simple centered loading spinner for inline use
export function SimpleLoadingSpinner({
  size = "small",
  color,
}: {
  size?: "small" | "large";
  color?: string;
}) {
  const colorScheme = useColorScheme();
  const theme = LegalTheme[colorScheme ?? "light"];

  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
      }}
    >
      <ActivityIndicator size={size} color={color || theme.primary} />
    </View>
  );
}
