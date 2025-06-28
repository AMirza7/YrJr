import React, { Suspense } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  Platform,
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
} from "react-native";
// import { performanceMonitor } from "@/utils/performance";

// Direct imports for stability
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LocalizationProvider } from "@/contexts/LocalizationContext";

// Minimal loading screen
const ContextLoader = () => (
  <View style={styles.loader}>
    <ActivityIndicator size="large" color="#1e40af" />
    <Text style={styles.loaderText}>Starting YRJR...</Text>
  </View>
);

export default function RootLayout() {
  React.useEffect(() => {
    // Start performance monitoring
    // performanceMonitor.startMeasure("app-init");

    // Platform-specific optimizations
    if (Platform.OS === "web") {
      // Preload critical web resources
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "font";
      link.type = "font/woff2";
      link.crossOrigin = "anonymous";
      document.head.appendChild(link);
    }

    return () => {
      // performanceMonitor.endMeasure("app-init");
    };
  }, []);

  return (
    <LocalizationProvider>
      <ThemeProvider>
        <StatusBar style="auto" />
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="landing" />
          <Stack.Screen name="login" />
          <Stack.Screen name="signup" />
          <Stack.Screen name="verify-email" />
          <Stack.Screen name="verify-phone" />
          <Stack.Screen name="verification-status" />
          <Stack.Screen name="profile-completion" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="admin" />
          <Stack.Screen name="ai-comparator" />
          <Stack.Screen name="templates" />
          <Stack.Screen name="flashcards" />
          <Stack.Screen name="notifications" />
          <Stack.Screen name="scanner" />
          <Stack.Screen name="notes-vault" />
          <Stack.Screen name="privacy-policy" />
          <Stack.Screen name="terms-of-service" />
          <Stack.Screen name="settings" />
          <Stack.Screen name="help-support" />
          <Stack.Screen name="subscription" />
        </Stack>
      </ThemeProvider>
    </LocalizationProvider>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1e40af",
  },
  loaderText: {
    color: "#fff",
    fontSize: 16,
    marginTop: 16,
    fontWeight: "500",
  },
});
