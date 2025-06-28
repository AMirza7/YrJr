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
import { performanceMonitor } from "@/utils/performance";

// Lazy load contexts to reduce initial bundle size
const ThemeProvider = React.lazy(() =>
  import("@/contexts/ThemeContext").then((m) => ({ default: m.ThemeProvider })),
);
const LocalizationProvider = React.lazy(() =>
  import("@/contexts/LocalizationContext").then((m) => ({
    default: m.LocalizationProvider,
  })),
);

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
    performanceMonitor.startMeasure("app-init");

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
      performanceMonitor.endMeasure("app-init");
    };
  }, []);

  return (
    <Suspense fallback={<ContextLoader />}>
      <LocalizationProvider>
        <ThemeProvider>
          <StatusBar style="auto" />
          <Stack
            screenOptions={{
              headerShown: false,
              // Performance optimizations
              animationTypeForReplace: "push",
              animation: Platform.OS === "web" ? "none" : "slide_from_right",
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen
              name="landing"
              options={{
                // Preload for faster navigation
                lazy: false,
              }}
            />
            <Stack.Screen
              name="landing.optimized"
              options={{
                lazy: false,
              }}
            />

            {/* Lazy-loaded auth screens */}
            <Stack.Screen name="login" options={{ lazy: true }} />
            <Stack.Screen name="signup" options={{ lazy: true }} />
            <Stack.Screen name="verify-email" options={{ lazy: true }} />
            <Stack.Screen name="verify-phone" options={{ lazy: true }} />
            <Stack.Screen name="verification-status" options={{ lazy: true }} />
            <Stack.Screen name="profile-completion" options={{ lazy: true }} />

            {/* Main app */}
            <Stack.Screen name="(tabs)" options={{ lazy: true }} />

            {/* Feature screens - all lazy */}
            <Stack.Screen name="admin" options={{ lazy: true }} />
            <Stack.Screen name="ai-comparator" options={{ lazy: true }} />
            <Stack.Screen name="templates" options={{ lazy: true }} />
            <Stack.Screen name="flashcards" options={{ lazy: true }} />
            <Stack.Screen name="notifications" options={{ lazy: true }} />
            <Stack.Screen name="scanner" options={{ lazy: true }} />
            <Stack.Screen name="notes-vault" options={{ lazy: true }} />
            <Stack.Screen name="privacy-policy" options={{ lazy: true }} />
            <Stack.Screen name="terms-of-service" options={{ lazy: true }} />
            <Stack.Screen name="settings" options={{ lazy: true }} />
            <Stack.Screen name="help-support" options={{ lazy: true }} />
            <Stack.Screen name="subscription" options={{ lazy: true }} />
          </Stack>
        </ThemeProvider>
      </LocalizationProvider>
    </Suspense>
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
