import React, { useEffect, useState } from "react";
import { Platform } from "react-native";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";

// Platform-specific loading screen
const PlatformLoader = () => (
  <View style={styles.loader}>
    <Text style={styles.logo}>⚖️</Text>
    <Text style={styles.title}>YRJR Legal Assistant</Text>
    <ActivityIndicator size="large" color="#1e40af" style={styles.spinner} />
    <Text style={styles.subtitle}>
      {Platform.OS === "web"
        ? "Loading web experience..."
        : "Initializing mobile app..."}
    </Text>
  </View>
);

export default function PlatformEntryPoint() {
  const [isReady, setIsReady] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [hasUser, setHasUser] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Load minimal required services based on platform
      if (Platform.OS === "web") {
        // Web-only initialization
        await initializeWeb();
      } else {
        // Mobile initialization
        await initializeMobile();
      }

      // Check authentication status
      await checkAuth();
    } catch (error) {
      console.error("App initialization error:", error);
    } finally {
      setIsReady(true);
    }
  };

  const initializeWeb = async () => {
    // Minimal web initialization
    return Promise.resolve();
  };

  const initializeMobile = async () => {
    // Load mobile-specific services
    try {
      // Preload critical mobile services
      const services = await Promise.all([
        import("@/services/notifications").catch(() => null),
        import("@/services/biometric.platform").catch(() => null),
      ]);

      console.log("Mobile services loaded");
    } catch (error) {
      console.warn("Some mobile services failed to load:", error);
    }
  };

  const checkAuth = async () => {
    try {
      const { authService } = await import("@/services/auth");
      const user = await authService.getCurrentUser();
      setHasUser(!!user);
    } catch (error) {
      console.error("Auth check failed:", error);
    } finally {
      setAuthChecked(true);
    }
  };

  const navigateToApp = async () => {
    const { router } = await import("expo-router");

    if (hasUser) {
      router.replace("/(tabs)");
    } else {
      // Load optimized landing page for fast first render
      const isLandingOptimized = Platform.OS === "web";
      router.replace(isLandingOptimized ? "/landing.optimized" : "/landing");
    }
  };

  useEffect(() => {
    if (isReady && authChecked) {
      // Small delay to show the loading screen briefly
      const timer = setTimeout(navigateToApp, 500);
      return () => clearTimeout(timer);
    }
  }, [isReady, authChecked]);

  return <PlatformLoader />;
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1e40af",
    padding: 20,
  },
  logo: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  spinner: {
    marginVertical: 20,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    marginTop: 10,
  },
});
